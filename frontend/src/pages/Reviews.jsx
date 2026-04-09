import { useEffect, useMemo, useState } from 'react'
import { createReview, getProjects, getReviews } from '../services/api'

export default function Reviews() {
  const [projects, setProjects] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [drafts, setDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)

  async function load() {
    try {
      setLoading(true)
      setError('')
      const [p, r] = await Promise.all([getProjects(), getReviews()])
      setProjects(p)
      setReviews(r)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const reviewsByProject = useMemo(() => {
    const map = new Map()
    for (const r of reviews) {
      const key = String(r.projectId)
      const list = map.get(key) || []
      list.push(r)
      map.set(key, list)
    }
    return map
  }, [reviews])

  function setDraft(projectId, patch) {
    setDrafts((prev) => ({
      ...prev,
      [projectId]: { rating: '', comment: '', ...(prev[projectId] || {}), ...patch },
    }))
  }

  async function submit(projectId) {
    const draft = drafts[projectId] || { rating: '', comment: '' }
    const comment = String(draft.comment || '').trim()
    const rating = draft.rating === '' ? '' : Number(draft.rating)

    if (!comment) {
      setError('Comment is required to submit a review.')
      return
    }
    if (draft.rating !== '' && (Number.isNaN(rating) || rating < 1 || rating > 5)) {
      setError('Rating must be between 1 and 5 (or leave empty).')
      return
    }

    try {
      setSavingId(projectId)
      setError('')
      await createReview(projectId, {
        comment,
        rating: draft.rating === '' ? null : rating,
      })
      setDraft(projectId, { rating: '', comment: '' })
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="container">
      <h2>Professor Reviews</h2>
      <p className="muted">Review projects submitted by students.</p>

      {loading ? <p>Loading...</p> : null}
      {error ? <div className="errorBox">{error}</div> : null}

      {!loading && projects.length === 0 ? (
        <p className="muted">No projects found.</p>
      ) : null}

      {!loading && projects.length > 0 ? (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Title</th>
                <th>Status</th>
                <th>Existing Reviews</th>
                <th style={{ width: 320 }}>Add Review</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const list = reviewsByProject.get(String(p.id)) || []
                const draft = drafts[p.id] || { rating: '', comment: '' }
                return (
                  <tr key={p.id}>
                    <td>{p.ownerName || p.owner?.name || '-'}</td>
                    <td>{p.title}</td>
                    <td>{p.status}</td>
                    <td>
                      {list.length === 0 ? (
                        <span className="muted">No reviews yet</span>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {list.slice(0, 3).map((r) => (
                            <li key={r.id}>
                              <span className="muted">
                                {r.professorName}
                                {r.rating ? ` (${r.rating}/5)` : ''}:{' '}
                              </span>
                              {r.comment}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      <div className="field" style={{ gap: 8 }}>
                        <select
                          value={draft.rating}
                          onChange={(e) => setDraft(p.id, { rating: e.target.value })}
                        >
                          <option value="">Rating (optional)</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <textarea
                          rows={3}
                          value={draft.comment}
                          onChange={(e) => setDraft(p.id, { comment: e.target.value })}
                          placeholder="Write feedback for the student..."
                        />
                        <button
                          type="button"
                          disabled={savingId === p.id}
                          onClick={() => submit(p.id)}
                        >
                          {savingId === p.id ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}


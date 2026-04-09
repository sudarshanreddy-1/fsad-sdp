import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getProjects, getReviews } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const role = user?.role

  const [projects, setProjects] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(role === 'STUDENT')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadStudentData() {
      if (role !== 'STUDENT') return
      try {
        setLoading(true)
        setError('')
        const [p, r] = await Promise.all([getProjects(), getReviews()])
        if (cancelled) return
        setProjects(p)
        setReviews(r)
      } catch (err) {
        if (cancelled) return
        setError(err?.response?.data?.message || 'Failed to load dashboard data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStudentData()
    return () => {
      cancelled = true
    }
  }, [role])

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

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>
        Welcome{user?.name ? `, ${user.name}` : ''}.
        {role ? ` You are logged in as ${role}.` : ''}
      </p>
      <div className="actions">
        {role === 'STUDENT' ? (
          <button type="button" onClick={() => navigate('/projects')}>
            Go to My Projects
          </button>
        ) : null}
        {role === 'PROFESSOR' ? (
          <button type="button" onClick={() => navigate('/reviews')}>
            Review Student Projects
          </button>
        ) : null}
      </div>

      {role === 'STUDENT' ? (
        <>
          <h3 style={{ marginTop: 16 }}>My Project Reviews</h3>
          {loading ? <p>Loading...</p> : null}
          {error ? <div className="errorBox">{error}</div> : null}

          {!loading && projects.length === 0 ? (
            <p className="muted">Add a project to start receiving reviews.</p>
          ) : null}

          {!loading && projects.length > 0 ? (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const list = reviewsByProject.get(String(p.id)) || []
                    return (
                      <tr key={p.id}>
                        <td>
                          <div>
                            <div>{p.title}</div>
                            <div className="muted" style={{ fontSize: '0.9rem' }}>
                              {p.status}
                            </div>
                          </div>
                        </td>
                        <td>
                          {list.length === 0 ? (
                            <span className="muted">No reviews yet</span>
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {list.map((r) => (
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
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}


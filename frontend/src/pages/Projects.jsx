import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProject, getProjects } from '../services/api'

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const list = await getProjects()
      setProjects(list)
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Failed to load projects.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(id) {
    const ok = window.confirm('Delete this project?')
    if (!ok) return
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)))
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Delete failed. Please try again.'
      setError(message)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div>
          <h2>Projects</h2>
          <p className="muted">Simple CRUD list (mock API + localStorage).</p>
        </div>
        <div className="row__right">
          <Link to="/projects/add">Add Project</Link>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <div className="errorBox">{error}</div> : null}

      {!loading && projects.length === 0 ? (
        <p className="muted">No projects yet.</p>
      ) : null}

      {!loading && projects.length > 0 ? (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>{p.status}</td>
                  <td>
                    <div className="actions actions--inline">
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/edit/${p.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}


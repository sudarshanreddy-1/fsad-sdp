import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createProject } from '../services/api'

const STATUS_OPTIONS = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']

export default function AddProject() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    status: 'NOT_STARTED',
  })
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    if (!STATUS_OPTIONS.includes(form.status))
      next.status = 'Select a valid status.'
    return next
  }, [form.description, form.status, form.title])

  const canSubmit = Object.keys(errors).length === 0 && !loading

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function onBlur(e) {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setTouched({ title: true, description: true, techStack: true, status: true })
    setServerError('')

    if (Object.keys(errors).length > 0) return

    try {
      setLoading(true)
      await createProject(form)
      navigate('/projects', { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Failed to create project.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Add Project</h2>
        <div className="row__right">
          <Link to="/projects">Back</Link>
        </div>
      </div>

      <form className="form" onSubmit={onSubmit} noValidate>
        <label className="field">
          <span>Title *</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Project title"
          />
          {touched.title && errors.title ? (
            <span className="error">{errors.title}</span>
          ) : null}
        </label>

        <label className="field">
          <span>Description *</span>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="What is this project about?"
            rows={4}
          />
          {touched.description && errors.description ? (
            <span className="error">{errors.description}</span>
          ) : null}
        </label>

        <label className="field">
          <span>Tech Stack (optional)</span>
          <input
            name="techStack"
            value={form.techStack}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g. React, Node, MongoDB"
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            onBlur={onBlur}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {touched.status && errors.status ? (
            <span className="error">{errors.status}</span>
          ) : null}
        </label>

        {serverError ? <div className="errorBox">{serverError}</div> : null}

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Saving...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}


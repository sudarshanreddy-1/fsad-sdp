import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [serverOk, setServerOk] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => {
    const next = {}

    if (!form.name.trim()) next.name = 'Name is required.'

    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.'

    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.'

    if (!form.role) next.role = 'Role is required.'
    else if (!['STUDENT', 'PROFESSOR'].includes(form.role))
      next.role = 'Select a valid role.'

    return next
  }, [form.email, form.name, form.password, form.role])

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
    setTouched({ name: true, email: true, password: true, role: true })
    setServerError('')
    setServerOk('')

    if (Object.keys(errors).length > 0) return

    try {
      setLoading(true)
      const res = await register(form)
      setServerOk(res?.data?.message || 'Registered successfully.')
      setTimeout(() => navigate('/login'), 400)
    } catch (err) {
      const status = err?.response?.status
      let message = err?.response?.data?.message || err?.response?.data
      if (!message && (status === 502 || status === 503 || status === 504 || !err?.response)) {
        message = 'Backend server is not reachable. Start backend and try again.'
      }
      if (!message) {
        message = 'Registration failed. Please try again.'
      }
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <p className="muted">Create a basic account (mock backend).</p>

      <form className="form" onSubmit={onSubmit} noValidate>
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Your name"
            autoComplete="name"
          />
          {touched.name && errors.name ? (
            <span className="error">{errors.name}</span>
          ) : null}
        </label>

        <label className="field">
          <span>Register as</span>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            onBlur={onBlur}
          >
            <option value="STUDENT">Student</option>
            <option value="PROFESSOR">Professor</option>
          </select>
          {touched.role && errors.role ? (
            <span className="error">{errors.role}</span>
          ) : null}
        </label>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {touched.email && errors.email ? (
            <span className="error">{errors.email}</span>
          ) : null}
        </label>

        <label className="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />
          {touched.password && errors.password ? (
            <span className="error">{errors.password}</span>
          ) : null}
        </label>

        {serverError ? <div className="errorBox">{serverError}</div> : null}
        {serverOk ? <div className="okBox">{serverOk}</div> : null}

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}


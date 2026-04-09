import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../services/api'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => {
    const next = {}

    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email.'

    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.'

    return next
  }, [form.email, form.password])

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
    setTouched({ email: true, password: true })
    setServerError('')

    if (Object.keys(errors).length > 0) return

    try {
      setLoading(true)
      await login({ email: form.email, password: form.password })
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Login failed. Please try again.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <p className="muted">Use your registered email and password.</p>

      <form className="form" onSubmit={onSubmit} noValidate>
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
            placeholder="••••••"
            autoComplete="current-password"
          />
          {touched.password && errors.password ? (
            <span className="error">{errors.password}</span>
          ) : null}
        </label>

        {serverError ? <div className="errorBox">{serverError}</div> : null}

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}


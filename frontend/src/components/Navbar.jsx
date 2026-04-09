import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/api'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const role = user?.role

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="nav">
      <div className="nav__left">
        <Link to="/dashboard" className="nav__brand">
          SPMS
        </Link>
        <nav className="nav__links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {role === 'STUDENT' ? (
            <>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/projects/add">Add</NavLink>
            </>
          ) : null}
          {role === 'PROFESSOR' ? <NavLink to="/reviews">Reviews</NavLink> : null}
        </nav>
      </div>
      <div className="nav__right">
        {user?.name ? (
          <span className="muted">
            Hi, {user.name}
            {role ? ` (${role})` : ''}
          </span>
        ) : null}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}


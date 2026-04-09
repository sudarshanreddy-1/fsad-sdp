import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import AddProject from './pages/AddProject'
import Dashboard from './pages/Dashboard'
import EditProject from './pages/EditProject'
import Login from './pages/Login'
import Projects from './pages/Projects'
import Reviews from './pages/Reviews'
import Register from './pages/Register'
import { getToken } from './services/api'

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
    </>
  )
}

function AuthRedirect({ children }) {
  const token = getToken()
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const token = getToken()
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/add" element={<AddProject />} />
            <Route path="/projects/edit/:id" element={<EditProject />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={['PROFESSOR']} />}>
            <Route path="/reviews" element={<Reviews />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

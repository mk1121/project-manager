import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import useAuthCheck from './hooks/useAuthCheck'
import Login from './pages/Login'
import Team from './pages/Team'
import Projects from './pages/Projects'
import Layout from './components/Layout'
function App() {
  const authChecked = useAuthCheck()

  return !authChecked ? (
    <div>Checking authentication....</div>
  ) : (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/team'
          element={
            <PrivateRoute>
              <Layout>
                <Team />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path='/projects'
          element={
            <PrivateRoute>
              <Layout>
                <Projects />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

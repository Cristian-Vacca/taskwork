import { useState, useEffect } from 'react'
import AuthPage from './modules/auth/AuthPage'
import DashboardPage from './modules/DashboardPage'

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <AuthPage />
  }

  return <DashboardPage onLogout={handleLogout} />
}
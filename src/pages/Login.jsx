import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-indigo-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md card p-6 backdrop-blur">
        <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to continue</p>
        {error && <div className="mb-3 text-sm text-rose-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full gradient-brand text-white rounded-xl py-2 font-semibold shadow-lg hover:opacity-95 transition">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          No account? <Link to="/signup" className="text-indigo-600">Create one</Link>
        </p>
      </div>
    </div>
  )
}



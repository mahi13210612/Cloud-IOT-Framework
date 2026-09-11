import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [uid, setUid] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup({ name, email, password, uid })
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-indigo-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md card p-6 backdrop-blur">
        <h2 className="text-2xl font-bold mb-1">Create your account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Link your RFID UID now or later</p>
        {error && <div className="mb-3 text-sm text-rose-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Full name</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">RFID UID (optional)</label>
            <input className="mt-1 w-full card px-3 py-2 outline-none font-mono" placeholder="e.g., UID-1234..." value={uid} onChange={(e)=>setUid(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full gradient-brand text-white rounded-xl py-2 font-semibold shadow-lg hover:opacity-95 transition">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link>
        </p>
      </div>
    </div>
  )
}



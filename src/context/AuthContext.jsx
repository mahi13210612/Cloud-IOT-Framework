import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  const signup = async ({ name, email, password, uid }) => {
    const users = readUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered')
    }
    const newUser = { id: crypto.randomUUID(), name, email, password, uid: uid || '' }
    users.push(newUser)
    writeUsers(users)
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, uid: newUser.uid })
  }

  const login = async ({ email, password }) => {
    const users = readUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      throw new Error('Invalid credentials')
    }
    setUser({ id: found.id, name: found.name, email: found.email, uid: found.uid })
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, signup, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}





import React, { useEffect, useMemo, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import StatsCards from './components/StatsCards.jsx'
import ZonesCards from './components/ZonesCards.jsx'
import VisitorsTable from './components/VisitorsTable.jsx'
import { useThingSpeak } from './hooks/useThingSpeak.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { useAuth } from './context/AuthContext.jsx'

const SUCCESS_SOUND = 'data:audio/wav;base64,UklGRkQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YYQAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg='

export default function App() {
  const { user, logout } = useAuth()
  const {
    isLoading,
    error,
    lastUpdated,
    zoneCounts,
    totalVisitors,
    recentScans,
    lastScan,
    statusLevel,
    refresh,
    refreshIntervalMs,
    channelId,
    readApiKey,
    zoneThreshold,
  } = useThingSpeak()

  const audioRef = useRef(null)

  useEffect(() => {
    if (lastScan && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [lastScan])

  const alert = useMemo(() => {
    if (statusLevel === 'overcrowded') {
      return {
        label: '⚠️ Overcrowded',
        message: 'Capacity exceeded. Please manage visitor flow.',
        tone: 'overcrowded',
      }
    }
    return {
      label: '✅ Safe Area',
      message: 'Occupancy within safe operating limits.',
      tone: 'safe',
    }
  }, [statusLevel])

  const dashboard = (
    <div className="min-h-screen bg-slate-100">
      <audio ref={audioRef} src={SUCCESS_SOUND} preload="auto" />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between card p-5 bg-white shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Smart Visitor Tracking Dashboard</h1>
            <p className="text-sm text-slate-500">Cloud-IoT Powered System</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="text-sm text-slate-600 flex items-center gap-2">
                <span>Hello, {user.name}</span>
                <button onClick={logout} className="text-slate-500 hover:text-slate-700">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Link to="/login" className="hover:text-slate-900">Login</Link>
                <span>•</span>
                <Link to="/signup" className="hover:text-slate-900">Sign up</Link>
              </div>
            )}
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition"
              onClick={refresh}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-3.9-7.5" />
                <path d="M21 3v6h-6" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>Auto refresh every {Math.round(refreshIntervalMs / 1000)}s</span>
            <span>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Waiting for data...'}</span>
          </div>
          {error && (
            <div className="card border-rose-200 bg-rose-50 p-4 text-rose-700">
              Failed to fetch data: {error}
            </div>
          )}
          {isLoading && !lastUpdated && (
            <div className="card p-4 text-sm text-slate-500">Loading data from ThingSpeak…</div>
          )}
          <StatsCards occupancy={totalVisitors} alert={alert} />
        </section>

        <section>
          <h2 className="text-lg font-medium text-slate-800 mb-3">Zone Overview</h2>
          <ZonesCards zones={zoneCounts} threshold={zoneThreshold} />
        </section>

        <section>
          <h2 className="text-lg font-medium text-slate-800 mb-3">Recent Scans</h2>
          <VisitorsTable rows={recentScans} loading={isLoading && !recentScans.length} />
        </section>

        <footer className="border-t border-slate-200 pt-4 text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>{lastUpdated ? `Last Updated: ${lastUpdated.toLocaleString()}` : 'Awaiting first update'}</span>
          <span>Data synced from ThingSpeak • Channel {channelId} • Read Key {readApiKey}</span>
        </footer>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={dashboard} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}







import React from 'react'

const toneStyles = {
  safe: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  overcrowded: 'border-rose-200 bg-rose-50 text-rose-800',
}

export default function StatsCards({ occupancy, alert }) {
  const alertToneClass = toneStyles[alert.tone] || 'border-slate-200'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card card-hover p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Occupancy</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{occupancy}</p>
          <p className="text-xs text-slate-500 mt-1">Current visitors across all zones</p>
        </div>
        <div className="text-3xl" aria-hidden="true">👥</div>
      </div>
      <div className={`card card-hover p-5 ${alertToneClass}`}>
        <p className="text-xs uppercase tracking-wide text-slate-500">Alert Status</p>
        <p className="mt-2 text-2xl font-semibold">{alert.label}</p>
        <p className="text-xs mt-1">{alert.message}</p>
      </div>
    </div>
  )
}







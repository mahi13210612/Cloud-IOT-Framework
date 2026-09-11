import React from 'react'

export default function StatusIndicator({ level }) {
  const config = {
    safe: {
      label: 'Safe Area',
      color: 'bg-emerald-100 text-emerald-700',
      icon: '✅',
    },
    moderate: {
      label: 'Moderate Crowd',
      color: 'bg-amber-100 text-amber-700',
      icon: '⚠️',
    },
    overcrowded: {
      label: 'Overcrowded',
      color: 'bg-rose-100 text-rose-700',
      icon: '🚨',
    },
  }[level] || {
    label: 'Status Unknown',
    color: 'bg-slate-100 text-slate-600',
    icon: 'ℹ️',
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}







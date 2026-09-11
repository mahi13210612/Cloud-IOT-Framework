import React from 'react'

const baseStyles = {
  base: 'card card-hover p-5 flex items-center justify-between',
  label: 'text-xs uppercase tracking-wide text-slate-500',
  value: 'mt-2 text-2xl font-semibold',
}

const toneByCount = (count, threshold) => {
  if (count > threshold) return 'border-rose-200 bg-rose-50 text-rose-800'
  if (count >= Math.ceil(threshold * 0.6)) return 'border-amber-200 bg-amber-50 text-amber-800'
  return 'border-blue-200 bg-blue-50 text-blue-800'
}

function ZoneCard({ name, count, icon, threshold }) {
  const styles = toneByCount(count, threshold)
  return (
    <div className={`${baseStyles.base} ${styles}`}>
      <div>
        <p className={baseStyles.label}>{name}</p>
        <p className={`${baseStyles.value} text-slate-900`}>{count}</p>
        <p className="text-xs text-slate-500 mt-1">Threshold: {threshold}</p>
      </div>
      <div className="text-2xl" aria-hidden="true">{icon}</div>
    </div>
  )
}

export default function ZonesCards({ zones, threshold }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ZoneCard name="Lobby" count={zones.Lobby || 0} icon="🏢" threshold={threshold} />
      <ZoneCard name="Restaurant" count={zones.Restaurant || 0} icon="🍽️" threshold={threshold} />
      <ZoneCard name="Gym" count={zones.Gym || 0} icon="💪" threshold={threshold} />
    </div>
  )
}







import React, { useMemo } from 'react'

export default function VisitorsTable({ rows, loading }) {
  const latestFirst = useMemo(() => {
    return [...rows].sort((a, b) => b.time - a.time)
  }, [rows])

  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Scans</h3>
          <p className="text-sm text-slate-500">Last 10 RFID detections</p>
        </div>
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left text-slate-500 uppercase tracking-wide text-xs">
              <th className="py-2 px-3 w-12">#</th>
              <th className="py-2 px-3">Timestamp</th>
              <th className="py-2 px-3">RFID UID</th>
              <th className="py-2 px-3">Zone</th>
              <th className="py-2 px-3">Activity</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-slate-500">Loading data...</td>
              </tr>
            )}
            {!loading && latestFirst.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-slate-500">No scans recorded yet.</td>
              </tr>
            )}
            {!loading && latestFirst.map((r, idx) => (
              <tr key={`${r.uid}-${r.time.toISOString()}-${idx}`} className="border-t border-slate-200">
                <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                <td className="py-2 px-3">{r.time.toLocaleString()}</td>
                <td className="py-2 px-3 font-mono text-slate-800">{r.uid}</td>
                <td className="py-2 px-3 text-slate-700">{r.zone}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.activity === 'Entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {r.activity || '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}







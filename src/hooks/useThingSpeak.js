import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3125767'
const READ_API_KEY = import.meta.env.VITE_THINGSPEAK_READ_API_KEY || 'RS8PT4MWEXTUA3ZJ'
const RESULTS = 10
const REFRESH_MS = 15000
const DOUBLE_SCAN_WINDOW = 5000
const EXIT_UID = '1D098A04'
const UID_ZONE_MAP = {
  '13AA8E22': 'Lobby',
  '5DADE742': 'Restaurant',
  '79A06B05': 'Gym',
}
const ZONES = ['Lobby', 'Restaurant', 'Gym']
const OCCUPANCY_THRESHOLD = 8

function initialCounts() {
  return { Lobby: 0, Restaurant: 0, Gym: 0 }
}

export function useThingSpeak() {
  const [zoneCounts, setZoneCounts] = useState(initialCounts)
  const [recentScans, setRecentScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [lastScan, setLastScan] = useState(null)

  const zoneCountsRef = useRef(zoneCounts)
  const recentScansRef = useRef(recentScans)
  const lastScanTimesRef = useRef({})
  const zoneHistoryRef = useRef([])
  const lastEntryIdRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    zoneCountsRef.current = zoneCounts
  }, [zoneCounts])

  useEffect(() => {
    recentScansRef.current = recentScans
  }, [recentScans])

  const applyUid = useCallback((counts, uid, timestamp) => {
    if (!uid) return { counts, scan: null, changed: false }
    const normalizedUid = uid.trim().toUpperCase()
    const timeValue = timestamp ? timestamp.getTime() : Date.now()

    const lastSeen = lastScanTimesRef.current[normalizedUid]
    if (lastSeen && timeValue - lastSeen < DOUBLE_SCAN_WINDOW) {
      return { counts, scan: null, changed: false }
    }
    lastScanTimesRef.current[normalizedUid] = timeValue

    let nextCounts = { ...counts }
    let scanEntry = null
    let changed = false

    if (normalizedUid === EXIT_UID) {
      const history = zoneHistoryRef.current
      while (history.length) {
        const zone = history.pop()
        if (nextCounts[zone] > 0) {
          nextCounts = { ...nextCounts, [zone]: nextCounts[zone] - 1 }
          scanEntry = { time: timestamp || new Date(), uid: normalizedUid, zone, activity: 'Exit' }
          changed = true
          break
        }
      }
    } else {
      const zone = UID_ZONE_MAP[normalizedUid]
      if (!zone) {
        return { counts, scan: null, changed: false }
      }
      nextCounts = { ...nextCounts, [zone]: (nextCounts[zone] || 0) + 1 }
      zoneHistoryRef.current.push(zone)
      scanEntry = { time: timestamp || new Date(), uid: normalizedUid, zone, activity: 'Entry' }
      changed = true
    }

    return { counts: nextCounts, scan: scanEntry, changed }
  }, [])

  const fetchData = useCallback(async () => {
    if (!CHANNEL_ID || !READ_API_KEY) {
      setError('ThingSpeak configuration missing.')
      setIsLoading(false)
      return
    }
    try {
      setError(null)
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=${RESULTS}`
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`ThingSpeak responded with ${response.status}`)
      }
      const data = await response.json()
      const feeds = Array.isArray(data?.feeds) ? data.feeds : []

      let nextCounts = { ...zoneCountsRef.current }
      const newScans = []
      let latestEntryId = lastEntryIdRef.current

      feeds
        .map((feed) => ({
          entryId: Number(feed.entry_id) || 0,
          uid: feed.field1 || '',
          createdAt: feed.created_at ? new Date(feed.created_at) : new Date(),
        }))
        .filter((item) => item.entryId > lastEntryIdRef.current)
        .sort((a, b) => a.entryId - b.entryId)
        .forEach((item) => {
          const { counts, scan, changed } = applyUid(nextCounts, item.uid, item.createdAt)
          nextCounts = counts
          if (item.entryId > latestEntryId) latestEntryId = item.entryId
          if (changed && scan) {
            newScans.push(scan)
          }
        })

      if (latestEntryId > lastEntryIdRef.current) {
        lastEntryIdRef.current = latestEntryId
      }

      if (newScans.length) {
        setZoneCounts(nextCounts)
        setRecentScans((prev) => {
          const merged = [...newScans.reverse(), ...prev]
          return merged.slice(0, 10)
        })
        setLastScan(newScans[newScans.length - 1])
      }

      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [applyUid])

  useEffect(() => {
    fetchData()
    timerRef.current = setInterval(fetchData, REFRESH_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [fetchData])

  const totalVisitors = useMemo(() => ZONES.reduce((acc, zone) => acc + zoneCounts[zone], 0), [zoneCounts])

  const statusLevel = useMemo(() => {
    if (totalVisitors > OCCUPANCY_THRESHOLD) return 'overcrowded'
    return 'safe'
  }, [totalVisitors])

  return {
    isLoading,
    error,
    lastUpdated,
    zoneCounts,
    totalVisitors,
    currentOccupancy: totalVisitors,
    recentScans,
    lastScan,
    statusLevel,
    refresh: fetchData,
    refreshIntervalMs: REFRESH_MS,
    channelId: CHANNEL_ID,
    readApiKey: READ_API_KEY,
    zoneThreshold: OCCUPANCY_THRESHOLD,
  }
}



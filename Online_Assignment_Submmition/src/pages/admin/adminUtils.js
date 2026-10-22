import { useEffect, useState } from 'react'

export function useMockResource(loadData) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    Promise.resolve()
      .then(loadData)
      .then((result) => {
        if (active) setData(result)
      })
      .catch((loadError) => {
        if (active) setError(loadError?.message || 'Unable to load this page.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt, loadData])

  const retry = () => {
    setLoading(true)
    setError('')
    setAttempt((value) => value + 1)
  }
  return { data, error, loading, retry, setData }
}

export const inputClass =
  'mt-1 block w-full rounded-lg border border-brand-silver bg-white px-3 py-2 text-sm text-brand-navy shadow-sm focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/25'

export function formatDate(value, options = { dateStyle: 'medium', timeStyle: 'short' }) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString(undefined, options)
}

import { useCallback, useEffect, useState } from 'react'

export function useInstructorResource(fetchResource, initialValue = null) {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    let active = true
    Promise.resolve()
      .then(fetchResource)
      .then((result) => {
        if (active) setData(result)
      })
      .catch((cause) => {
        if (active) setError(cause?.message || 'Unable to load data. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [fetchResource, requestId])

  const retry = useCallback(() => {
    setLoading(true)
    setError('')
    setRequestId((current) => current + 1)
  }, [])
  return { data, setData, loading, error, retry }
}

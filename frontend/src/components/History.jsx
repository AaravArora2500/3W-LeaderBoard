"use client"

import { useState, useEffect } from "react"
import { getHistory } from "../services/api"

const History = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHistory()

    // Refresh history every 10 seconds
    const interval = setInterval(fetchHistory, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data)
      setError("")
    } catch (error) {
      console.error("Error fetching history:", error)
      setError("Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPointsColor = (points) => {
    if (points >= 8) return "high-points"
    if (points >= 5) return "medium-points"
    return "low-points"
  }

  if (isLoading) {
    return (
      <div className="history">
        <h3>📊 Points History</h3>
        <div className="loading">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="history">
      <h3>📊 Points History</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="history-list">
        {history.length === 0 ? (
          <div className="no-history">No points claimed yet. Start claiming points to see history!</div>
        ) : (
          history.map((record) => (
            <div key={record._id} className="history-item">
              <div className="history-info">
                <div className="user-name">{record.userName}</div>
                <div className={`points-awarded ${getPointsColor(record.pointsAwarded)}`}>
                  +{record.pointsAwarded} points
                </div>
              </div>
              <div className="history-date">{formatDate(record.claimedAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default History

"use client"

import { useState, useEffect } from "react"
import UserSelector from "./components/UserSelector"
import ClaimButton from "./components/ClaimButton"
import Leaderboard from "./components/Leaderboard"
import History from "./components/History"
import { getUsers, addUser, claimPoints } from "./services/api"
import "./App.css"

function App() {
  // State management
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserName, setSelectedUserName] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastClaimResult, setLastClaimResult] = useState(null)
  const [error, setError] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
console.log("Using API base:", process.env.REACT_APP_API_URL);

  // Fetch users on component mount and set up polling
  useEffect(() => {
    fetchUsers()

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUsers, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update selected user name when selection changes
  useEffect(() => {
    if (selectedUser) {
      const user = users.find((u) => u._id === selectedUser)
      setSelectedUserName(user ? user.name : "")
    } else {
      setSelectedUserName("")
    }
  }, [selectedUser, users])

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
      setError("")
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to fetch users. Please check if the server is running.")
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUserName.trim()) return

    try {
      setIsLoading(true)
      const result = await addUser(newUserName.trim())
      setNewUserName("")
      await fetchUsers() // Refresh the list
      setError("")

      // Show success message briefly
      setLastClaimResult({
        message: `User "${result.user.name}" added successfully!`,
        pointsAwarded: 0,
      })

      setTimeout(() => setLastClaimResult(null), 3000)
    } catch (error) {
      console.error("Error adding user:", error)
      setError(error.message || "Failed to add user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimPoints = async () => {
    if (!selectedUser) return

    try {
      setIsLoading(true)
      const result = await claimPoints(selectedUser)
      setLastClaimResult(result)
      await fetchUsers() // Refresh the leaderboard
      setError("")

      // Clear the success message after 4 seconds
      setTimeout(() => {
        setLastClaimResult(null)
      }, 4000)
    } catch (error) {
      console.error("Error claiming points:", error)
      setError(error.message || "Failed to claim points")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (userId) => {
    setSelectedUser(userId)
    // Clear any previous claim results when selecting a new user
    setLastClaimResult(null)
  }

  if (isInitialLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <h1>🏆 3W Leaderboard</h1>
          <div className="loading">Loading application...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏆 3W Leaderboard</h1>
        <p>Select a user and claim random points to climb the leaderboard!</p>
      </header>

      {error && (
        <div className="error-banner">
          ❌ {error}
          <button
            className="retry-btn"
            onClick={() => {
              setError("")
              fetchUsers()
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="main-content">
        <div className="left-panel">
          <UserSelector
            users={users}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            newUserName={newUserName}
            setNewUserName={setNewUserName}
            onAddUser={handleAddUser}
            isLoading={isLoading}
          />

          <ClaimButton
            selectedUser={selectedUser}
            selectedUserName={selectedUserName}
            onClaim={handleClaimPoints}
            isLoading={isLoading}
            lastClaimResult={lastClaimResult}
          />
        </div>

        <div className="right-panel">
          <Leaderboard users={users} isLoading={isLoading} />
          <History />
        </div>
      </div>

      <footer className="app-footer">
        <p>Built with ❤️ by Aarav Arora</p>
      </footer>
    </div>
  )
}

export default App

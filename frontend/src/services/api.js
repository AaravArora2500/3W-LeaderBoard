const API_BASE_URL = "https://threew-leaderboard.onrender.com"

// Generic API call function with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// User API functions
export const getUsers = () => {
  return apiCall("/users")
}

export const addUser = (name) => {
  return apiCall("/users/add", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export const claimPoints = (userId) => {
  return apiCall(`/users/claim/${userId}`, {
    method: "POST",
  })
}

// History API functions
export const getHistory = () => {
  return apiCall("/history")
}

export const getUserHistory = (userId) => {
  return apiCall(`/history/user/${userId}`)
}

// Health check
export const healthCheck = () => {
  return apiCall("/health")
}

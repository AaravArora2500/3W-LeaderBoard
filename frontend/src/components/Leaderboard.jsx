const Leaderboard = ({ users, isLoading }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${rank}`
    }
  }

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return "gold"
      case 2:
        return "silver"
      case 3:
        return "bronze"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <div className="leaderboard">
        <h2>🏆 Leaderboard</h2>
        <div className="loading">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>

      {users.length === 0 ? (
        <div className="no-users">No users found</div>
      ) : (
        <div className="leaderboard-list">
          {users.map((user, index) => (
            <div key={user._id} className={`leaderboard-item ${getRankClass(index + 1)}`}>
              <div className="rank">{getRankIcon(index + 1)}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-points">{user.totalPoints} points</div>
              </div>
              {index < 3 && (
                <div className="trophy-indicator">
                  {index === 0 && "👑"}
                  {index === 1 && "⭐"}
                  {index === 2 && "🌟"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard

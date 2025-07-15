"use client"

const UserSelector = ({ users, selectedUser, onUserSelect, newUserName, setNewUserName, onAddUser, isLoading }) => {
  const handleAddUserSubmit = (e) => {
    e.preventDefault()
    if (newUserName.trim()) {
      onAddUser()
    }
  }

  return (
    <div className="user-selector">
      <h3>🎯 Select User</h3>

      {/* User Selection Dropdown */}
      <div className="select-container">
        <select
          value={selectedUser || ""}
          onChange={(e) => onUserSelect(e.target.value)}
          className="user-select"
          disabled={isLoading}
        >
          <option value="">Choose a user...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.totalPoints} points)
            </option>
          ))}
        </select>
      </div>

      {/* Add New User Section */}
      <div className="add-user-section">
        <h4>+ Add New User</h4>
        <form onSubmit={handleAddUserSubmit} className="add-user-form">
          <input
            type="text"
            placeholder="Enter user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="user-input"
            disabled={isLoading}
            maxLength={50}
          />
          <button type="submit" className="add-btn" disabled={isLoading || !newUserName.trim()}>
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserSelector

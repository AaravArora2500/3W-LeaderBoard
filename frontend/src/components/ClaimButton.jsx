"use client"

const ClaimButton = ({ selectedUser, selectedUserName, onClaim, isLoading, lastClaimResult }) => {
  return (
    <div className="claim-section">
      <div className="claim-info">
        {selectedUserName && (
          <p className="selected-user">
            Selected: <strong>{selectedUserName}</strong>
          </p>
        )}
      </div>

      <button
        onClick={onClaim}
        disabled={!selectedUser || isLoading}
        className={`claim-btn ${!selectedUser ? "disabled" : ""}`}
      >
        {isLoading ? "🎲 Claiming..." : "🎲 Claim Random Points"}
      </button>

      {lastClaimResult && (
        <div className="claim-result">
          <div className="success-message">🎉 {lastClaimResult.message}</div>
          <div className="points-awarded">
            Points Awarded: <span className="points-number">+{lastClaimResult.pointsAwarded}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimButton

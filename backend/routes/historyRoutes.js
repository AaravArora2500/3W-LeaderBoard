const express = require("express")
const History = require("../models/History")
const router = express.Router()

// Get all history records (latest first)
router.get("/", async (req, res) => {
  try {
    const history = await History.find().populate("userId", "name").sort({ claimedAt: -1 }).limit(50) // Limit to last 50 records for performance

    res.json(history)
  } catch (error) {
    console.error("Error fetching history:", error)
    res.status(500).json({ message: "Server error while fetching history" })
  }
})

// Get history for specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const userHistory = await History.find({ userId }).sort({ claimedAt: -1 })

    res.json(userHistory)
  } catch (error) {
    console.error("Error fetching user history:", error)
    res.status(500).json({ message: "Server error while fetching user history" })
  }
})

module.exports = router

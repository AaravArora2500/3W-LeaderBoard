const express = require("express")
const User = require("../models/User")
const History = require("../models/History")
const router = express.Router()

// Get all users sorted by points (leaderboard)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 })

    // Update ranks
    const updatedUsers = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
    }))

    // Save updated ranks to database
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1
      await users[i].save()
    }

    res.json(updatedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Server error while fetching users" })
  }
})

// Add new user
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "User name is required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ name: name.trim() })
    if (existingUser) {
      return res.status(400).json({ message: "User with this name already exists" })
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      totalPoints: 0,
      rank: 0,
    })

    const savedUser = await newUser.save()
    res.status(201).json({
      message: "User added successfully",
      user: savedUser,
    })
  } catch (error) {
    console.error("Error adding user:", error)
    res.status(500).json({ message: "Server error while adding user" })
  }
})

// Claim points for a user
router.post("/claim/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate random points between 1 and 10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1

    // Update user's total points
    user.totalPoints += pointsAwarded
    await user.save()

    // Create history record
    const historyRecord = new History({
      userId: user._id,
      userName: user.name,
      pointsAwarded: pointsAwarded,
    })
    await historyRecord.save()

    res.json({
      message: `${pointsAwarded} points awarded to ${user.name}!`,
      user: user,
      pointsAwarded: pointsAwarded,
    })
  } catch (error) {
    console.error("Error claiming points:", error)
    res.status(500).json({ message: "Server error while claiming points" })
  }
})

module.exports = router

const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/database")
const seedUsers = require("./seedData")


const userRoutes = require("./routes/userRoutes")
const historyRoutes = require("./routes/historyRoutes")


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin:"https://3-w-leader-board.vercel.app",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Seed initial data
seedUsers()

// Routes
app.use("/api/users", userRoutes)
app.use("/api/history", historyRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "MERN Leaderboard API is running!",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
  console.log(`API Health Check: http://localhost:${PORT}/api/health`)
})

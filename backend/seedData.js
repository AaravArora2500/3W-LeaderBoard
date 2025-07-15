const User = require("./models/User")

// Initial users as specified in requirements
const initialUsers = ["Rajma Chawal", "Aloo Parantha", "Pistoul Singh", "Bablu", "Saul Goodman", "Superman", "Kadhi Chawal", "Billu", "Chhole Bhature", "Pao Bhaji"]

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsersCount = await User.countDocuments()

    if (existingUsersCount === 0) {
      console.log("Seeding initial users...")

      const usersToCreate = initialUsers.map((name) => ({
        name,
        totalPoints: 0,
        rank: 0,
      }))

      await User.insertMany(usersToCreate)
      console.log("Initial 10 users seeded successfully!")
    } else {
      console.log("Users already exist in database, skipping seed.")
    }
  } catch (error) {
    console.error("Error seeding users:", error)
  }
}

module.exports = seedUsers

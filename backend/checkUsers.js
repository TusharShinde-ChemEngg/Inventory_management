const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to database. Fetching users...\n");

    const users = await User.find();

    if (users.length === 0) {
      console.log("No users found in the database.");
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user) => {
        console.log({
          id: user._id.toString(),
          name: user.name,
          pin: user.pin,
          role: user.role
        });
      });
    }
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
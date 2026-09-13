const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function createUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});

  await User.insertMany([
    { name: "Admin 1", pin: "1111", role: "admin" },
    { name: "Admin 2", pin: "2222", role: "admin" },
    { name: "Staff 1", pin: "3333", role: "staff" },
    { name: "Staff 2", pin: "4444", role: "staff" },
    { name: "Staff 3", pin: "5555", role: "staff" }
  ]);

  console.log("5 users created successfully");

  await mongoose.disconnect();
}

createUsers();
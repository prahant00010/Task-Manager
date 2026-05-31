/**
 * Seed a default admin user (dev only).
 * Run: node scripts/seedAdmin.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const ADMINS = [
  { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Admin", email: "admin@gmail.com", password: "admin123", role: "admin" }
];

async function seed() {
  await connectDB();
  for (const admin of ADMINS) {
    const existing = await User.findOne({ email: admin.email });
    const passwordHash = await bcrypt.hash(admin.password, 10);
    if (existing) {
      existing.passwordHash = passwordHash;
      existing.role = admin.role;
      await existing.save();
      console.log("Updated:", admin.email);
    } else {
      await User.create({ ...admin, passwordHash });
      console.log("Created:", admin.email);
    }
  }
  console.log("\nLogin with any seeded admin — password: admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

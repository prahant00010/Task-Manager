/**
 * Seed demo admin + employee accounts (dev only).
 * Run: node scripts/seedUsers.js  OR  npm run seed
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Project = require("../models/Project");

const DEMO_USERS = [
  { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Admin", email: "admin@gmail.com", password: "admin123", role: "admin" },
  { name: "John Employee", email: "employee@example.com", password: "employee123", role: "member" },
  { name: "Jane Employee", email: "employee@gmail.com", password: "employee123", role: "member" }
];

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = role;
    await existing.save();
    console.log(`Updated [${role}]: ${email}`);
  } else {
    await User.create({ name, email, passwordHash, role });
    console.log(`Created [${role}]: ${email}`);
  }
}

async function seedDemoProject() {
  const users = await User.find({
    email: { $in: DEMO_USERS.map((u) => u.email) }
  });
  const admin = users.find((u) => u.role === "admin");
  if (!admin || users.length === 0) return;

  let project = await Project.findOne({ name: "Demo Team Project" });
  const members = users.map((u) => ({
    user: u._id,
    role: u.role === "admin" ? "admin" : "member"
  }));

  if (project) {
    project.members = members;
    project.owner = admin._id;
    await project.save();
    console.log("Updated demo project with all demo users as members");
  } else {
    await Project.create({
      name: "Demo Team Project",
      description: "Sample project — all demo users can be assigned tasks here",
      owner: admin._id,
      members
    });
    console.log("Created demo project: Demo Team Project");
  }
}

async function seed() {
  await connectDB();
  for (const user of DEMO_USERS) {
    await upsertUser(user);
  }
  await seedDemoProject();
  console.log("\n--- Demo logins ---");
  console.log("Admin:    admin@example.com / admin123");
  console.log("Admin:    admin@gmail.com / admin123");
  console.log("Employee: employee@example.com / employee123");
  console.log("Employee: employee@gmail.com / employee123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [projectMemberSchema], default: [] }
  },
  { timestamps: true }
);

function memberUserId(member) {
  if (!member?.user) return null;
  return member.user._id?.toString() || member.user.toString();
}

projectSchema.methods.isMember = function isMember(userId) {
  const targetId = userId?.toString?.();
  if (!targetId) return false;
  return this.members.some((m) => memberUserId(m) === targetId);
};

projectSchema.methods.getMemberRole = function getMemberRole(userId) {
  const targetId = userId?.toString?.();
  const member = this.members.find((m) => memberUserId(m) === targetId);
  return member?.role || null;
};

module.exports = mongoose.model("Project", projectSchema);

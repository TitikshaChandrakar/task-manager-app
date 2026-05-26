const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 *
 * Fields:
 *   name       – display name
 *   email      – unique login identifier (lowercased)
 *   password   – bcrypt-hashed, excluded from query results by default
 *   avatar     – optional profile picture URL
 *   role       – "user" | "admin"  (for future role-based access)
 *   isActive   – soft-disable an account without deleting it
 *   lastLogin  – updated on every successful login
 *   createdAt / updatedAt – auto-managed by Mongoose timestamps
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries unless explicitly requested
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: 'Role must be "user" or "admin"',
      },
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// email already has a unique index from the schema definition above.
// Add a text index so admins can search users by name or email.
userSchema.index({ name: "text", email: "text" });

// ── Hooks ────────────────────────────────────────────────────────────────────

// Hash password before every save (only when it has been modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance methods ─────────────────────────────────────────────────────────

/**
 * matchPassword — compare a plain-text password against the stored hash.
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

/**
 * toSafeObject — return a plain object without sensitive fields.
 * Useful when you need to send user data in a response.
 */
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

/**
 * Category Schema
 *
 * Allows users to organise tasks into named groups (e.g. "Work", "Personal").
 *
 * Fields:
 *   name      – category label, unique per user
 *   color     – hex colour string for UI display (e.g. "#6366f1")
 *   icon      – optional emoji or icon identifier
 *   user      – owner reference (each category belongs to one user)
 *   createdAt / updatedAt – auto-managed by Mongoose timestamps
 */

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    color: {
      type: String,
      default: "#6366f1",
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code (e.g. #fff or #6366f1)"],
    },

    icon: {
      type: String,
      default: "",
      trim: true,
      maxlength: [10, "Icon identifier cannot exceed 10 characters"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Category must belong to a user"],
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────

// Enforce unique category names per user (two users can both have "Work")
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);

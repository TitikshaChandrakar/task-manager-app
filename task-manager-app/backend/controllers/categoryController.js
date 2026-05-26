const mongoose = require("mongoose");
const Category = require("../models/Category");
const Task = require("../models/Task");


const assertValidId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid category ID" });
    return false;
  }
  return true;
};

const formatValidationError = (err) =>
  Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getCategoryById = async (req, res) => {
  if (!assertValidId(req.params.id, res)) return;

  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    const taskCount = await Task.countDocuments({
      category: category._id,
      user: req.user._id,
    });

    res.json({ category, taskCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    const category = await Category.create({
      name,
      color,
      icon,
      user: req.user._id,
    });

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    // Duplicate name for this user
    if (err.code === 11000) {
      return res.status(409).json({ message: `Category "${req.body.name}" already exists` });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: formatValidationError(err) });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateCategory = async (req, res) => {
  if (!assertValidId(req.params.id, res)) return;

  try {
    const { name, color, icon } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated", category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: `Category "${req.body.name}" already exists` });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: formatValidationError(err) });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteCategory = async (req, res) => {
  if (!assertValidId(req.params.id, res)) return;

  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    // Remove the category reference from all tasks that used it
    await Task.updateMany(
      { category: category._id, user: req.user._id },
      { $set: { category: null } }
    );

    res.json({ message: "Category deleted", categoryId: category._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

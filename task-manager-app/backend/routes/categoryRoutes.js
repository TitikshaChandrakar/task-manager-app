const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/auth");

// All category routes require authentication
router.use(protect);

router.get("/", getCategories);           // GET    /api/categories
router.post("/", createCategory);         // POST   /api/categories
router.get("/:id", getCategoryById);      // GET    /api/categories/:id
router.put("/:id", updateCategory);       // PUT    /api/categories/:id
router.delete("/:id", deleteCategory);    // DELETE /api/categories/:id

module.exports = router;

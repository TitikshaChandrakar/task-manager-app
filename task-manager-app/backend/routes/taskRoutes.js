const express = require("express");
const router = express.Router();

const {
  getTasks,
  addTask,
  updateTask,
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);

// ADD task
router.post("/", addTask);

// UPDATE task status
router.put("/:id", updateTask);

module.exports = router;
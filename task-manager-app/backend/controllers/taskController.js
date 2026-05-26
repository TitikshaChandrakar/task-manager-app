const Task = require("../models/Task");


// ==========================
// GET ALL TASKS
// ==========================

const getTasks = async (req, res) => {

  try {

    const tasks = await Task.find();

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ==========================
// ADD TASK
// ==========================

const addTask = async (req, res) => {

  try {

    const task = await Task.create({
      title: req.body.title,
      completed: false,
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ==========================
// UPDATE TASK
// ==========================

const updateTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  getTasks,
  addTask,
  updateTask,
};
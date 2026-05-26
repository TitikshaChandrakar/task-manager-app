import { useState } from "react";
import API from "../services/api";

function AddTask({ fetchTasks }) {

  const [title, setTitle] = useState("");

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await API.post("/", {
      title,
    });

    setTitle("");

    fetchTasks();
  };

  return (
    <form className="task-form" onSubmit={addTask}>

      <input
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button type="submit">Add</button>

    </form>
  );
}

export default AddTask;

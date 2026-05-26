import API from "../services/api";

function TaskList({ tasks, fetchTasks }) {

  const toggleTask = async (task) => {

    await API.put(`/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  return (
    <div>

      {tasks.map((task) => (

        <div className="task-card" key={task._id}>

          <span
            style={{
              textDecoration: task.completed
                ? "line-through"
                : "none",
            }}
          >
            {task.title}
          </span>

          <button onClick={() => toggleTask(task)}>
            {task.completed ? "Undo" : "Complete"}
          </button>

        </div>
      ))}

    </div>
  );
}

export default TaskList;

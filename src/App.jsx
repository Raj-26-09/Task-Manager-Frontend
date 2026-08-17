import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // GET /tasks
  const loadTasks = async () => {
    try {
      setFetching(true);
      setError("");

      const result = await getTasks();

      setTasks(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // POST /tasks
  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTask({
        title: title.trim(),
        description,
        priority,
      });

      // Clear form
      setTitle("");
      setDescription("");
      setPriority("medium");

      // Re-fetch tasks from MongoDB
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT /tasks/:id
  const handleUpdate = async (task) => {
    try {
      setError("");

      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        priority: task.priority,
      });

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE /tasks/:id
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTask(id);

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h1>Task Manager</h1>
        <p>React + Node.js + MongoDB</p>
      </header>

      <main className="container">

        {/* CREATE TASK */}

        <section className="form-section">
          <h2>Create Task</h2>

          <form onSubmit={handleCreate}>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Task"}
            </button>

          </form>
        </section>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* TASK LIST */}

        <section className="tasks-section">

          <div className="tasks-header">
            <h2>Tasks</h2>

            <button onClick={loadTasks}>
              Refresh
            </button>
          </div>

          {fetching ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="task-list">

              {tasks.map((task) => (
                <article
                  className="task-card"
                  key={task._id}
                >

                  <h3>{task.title}</h3>

                  <p>
                    {task.description || "No description"}
                  </p>

                  <div className="task-info">
                    <span>
                      <strong>Priority:</strong>{" "}
                      {task.priority}
                    </span>

                    <span>
                      <strong>Status:</strong>{" "}
                      {task.completed
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="actions">

                    <button
                      onClick={() => handleUpdate(task)}
                    >
                      {task.completed
                        ? "Mark Pending"
                        : "Complete"}
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;
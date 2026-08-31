import { useEffect, useState, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMe,
} from "./api";
import Auth from "./Auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogout = useCallback((expiredMessage = "") => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    if (expiredMessage) {
      setError(expiredMessage);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    if (user) {
      setCurrentUser(user);
    }
    setError("");
  };

  // Fetch logged in user details (/auth/me)
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await getMe();
      if (res.data) {
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      if (err.message.includes("401") || err.message.toLowerCase().includes("token")) {
        handleLogout("Session expired. Please log in again.");
      }
    }
  }, [handleLogout]);

  // Load all tasks
  const loadTasks = useCallback(async () => {
    try {
      setFetching(true);
      setError("");

      const result = await getTasks();
      setTasks(result.data || []);
    } catch (err) {
      if (err.message.includes("401") || err.message.toLowerCase().includes("token")) {
        handleLogout("Session expired. Please log in again.");
      } else {
        setError(err.message || "Failed to load tasks");
      }
    } finally {
      setFetching(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
      loadTasks();
    }
  }, [isLoggedIn, fetchUserProfile, loadTasks]);

  // CREATE TASK
  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Task title must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setSuccessMsg("Task added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);

      await loadTasks();
    } catch (err) {
      if (err.message.includes("401")) {
        handleLogout("Session expired. Please log in again.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE STATUS
  const handleToggleComplete = async (task) => {
    try {
      setError("");
      await updateTask(task._id, {
        completed: !task.completed,
      });

      await loadTasks();
    } catch (err) {
      if (err.message.includes("401")) {
        handleLogout("Session expired. Please log in again.");
      } else {
        setError(err.message);
      }
    }
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      setError("");
      await deleteTask(id);
      setSuccessMsg("Task deleted successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
      await loadTasks();
    } catch (err) {
      if (err.message.includes("401")) {
        handleLogout("Session expired. Please log in again.");
      } else {
        setError(err.message);
      }
    }
  };

  // Filter & search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);

    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    const matchesSearch =
      (task.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h1 className="nav-title">TaskFlow</h1>
            <span className="nav-tag">JWT Protected</span>
          </div>
        </div>

        <div className="nav-user">
          {currentUser && (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.name || "User"}</span>
                <span className="user-email">{currentUser.email || ""}</span>
              </div>
            </div>
          )}

          <button onClick={() => handleLogout()} className="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Global Notifications */}
        {error && (
          <div className="alert alert-error animate-fade">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success animate-fade">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Stats Dashboard */}
        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
          <div className="stat-card stat-completed">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedCount}</span>
          </div>
        </section>

        <div className="content-grid">
          {/* Create Task Form */}
          <section className="card form-card">
            <div className="card-header">
              <h2>Create New Task</h2>
              <span className="card-subtitle">Server-side validated pipeline</span>
            </div>

            <form onSubmit={handleCreate} className="task-form">
              <div className="form-group">
                <label htmlFor="task-title">Title *</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Implement JWT verification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  placeholder="Optional details, requirements or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding Task..." : "+ Add Task"}
              </button>
            </form>
          </section>

          {/* Tasks List */}
          <section className="card list-card">
            <div className="card-header list-toolbar">
              <div>
                <h2>Your Tasks</h2>
                <span className="card-subtitle">
                  {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} shown
                </span>
              </div>

              <button onClick={loadTasks} className="btn btn-secondary btn-sm" title="Refresh task list">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Refresh
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="filters-bar">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-selects">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Only</option>
                  <option value="completed">Completed Only</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Tasks Container */}
            {fetching ? (
              <div className="empty-state">
                <div className="spinner"></div>
                <p>Loading your tasks securely...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                <h3>No tasks found</h3>
                <p>
                  {tasks.length === 0
                    ? "Get started by adding your first task on the left."
                    : "No tasks match your current filter and search."}
                </p>
              </div>
            ) : (
              <div className="task-items-list">
                {filteredTasks.map((task) => (
                  <article
                    key={task._id}
                    className={`task-item ${task.completed ? "is-completed" : ""}`}
                  >
                    <div className="task-main">
                      <button
                        type="button"
                        className={`checkbox-btn ${task.completed ? "checked" : ""}`}
                        onClick={() => handleToggleComplete(task)}
                        title={task.completed ? "Mark as pending" : "Mark as completed"}
                      >
                        {task.completed && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>

                      <div className="task-content">
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}
                        <div className="task-meta">
                          <span className={`badge badge-${task.priority || "medium"}`}>
                            {task.priority || "medium"}
                          </span>
                          <span className={`badge ${task.completed ? "badge-success" : "badge-neutral"}`}>
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

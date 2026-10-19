function TaskStats({ totalCount = 0, pendingCount = 0, completedCount = 0 }) {
  return (
    <section className="stats-row animate-fade">
      <div className="stat-card">
        <span className="stat-label">Total Tasks</span>
        <span className="stat-value">{totalCount}</span>
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
  );
}

export default TaskStats;

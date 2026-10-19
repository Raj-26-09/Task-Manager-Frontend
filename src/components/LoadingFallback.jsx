export function LoadingFallback({ message = "Loading component..." }) {
  return (
    <div className="empty-state animate-fade" style={{ minHeight: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div
        className="spinner"
        style={{
          width: "28px",
          height: "28px",
          borderWidth: "3px",
          borderTopColor: "var(--primary, #4f46e5)",
          borderColor: "rgba(79, 70, 229, 0.2)",
          marginBottom: "12px",
        }}
      />
      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-main, #0f172a)" }}>
        {message}
      </h3>
      <p style={{ fontSize: "13px", color: "var(--text-muted, #64748b)" }}>
        Optimizing bundle delivery via React.lazy &amp; Suspense
      </p>
    </div>
  );
}

export function StatsFallback() {
  return (
    <section className="stats-row animate-fade" style={{ opacity: 0.7 }}>
      <div className="stat-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "84px" }}>
        <span className="stat-label">Loading stats...</span>
      </div>
      <div className="stat-card stat-pending" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "84px" }}>
        <span className="stat-label">Loading pending...</span>
      </div>
      <div className="stat-card stat-completed" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "84px" }}>
        <span className="stat-label">Loading completed...</span>
      </div>
    </section>
  );
}

export default LoadingFallback;

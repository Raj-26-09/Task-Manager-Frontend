import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { getMe } from "./api";
import { LoadingFallback } from "./components/LoadingFallback";
import "./App.css";

// ============================================================================
// Route-Based Code Splitting via React.lazy & dynamic imports
// ============================================================================
const Auth = lazy(() => import("./pages/Auth"));
const TaskDashboard = lazy(() => import("./pages/TaskDashboard"));

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

  const [error, setError] = useState("");

  const handleLogout = useCallback((expiredMessage = "") => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
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

  // Fetch logged in user details (/auth/me) when session is active
  useEffect(() => {
    let isMounted = true;

    if (isLoggedIn) {
      getMe()
        .then((res) => {
          if (isMounted && res.data) {
            setCurrentUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          if (
            isMounted &&
            (err.message?.includes("401") ||
              err.message?.toLowerCase().includes("token"))
          ) {
            handleLogout("Session expired. Please log in again.");
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, handleLogout]);

  // Route 1: Unauthenticated Route / View (Auth - Login & Register)
  if (!isLoggedIn) {
    return (
      <Suspense fallback={<LoadingFallback message="Loading Authentication..." />}>
        <Auth onLogin={handleLogin} />
      </Suspense>
    );
  }

  // Route 2: Authenticated Route / View (Task Dashboard Workspace)
  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
                {currentUser.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.name || "User"}</span>
                <span className="user-email">{currentUser.email || ""}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => handleLogout()}
            className="btn btn-outline btn-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Container with Suspense boundary wrapping the lazy-loaded workspace */}
      <main className="main-content">
        {error && (
          <div className="alert alert-error animate-fade">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <Suspense fallback={<LoadingFallback message="Loading Workspace..." />}>
          <TaskDashboard onLogout={handleLogout} />
        </Suspense>
      </main>
    </div>
  );
}

export default App;

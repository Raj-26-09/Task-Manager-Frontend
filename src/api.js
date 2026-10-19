const BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// Helper for parsing JSON responses and throwing clean error messages
const handleResponse = async (response) => {
  // Capture latency metric from server header if emitted
  const latency = response.headers?.get("x-response-time");
  if (latency && typeof window !== "undefined" && window.__API_LATENCY_LOG__) {
    console.debug(`[Telemetry] ${response.url} - Server time: ${latency}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(data.message || "401 Unauthorized: Session expired or invalid token");
    }

    if (data.errors && typeof data.errors === "object") {
      const errorMsg = Object.values(data.errors).join(", ");
      throw new Error(errorMsg || data.message || "Validation failed");
    }

    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// ===============================
// AUTH API
// ===============================

// POST /auth/register
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// POST /auth/login
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

// GET /auth/me (Get logged in user profile)
export const getMe = async () => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

// ===============================
// TASKS API (PROTECTED ROUTES)
// ===============================

// GET /tasks
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

// POST /tasks
export const createTask = async (task) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(task),
  });

  return handleResponse(response);
};

// PUT /tasks/:id
export const updateTask = async (id, task) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(task),
  });

  return handleResponse(response);
};

// DELETE /tasks/:id
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};
# Task Manager Frontend

A modern, responsive React + Vite full-stack task management application with JWT authentication, real-time feedback, and input validation pipeline.

## Features

- **JWT Authentication**: User registration, login, and secure token management (`Authorization: Bearer <token>`).
- **User Profile**: Profile greeting and details fetched via protected `/auth/me` endpoint.
- **Task Management**:
  - Create tasks with server-side validation.
  - Toggle completion status.
  - Filter by status (All, Pending, Completed) and Priority (Low, Medium, High).
  - Search by task title and description.
  - Delete tasks with confirmation.
- **Session Expiry Handling**: Automatic 401 response detection, session clearing, and redirect to login.
- **Modern UI**: Clean design system, responsive grid layout, status tags, and dashboard stats.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API running on `http://localhost:5000`

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

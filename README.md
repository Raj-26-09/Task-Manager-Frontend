# Task Manager Frontend

A modern, responsive React + Vite full-stack task management application with JWT authentication, real-time feedback, input validation pipeline, and route/component-level lazy loading.

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
- **Performance Optimization (Practical 8)**:
  - **Route-Based Lazy Loading**: Dynamic imports for `Auth` and `TaskDashboard` views via `React.lazy()` and `<Suspense>`.
  - **Component-Level Code Splitting**: Asynchronous chunk delivery for heavy `TaskStats` metrics visualization.
  - **Custom Suspense Fallbacks**: Branded, zero-layout-shift loading spinners matching the design system.
  - **Bundle Reduction**: Main JavaScript entry bundle reduced from `205.96 kB` to `197.19 kB`, splitting on-demand logic into 4 modular chunks.

## AWDF Practical 8 Documentation

Detailed reports, verification guides, and build logs are available in `docs/practical8/`:
- [Performance Report](docs/practical8/performance-report.md) — 16-section engineering report on code splitting and bundle metrics.
- [Evidence & Verification Guide](docs/practical8/README.md) — Step-by-step instructions for Chrome DevTools Network and Profiler testing.
- [Baseline Build Output](docs/practical8/before-build.txt) — Monolithic bundle measurements before optimization.
- [Optimized Build Output](docs/practical8/after-build.txt) — Multi-chunk breakdown after code splitting.
- [Screenshots](docs/practical8/screenshots/) — Captured browser and verification evidence.

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

### Preview Production Build

```bash
npm run preview
```

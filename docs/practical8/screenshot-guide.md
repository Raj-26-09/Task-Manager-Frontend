# Practical 8: Performance Optimization & Lazy Loading in React
## Comprehensive Screenshot Capture & Verification Guide

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester: 5th  
**Student ID:** 24AIML029  
**Target Report:** `e:\AWDF\24AIML029_AWDF_8.docx`  
**Application Root:** `e:\AWDF\frontend`  
**Reference Artifacts:** `frontend/docs/practical8/`  

---

## 1. Executive Summary & Verification Context

### Architectural Architecture Note
Unlike traditional multi-page applications that use `react-router-dom`, **TaskFlow's frontend (`frontend/src/App.jsx`) uses authentication-state-based dynamic routing**.

- **Session Checking:** `App.jsx` checks `localStorage.getItem("token")`.
- **Route 1 (Unauthenticated):** When `isLoggedIn === false`, React renders `pages/Auth.jsx` loaded on demand via:
  ```jsx
  const Auth = lazy(() => import("./pages/Auth"));
  // Wrapped in Suspense:
  <Suspense fallback={<LoadingFallback message="Loading Authentication..." />}>
    <Auth onLogin={handleLogin} />
  </Suspense>
  ```
- **Route 2 (Authenticated Workspace):** When `isLoggedIn === true`, React renders `pages/TaskDashboard.jsx` loaded on demand via:
  ```jsx
  const TaskDashboard = lazy(() => import("./pages/TaskDashboard"));
  // Wrapped in Suspense:
  <Suspense fallback={<LoadingFallback message="Loading Workspace..." />}>
    <TaskDashboard onLogout={handleLogout} />
  </Suspense>
  ```
- **Component-Level Code Splitting:** Inside `pages/TaskDashboard.jsx`, the analytics row `components/TaskStats.jsx` is independently lazy-loaded:
  ```jsx
  const TaskStats = lazy(() => import("../components/TaskStats"));
  // Wrapped in Suspense:
  <Suspense fallback={<StatsFallback />}>
    <TaskStats totalCount={tasks.length} pendingCount={...} completedCount={...} />
  </Suspense>
  ```

---

## 2. Quantitative Build Comparison (Baseline vs. Current)

### Baseline Monolithic Build (`frontend/docs/practical8/before-build.txt`)
Before Practical 8, all views were statically bundled into one monolithic JavaScript file:
```
dist/index.html                   0.47 kB │ gzip:  0.29 kB
dist/assets/index-BxWilSus.css    9.29 kB │ gzip:  2.65 kB
dist/assets/index-BUwHr35S.js   205.96 kB │ gzip: 63.75 kB
Total JavaScript Downloaded Upfront: 205.96 kB
```

### Initial Optimized Build (`frontend/docs/practical8/after-build.txt`)
After implementing `React.lazy()` and `<Suspense>`:
```
dist/index.html                          0.47 kB │ gzip:  0.30 kB
dist/assets/index-BxWilSus.css           9.29 kB │ gzip:  2.65 kB
dist/assets/TaskStats-DN_loB5C.js        0.75 kB │ gzip:  0.27 kB
dist/assets/Auth-BVHbCGD7.js             3.74 kB │ gzip:  1.37 kB
dist/assets/TaskDashboard-DyOuPxSY.js    8.94 kB │ gzip:  2.65 kB
dist/assets/index-C2uX9p9I.js          197.19 kB │ gzip: 62.19 kB
```

### Current Production Build (Post-Telemetry Commit `f5d7a4c`)
```
dist/index.html                          0.47 kB │ gzip:  0.30 kB
dist/assets/index-D7_OK7WX.css           9.40 kB │ gzip:  2.68 kB
dist/assets/TaskStats-D8BiVexK.js        0.75 kB │ gzip:  0.27 kB
dist/assets/Auth-CpT3BCE_.js             3.74 kB │ gzip:  1.37 kB
dist/assets/TaskDashboard-CEehvzN9.js    8.94 kB │ gzip:  2.65 kB
dist/assets/index-KOOYp8D8.js          197.34 kB │ gzip: 62.28 kB
```
*Note: Due to commit `f5d7a4c` (adding `.stat-card:hover` CSS and telemetry latency header reading in `api.js`), the generated chunk hashes updated to `KOOYp8D8`, `CEehvzN9`, `CpT3BCE_`, and `D8BiVexK`. The chunk count (4 distinct JavaScript bundles) and the size benefits (-8.62 kB reduction from the 205.96 kB baseline) remain identical.*

---

## 3. Step-by-Step Screenshot Capture Checklist

Capture the following **7 essential screenshots** to complete your submission for `24AIML029_AWDF_8.docx`.

---

### Screenshot 1: Original Production Build Output (Baseline Monolithic Bundle)

* **Objective:** Prove the baseline application state where all application logic was packaged into a single monolithic bundle without code splitting.
* **Tool / Application:** Terminal / Code Editor displaying [`before-build.txt`](file:///e:/AWDF/frontend/docs/practical8/before-build.txt).
* **Exact Steps to Reproduce:**
  1. Open VS Code or PowerShell.
  2. Open the file `e:\AWDF\frontend\docs\practical8\before-build.txt`.
  3. Alternatively, view it in PowerShell:
     ```powershell
     Get-Content e:\AWDF\frontend\docs\practical8\before-build.txt
     ```
  4. Ensure the output is clearly visible in the window.
* **What Must Be Visible:**
  - `dist/assets/index-BUwHr35S.js 205.96 kB`
  - Single JavaScript bundle listed under `dist/assets/`.
  - No separate chunk files for Auth or TaskDashboard.
* **Suggested Filename:** `01_baseline_production_build.png`
* **Report Caption:** *Figure 8.1: Baseline Production Build Output Showing Monolithic Bundle (205.96 kB)*
* **Requirement:** Mandatory

---

### Screenshot 2: Optimized Production Build Output (Multi-Chunk Code Splitting)

* **Objective:** Prove that the Rollup bundler inside Vite successfully generated four distinct, on-demand JavaScript chunks.
* **Tool / Application:** PowerShell Terminal in `e:\AWDF\frontend`.
* **Exact Steps to Reproduce:**
  1. Open PowerShell and navigate to the frontend folder:
     ```powershell
     cd e:\AWDF\frontend
     ```
  2. Run the production build command:
     ```powershell
     npm run build
     ```
  3. Wait for Vite to complete transforming and computing gzip sizes.
* **What Must Be Visible:**
  - `dist/index.html` (~0.47 kB)
  - `dist/assets/index-*.css` (~9.40 kB)
  - `dist/assets/TaskStats-*.js` (0.75 kB)
  - `dist/assets/Auth-*.js` (3.74 kB)
  - `dist/assets/TaskDashboard-*.js` (8.94 kB)
  - `dist/assets/index-*.js` (~197.34 kB)
  - Build confirmation: `✓ built in ...ms`
* **Suggested Filename:** `02_optimized_production_build.png`
* **Report Caption:** *Figure 8.2: Optimized Multi-Chunk Build Output Demonstrating Automated Code Splitting*
* **Requirement:** Mandatory

---

### Screenshot 3: Initial JavaScript Requests (Unauthenticated Entry Point)

* **Objective:** Demonstrate that a first-time visitor only downloads the entry shell and the login chunk, keeping the initial payload minimal.
* **Tool / Application:** Google Chrome with DevTools (Network tab).
* **Exact Steps to Reproduce:**
  1. In terminal 1, start the production preview server:
     ```powershell
     cd e:\AWDF\frontend
     npm run preview
     ```
     *(Server runs on `http://localhost:4173`)*
  2. In terminal 2, start the backend API:
     ```powershell
     cd e:\AWDF\backend
     npm start
     ```
  3. Open Google Chrome and visit `http://localhost:4173`.
  4. Press `F12` to open DevTools.
  5. Go to the **Application** tab -> **Storage** -> Click **Clear site data** (ensures unauthenticated state).
  6. Go to the **Network** tab:
     - Check **Disable cache**.
     - Select the **JS** filter tab.
     - Select **All** under waterfall view.
  7. Press `Ctrl + Shift + R` to hard reload the page.
* **What Must Be Visible:**
  - Browser address bar showing `http://localhost:4173/`.
  - TaskFlow login interface visible on the page.
  - Network request table showing:
    - `index-*.js`
    - `Auth-*.js`
  - **Absence of:** `TaskDashboard-*.js` and `TaskStats-*.js` (neither should appear in the network table).
* **Suggested Filename:** `03_initial_js_requests_auth.png`
* **Report Caption:** *Figure 8.3: Chrome DevTools Network Tab Showing Initial Unauthenticated Bundle Delivery*
* **Requirement:** Mandatory

---

### Screenshot 4: Authentication Chunk Loading Details

* **Objective:** Inspect the specific `Auth-*.js` chunk to prove it was initiated as an asynchronous ECMAScript dynamic import.
* **Tool / Application:** Google Chrome DevTools (Network tab -> Headers sub-tab).
* **Exact Steps to Reproduce:**
  1. In the Network tab from Screenshot 3, click on the row corresponding to `Auth-*.js` (e.g., `Auth-CpT3BCE_.js` or `Auth-BVHbCGD7.js`).
  2. Open the **Headers** sub-tab on the right side.
  3. Look at:
     - **Request URL:** `http://localhost:4173/assets/Auth-*.js`
     - **Status Code:** `200 OK`
     - **Response Headers:** `Content-Type: text/javascript`
* **What Must Be Visible:**
  - The URL, 200 OK status, and request details for the separate `Auth` chunk.
* **Suggested Filename:** `04_auth_chunk_inspection.png`
* **Report Caption:** *Figure 8.4: Detailed Network Inspection of the Asynchronously Loaded Auth Chunk*
* **Requirement:** Mandatory

---

### Screenshot 5: Dashboard and Statistics Chunk Loading on Login

* **Objective:** Prove that when the user signs in, the browser dynamically fetches the dashboard and stats chunks on demand without a full page reload.
* **Tool / Application:** Google Chrome DevTools (Network tab).
* **Exact Steps to Reproduce:**
  1. Keep Chrome DevTools open on the **Network** tab (with **JS** filter selected).
  2. Do **NOT** refresh the page.
  3. Fill in the login credentials:
     - **Email:** `raj@example.com` (or registered email)
     - **Password:** `password123`
  4. Click **Sign In**.
  5. Watch the Network table live as the transition occurs:
     - `TaskDashboard-*.js` arrives.
     - `TaskStats-*.js` arrives.
* **What Must Be Visible:**
  - TaskFlow authenticated workspace rendered in the viewport (with tasks, filter buttons, stats row).
  - The Network table showing the new entries for `TaskDashboard-*.js` and `TaskStats-*.js` added after the initial load.
* **Suggested Filename:** `05_dashboard_stats_chunk_loading.png`
* **Report Caption:** *Figure 8.5: On-Demand Dynamic Loading of TaskDashboard and TaskStats Chunks Upon Authentication*
* **Requirement:** Mandatory

---

### Screenshot 6: Suspense Fallback under Network Throttling

* **Objective:** Demonstrate that the branded `<Suspense>` fallback UI renders gracefully during network latency, preventing layout shift or a blank screen.
* **Tool / Application:** Google Chrome Viewport + DevTools (Network tab).
* **Exact Steps to Reproduce:**
  1. In the Chrome DevTools Network tab, find the throttling dropdown (currently says **No throttling**).
  2. Change the dropdown to **Slow 3G**.
  3. Click the **Logout** button in the top navigation bar.
  4. Because the browser must download the `Auth-*.js` chunk over a simulated high-latency connection, React activates the Suspense fallback.
  5. Capture the screen immediately using Windows Snipping Tool (`Win + Shift + S`) or `Print Screen`.
* **What Must Be Visible:**
  - Branded fallback container in the center of the viewport.
  - Animated purple spinner.
  - Text: *"Loading Authentication..."*
  - Subtitle: *"Optimizing bundle delivery via React.lazy & Suspense"*.
* **Suggested Filename:** `06_suspense_loading_fallback.png`
* **Report Caption:** *Figure 8.6: Custom Branded Suspense Fallback Displayed During Slow 3G Network Throttling*
* **Requirement:** Mandatory

---

### Screenshot 7: React DevTools Profiler Analysis

* **Objective:** Profile component re-rendering behavior during user interaction, analyze commit durations, and evaluate memoization trade-offs.
* **Tool / Application:** Google Chrome DevTools -> **Profiler** tab (React Developer Tools).
* **Exact Steps to Reproduce:**
  1. Reset network throttling back to **No throttling**.
  2. Log back into TaskFlow.
  3. In DevTools, click the **Profiler** tab (blue React logo icon).
  4. Ensure you have 2–3 tasks visible in the list.
  5. Click the blue **Record** circular button in the top-left of the Profiler panel.
  6. In TaskFlow:
     - Click the search input box (*"Search tasks by title or description..."*).
     - Type a search query (e.g., `"Practical"`).
     - Change the status dropdown from *"All Status"* to *"Pending Only"*.
  7. Click the red **Stop** button in the Profiler panel.
  8. Select the **Flamegraph** view:
     - Click on the commit with the highest render duration.
     - Observe the component hierarchy: `<App>`, `<TaskDashboard>`, `<TaskStats>`.
* **What Must Be Visible:**
  - Profiler Flamegraph with colored render bars.
  - Commit duration (e.g. `1.2 ms`) and render summary.
  - `TaskDashboard` highlighted as rendering due to state change.
* **Suggested Filename:** `07_react_profiler_flamegraph.png`
* **Report Caption:** *Figure 8.7: React DevTools Profiler Flamegraph Demonstrating Component Render Cycles and Commit Latency*
* **Requirement:** Mandatory

---

## 4. How to Insert Screenshots into `24AIML029_AWDF_8.docx`

1. Open `e:\AWDF\24AIML029_AWDF_8.docx` in Microsoft Word or LibreOffice.
2. Locate the section labeled **Screenshots:** below the Practical-8 Statement.
3. Insert the 7 captured PNG files in order:
   - Screenshot 1 (Baseline Build Log)
   - Screenshot 2 (Optimized Multi-Chunk Build)
   - Screenshot 3 (Initial JS Requests)
   - Screenshot 4 (Auth Chunk Loading Details)
   - Screenshot 5 (Dashboard & Stats Chunks on Login)
   - Screenshot 6 (Suspense Fallback under Slow 3G)
   - Screenshot 7 (React Profiler Flamegraph)
4. Add the exact figure captions listed in Section 3 beneath each image.
5. Save the updated `.docx` file. The document size will increase from 55 KB to ~1.5–2.5 MB, matching the format and quality of Practicals 1–7 and 9–11.

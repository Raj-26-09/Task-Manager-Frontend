# Practical 8: Evidence and Verification Guide

**Course:** AWDF Practical 8  
**Student ID:** 24AIML029  
**Artifact Directory:** `frontend/docs/practical8/`  

This document provides step-by-step instructions for running the application, verifying the build output, and capturing all required evidence and screenshots for the practical examination submission.

---

## 1. Summary of Documentation & Guides

The build logs, engineering reports, and guides are organized in this folder:
- **Completed University Submission Report:** [`Practical_8_Report.docx`](file:///e:/AWDF/frontend/docs/practical8/Practical_8_Report.docx) (or [`24AIML029_AWDF_8_vertical.docx`](file:///e:/AWDF/frontend/docs/practical8/24AIML029_AWDF_8_vertical.docx)) — Complete Word submission with all 11 vertical screenshots.
- **Engineering Performance Report:** [`performance-report.md`](file:///e:/AWDF/frontend/docs/practical8/performance-report.md) — 16-section technical breakdown.
- **Syllabus & Viva Compliance Guide:** [`syllabus-compliance.md`](file:///e:/AWDF/frontend/docs/practical8/syllabus-compliance.md) — Viva questions, supplementary problems, and rubric alignment.
- **Screenshot Capture Guide:** [`screenshot-guide.md`](file:///e:/AWDF/frontend/docs/practical8/screenshot-guide.md) — Step-by-step reproduction guide.
- **Baseline Build Log:** [`before-build.txt`](file:///e:/AWDF/frontend/docs/practical8/before-build.txt)
- **Optimized Build Log:** [`after-build.txt`](file:///e:/AWDF/frontend/docs/practical8/after-build.txt)

---

## 2. Screenshot Capture Checklist & Evidence Index

All required screenshots have been captured, labeled, and saved in [`screenshots/`](file:///e:/AWDF/frontend/docs/practical8/screenshots/):

| # | Screenshot Description | Tool / Screen | Saved Screenshot File |
|---|---|---|---|
| **1** | Baseline monolithic build output (205.96 kB) | Terminal (`npm run build`) | [`screenshots/01_baseline_production_build.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/01_baseline_production_build.png) |
| **2** | Optimized 4-chunk production build output | Terminal (`npm run build`) | [`screenshots/02_optimized_production_build.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/02_optimized_production_build.png) |
| **3** | Initial page JS requests (entry & Auth chunk only) | Chrome DevTools (Network tab) | [`screenshots/03_initial_js_requests_auth.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/03_initial_js_requests_auth.png) |
| **4** | Dynamic Auth chunk inspection & headers | Chrome DevTools (Network tab) | [`screenshots/04_auth_chunk_inspection.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/04_auth_chunk_inspection.png) |
| **5** | Route Chunks (TaskDashboard + TaskStats) on login | Chrome DevTools (Network tab) | [`screenshots/05_dashboard_stats_chunk_loading.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/05_dashboard_stats_chunk_loading.png) |
| **6** | Branded Suspense fallback under Slow 3G throttling | Browser Viewport (Slow 3G) | [`screenshots/06_suspense_loading_fallback.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/06_suspense_loading_fallback.png) |
| **7** | React DevTools Profiler component Flamegraph | React DevTools (Profiler tab) | [`screenshots/07_react_profiler_flamegraph.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/07_react_profiler_flamegraph.png) |
| **8** | Auth Login UI state | Browser Viewport | [`screenshots/01_auth_page_lazy.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/01_auth_page_lazy.png) |
| **9** | Task Dashboard UI state | Browser Viewport | [`screenshots/02_task_dashboard_lazy.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/02_task_dashboard_lazy.png) |
| **10** | Task with Stats UI state | Browser Viewport | [`screenshots/03_task_added_with_stats.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/03_task_added_with_stats.png) |
| **11** | Logged-out transition UI state | Browser Viewport | [`screenshots/04_logged_out_transition.png`](file:///e:/AWDF/frontend/docs/practical8/screenshots/04_logged_out_transition.png) |

---

## 3. Step-by-Step Instructions for Capturing Evidence

### Step 1: Capture Terminal Build Outputs (Screenshots 1 & 2)

1. Open PowerShell or terminal in `e:\AWDF\frontend`.
2. To capture the optimized build:
   ```powershell
   npm run build
   ```
3. Take a screenshot of the terminal window showing the generated chunks:
   - `dist/assets/index-C2uX9p9I.js` (197.19 kB)
   - `dist/assets/TaskDashboard-DyOuPxSY.js` (8.94 kB)
   - `dist/assets/Auth-BVHbCGD7.js` (3.74 kB)
   - `dist/assets/TaskStats-DN_loB5C.js` (0.75 kB)
4. Save as `screenshot-2-after-build.png`.
5. *(The baseline build text is preserved in `docs/practical8/before-build.txt` for reference or can be viewed in terminal history).*

---

### Step 2: Start the Application

In your terminal:
```powershell
cd e:\AWDF\frontend
npm run preview
# The preview server starts at http://localhost:4173
```
*(Alternatively, you can run `npm run dev` at `http://localhost:5173`)*.

Ensure your backend server is running in another terminal window if testing live API authentication:
```powershell
cd e:\AWDF\backend
npm start
```

---

### Step 3: Initial Page JS Requests in Chrome DevTools (Screenshot 3 & 4)

1. Open **Google Chrome** and navigate to `http://localhost:4173`.
2. Press `F12` to open **Chrome DevTools**.
3. Go to the **Network** tab.
4. Filter by **JS** (click the "JS" filter chip).
5. Check **Disable cache**.
6. Clear `localStorage` (in DevTools: **Application** -> **Storage** -> **Clear site data**) so you are in the unauthenticated state.
7. Hard refresh the page (`Ctrl + Shift + R`).
8. Notice the network table:
   - `index-*.js` loads.
   - `Auth-*.js` loads on demand.
   - `TaskDashboard-*.js` and `TaskStats-*.js` are **NOT** present.
9. Capture a screenshot of the DevTools Network panel showing only `index` and `Auth` chunks. Save as `screenshot-3-initial-js-requests.png` and `screenshot-4-auth-chunk.png`.

---

### Step 4: Lazy Chunk Loading on Route Transition (Screenshot 5)

1. Keep the DevTools **Network** tab open.
2. In the TaskFlow login form, enter credentials and click **Sign In** (or register a new user).
3. Watch the Network panel in real time as authentication succeeds:
   - React mounts `<TaskDashboard />`.
   - The browser dynamically triggers asynchronous HTTP requests for:
     * `TaskDashboard-*.js`
     * `TaskStats-*.js`
4. Capture a screenshot showing the dynamic arrival of `TaskDashboard-*.js` and `TaskStats-*.js` in the request waterfall. Save as `screenshot-5-dashboard-chunk.png`.

---

### Step 5: Suspense Fallback under Slow 3G (Screenshot 6)

1. In DevTools **Network** tab, change the throttling dropdown from **No throttling** to **Slow 3G**.
2. Click the **Logout** button.
3. Observe the loading fallback:
   - A styled container with a purple spinning ring and text:
     *"Loading Authentication... Optimizing bundle delivery via React.lazy & Suspense"*
4. Press `Print Screen` or use Windows Snipping Tool (`Win + Shift + S`) to capture the fallback state while it is displayed.
5. Save as `screenshot-6-suspense-fallback.png`.

---

## 4. React DevTools Profiler Analysis (Screenshot 7 & Practical Section 9)

### How to Install and Open React DevTools
1. If not already installed, install the **React Developer Tools** extension from the Chrome Web Store.
2. Open Chrome DevTools (`F12`) and select the **Profiler** tab (blue React logo icon).

### Recording a Profiling Session
1. Click the **Record** button (small blue circle) in the top-left of the Profiler tab.
2. Perform an interaction in TaskFlow:
   - Type a query into the *"Search tasks..."* input bar.
   - Toggle a task status (complete/pending).
   - Change the filter dropdowns (e.g. from "All Status" to "Pending Only").
3. Click the **Stop** button (red circle) to stop profiling.

### Analyzing Component Re-renders & Findings

#### Flamegraph View
- The Profiler renders a Flamegraph where each bar represents a React component.
- **Color Coding:**
  - **Gray:** The component did not render in this commit.
  - **Green / Yellow / Orange:** The component rendered. The warmer the color, the longer the render duration.

#### Investigating an Existing Component: `TaskStats` vs. `TaskDashboard`
1. When typing in the **Search Box** in `TaskDashboard`:
   - State `searchQuery` updates on every keystroke (`onChange`).
   - `TaskDashboard` re-renders to filter the tasks list.
   - **Observation:** Notice that `TaskStats` (which displays Total, Pending, and Completed counts) does not depend on `searchQuery`!
   - Its props (`totalCount={tasks.length}`, `pendingCount`, `completedCount`) remain identical when the user merely types in search!
2. **Identification of Unnecessary Re-render:**
   - Under standard React behavior, when a parent component (`TaskDashboard`) re-renders due to local search input state change, all child components re-render by default, even if their props haven't changed.
   - The React Profiler clearly shows `TaskStats` rendering because: *"The parent component rendered"*.
3. **Evaluation of Optimization (React.memo):**
   - In accordance with practical instructions (*"Do not add React.memo(), useMemo(), or useCallback() without a clear reason"*):
   - `TaskStats` is an extremely lightweight component (3 static DOM cards, render time < 0.1 ms).
   - Wrapping it in `React.memo(TaskStats)` would require React to shallowly compare 3 primitive numbers (`totalCount`, `pendingCount`, `completedCount`) on every render.
   - While `React.memo` can eliminate the re-render when typing in search, the overhead of shallow comparison in V8 engine is comparable to rendering the 3 `<div>` elements. Therefore, preserving clean idiomatic code without premature memoization is the correct architectural decision.
4. Take a screenshot of the Profiler Flamegraph showing the commit duration and component tree. Save as `screenshot-7-profiler-results.png`.

---

## 5. Summary of Practical Completion

- **Vite & React 19:** Fully verified and operational.
- **Build Status:** Succeeded with code 0 (`vite v8.2.1`).
- **ESLint Status:** Passed with code 0 (zero errors, zero warnings).
- **Functionality Preserved:** Full JWT authentication, task CRUD, filtering, searching, and session expiration are 100% intact.

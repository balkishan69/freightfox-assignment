# FreightFox Frontend Engineering Assignments

This repository contains two complete frontend engineering assignments submitted for the FreightFox hiring process. Both assignments demonstrate clean architectural principles, strong React fundamentals, robust state management, and an emphasis on polished, highly responsive UI/UX.

---

## 1. Invoice Management System

Live Link: https://invoice-management-system-opal.vercel.app

A comprehensive React application for managing, filtering, and organizing invoice data.

**Key Features:**
- **Advanced Data Table:** Sortable columns, paginated data, and a flexible grid layout.
- **Filtering & Search:** Real-time search across invoice fields and status-based filtering (Pending, Paid, Overdue).
- **Interactive UI:** Smooth transitions, accessible modal dialogues, and responsive design tailored for both desktop and mobile viewports.
- **Clean Architecture:** Domain-driven service separation to manage mock asynchronous data cleanly.

**Tech Stack:** React, TypeScript, Vite, Vanilla CSS Modules

**Setup Instructions:**
```bash
cd Invoice-Management-System
npm install
npm run dev
```

---

## 2. Logistics Truck Route Visualizer

Live Link: https://truck-route-visualizer-lac.vercel.app

An interactive geographic visualization tracking a truck moving across a predefined delivery route (Origin -> D1 -> D2 -> D3).

**Key Features:**
- **SVG Route Geometry:** The truck is animated along a mathematically precise SVG path using `getTotalLength()` and `getPointAtLength()`, calculating both coordinates and rotation dynamically.
- **Robust Simulation Engine:** Driven by a pure reducer and a custom `requestAnimationFrame` hook to guarantee smooth, jitter-free animation independent of React's render cycle.
- **Live Status Tracking:** Real-time calculation of distance covered, ETA (Estimated Time of Arrival), and current route segment tracking.
- **Controls & Theming:** Features Pause/Resume capabilities, 1x/2x/4x speed toggles, and a fully native CSS-variable based Dark Mode.

**Tech Stack:** React, TypeScript, Vite, Vanilla CSS Modules, Lucide React

**Setup Instructions:**
```bash
cd Truck-Route-Visualizer
npm install
npm run dev
```

---

## Repository Structure

```text
freightfox-assignment/
├── Invoice-Management-System/   # Assignment 1 Codebase
├── Truck-Route-Visualizer/      # Assignment 2 Codebase
└── README.md                    # This overview file
```

Both projects were bootstrapped with Vite and adhere strictly to the constraints and requirements outlined in the FreightFox assignment briefs.

# Logistics Truck Route Visualizer

Live Link: https://truck-route-visualizer-lac.vercel.app

A frontend application simulating a truck moving through a series of delivery locations on a geographic route. This assignment demonstrates strong React architecture, scalable state management, and native SVG path manipulation.

## Assignment Features Implemented

- **Interactive Logistics Visualization**: A live SVG map featuring a curved route connecting Origin, D1, D2, and D3.
- **Real Truck Simulation**: The truck smoothly travels along the exact path curve, accurately calculating its rotational angle and positional coordinates derived mathematically from SVG path APIs.
- **Clean Status Tracking**: A live status panel computing the current location context ("En route to D1", "At Delivery Point D1", etc.), distance covered, and remaining ETA.
- **Pause/Resume/Reset**: Seamless pausing and resuming without jitter. Uses native `requestAnimationFrame` for timing rather than arbitrary intervals.
- **Simulation Speeds**: Toggles for 1x, 2x, and 4x simulation speeds.
- **Responsive Layout**: Designed to stack naturally on mobile viewports while preserving SVG visual fidelity.
- **Dark Mode**: Complete CSS-variable driven theming with system-preference detection and local persistence.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Modules and Design Tokens
- **Testing**: Vitest
- **Icons**: Lucide React

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles TypeScript and bundles the application for deployment.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint for code quality checks.
- `npx vitest run`: Executes the unit test suite.

## Architecture Overview

The application utilizes a domain-driven architectural pattern to separate React rendering from raw simulation logic. 

```text
src/
├── app/               # Main application layout and assembly
├── domain/            # Pure business logic independent of React
│   ├── path/          # SVG geometry, rotation math, and route config
│   └── simulation/    # State reducer, explicit commands, ETA calculations
├── features/          # Feature-specific React components and hooks
├── hooks/             # Generic hooks (e.g., useTheme)
├── services/          # Lightweight simulated async data fetching
└── styles/            # CSS variables and reset
```

## Key Engineering Decisions

1. **Reducer-Driven Simulation**: The simulation state (`RUNNING`, `PAUSED`, `IDLE`, etc.) is governed by a pure reducer. UI components simply dispatch explicit commands (`START`, `PAUSE`, `SET_SPEED`). This prevents invalid state transitions.
2. **Path Geometry Abstraction**: Rather than hardcoding XY coordinates or using arbitrary CSS animations, the truck's position is derived in real-time from the SVG `getTotalLength()` and `getPointAtLength()` APIs.
3. **requestAnimationFrame Loop**: The simulation is driven by `requestAnimationFrame` inside a custom hook, ensuring smooth 60fps rendering without the micro-stutters associated with `setInterval`.

## Assumptions & Trade-offs

- **Fake Real-Time ETA**: Since the visualizer is a scaled simulation (where the entire 7.8km route completes in ~10 seconds at 1x speed), ETA is proportionally mapped to represent realistic minutes rather than the literal milliseconds remaining in the simulation.
- **No Mapping SDK**: A real-world tracking application would likely use Leaflet or Mapbox. To minimize dependencies and focus on raw frontend engineering, this simulation uses native SVG manipulation.
- **Synchronous Rendering Check**: The SVG must render its path before we can calculate `getTotalLength()`. We assume the path is immediately available in the DOM on initial render and handle it using `useLayoutEffect`/`useEffect` patterns.

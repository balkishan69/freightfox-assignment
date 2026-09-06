# Invoice Management System

# Live Link: https://invoice-management-system-opal.vercel.app

A complete, polished frontend application for an Invoice Management System, built as a technical assignment for FreightFox.

This repository focuses on strong frontend engineering fundamentals, maintainability, and user experience, avoiding excessive abstraction while demonstrating realistic state management and architectural patterns.

## Key Features & Assignment Requirements Implemented

- **Dashboard**: Displays top-level metrics (Total Invoices, Paid/Pending/Overdue Amounts) and a recent invoice list. Metrics are calculated directly from the service data.
- **Invoice List**: The main data table.
  - **URL State Synchronization**: Search, Status filters, sorting, and pagination are strictly bound to the URL. This enables deep-linking, shareable URLs, and back-button safe navigation.
  - **Performance**: Debounced search and paginated API simulation rather than rendering thousands of rows in the DOM.
  - **Bulk Actions**: Checkbox selection logic handles indeterminate states, clears upon filter changes, and supports bulk status updates for authorized roles.
- **Invoice Details**: A dedicated view (`/invoices/:id`) showing customer info, line items, derived financial calculations, and contextual actions.
- **Role-Based Access Control (RBAC)**: A robust UI and domain authorization layer. Users can simulate 4 distinct roles (`ADMIN`, `FINANCE_MANAGER`, `ACCOUNTANT`, `VIEWER`) via a switcher in the header. UI elements (like export and update buttons) map strictly to these permissions.
- **Status Domain Rules**: Enforces valid business state transitions natively (e.g. `DRAFT -> PENDING`, but rejects invalid transitions like `CANCELLED -> PAID`).
- **CSV Export**: A simulated backend data-dump endpoint handles filtered CSV generation directly, cleanly handling text escaping for commas and quotes.

## Technology Stack

- **Framework**: React 18 + Vite (Fast, modern SPA build tooling)
- **Language**: TypeScript (Strict mode enabled, domain model is fully typed)
- **Styling**: Vanilla CSS + CSS Modules + CSS Variables (Structured, scalable design tokens without heavy utility frameworks)
- **Routing**: `react-router-dom`
- **Icons**: `lucide-react`
- **Testing**: `vitest`

## Setup & Running the Project

**No environment variables are required to run this project.**

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles TypeScript and builds the production bundle.
- `npm run lint`: Runs the linter to verify code quality and React hook rules.
- `npx vitest run`: Executes the test suite.

## Architecture Overview

```text
src/
  components/       # Reusable UI primitives (Button, Badge, Layout)
  context/          # React Context providers (AuthContext)
  domain/           # Pure business logic (types, status transitions, RBAC permissions)
  features/         # Feature modules (invoices, dashboard) containing focused components
  hooks/            # Global custom hooks (useAsync, useDebounce, useUrlParams)
  mocks/            # Mock data generation and seed data
  services/         # Simulated backend service layer holding in-memory data
  styles/           # Global CSS variables, reset, and core typography
```

## Key Engineering Decisions

### Service/API Design
UI components do not directly mutate mock arrays. All interactions happen through `invoiceService.ts`, which simulates network latency and returns Promises. This completely decouples the UI from the mock implementation, allowing the application to be wired to a real REST API simply by replacing the service methods.

### Async Request Handling
To prevent race conditions (especially during rapid filter or search changes), the application uses a custom `useAsync` hook integrated with an `AbortController`. If a user types quickly, older, slower requests are canceled and will not overwrite the results of newer requests.

### URL State Design
The URL is treated as the source of truth for the `InvoiceList` filter state. A custom `useUrlParams` hook acts as a bridge. The local search input is debounced before updating the URL, and external URL changes (e.g., browser back button) strictly synchronize back to the local input state without triggering infinite update loops.

### Testing
Core business logic (like Status Transition validity, RBAC constraints, and CSV text escaping) is verified via unit tests using Vitest. This ensures the most critical domain rules remain unbroken.

### Trade-offs
1. **Mock Data Mutability**: The `store.invoices` array is mutated in memory. Restarting the browser resets the mock database.
2. **Client-Side CSV Formatting**: While `exportInvoices` simulates a backend endpoint that fetches the raw payload without pagination limits, the actual `.csv` text string generation remains on the client. In a real application dealing with millions of records, the backend should stream a raw `.csv` file directly.
3. **No External State Manager**: React Context is utilized for Authentication, and React Router handles URL state. Redux or Zustand were omitted because `useUrlParams` combined with the Service architecture provides sufficient control for this scope without unnecessary bloat.

# Product Search Frontend

A lightweight React + Vite application that delivers a real-time product search experience with debounced queries, infinite scrolling, and responsive UI components.

## Features
- **Instant search** with client-side debouncing to minimize API chatter.
- **Infinite scroll** backed by `@tanstack/react-query` for caching and pagination.
- **Accessible UI** built with Tailwind CSS utility classes.
- **Robust error handling** and retry flows for transient network issues.
- **Typed API layer** with Axios and strict TypeScript models.

## Tech Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3
- Axios
- @tanstack/react-query
- Jest + Testing Library for unit tests

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Environment
Create a `.env` (or `.env.local`) file with your API base URL:
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```
If omitted, the app defaults to `/api`.

### Development
```bash
npm run dev
```
Visit the URL shown in the terminal (typically `http://localhost:5173`).

### Testing
```bash
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure
```
src/
  api/           // Axios client and product API helpers
  components/    // Reusable UI components
  hooks/         // Custom hooks (search, intersection observer)
  types/         // Shared TypeScript interfaces
  App.tsx        // Root component
```

## Key Concepts
- `useSearch` hook coordinates debounced queries and infinite pagination.
- `ProductList` renders results, handles loading states, and triggers fetch-more via intersection observer.
- `httpClient` centralizes Axios configuration, including automatic base URL detection and query param pruning.

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – produce production build
- `npm run preview` – preview build locally
- `npm run lint` – run ESLint
- `npm test` / `npm run test:watch` – execute unit tests

## License
This project is distributed under the MIT license. See the [`LICENSE`](LICENSE) file if present for details.

# RepForge

Gym workout tracker with progressive overload and AI Coach. React frontend + Node/Express backend + MongoDB.

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** – registration and workouts require a running MongoDB instance

### Start MongoDB

- **Installed locally:** Start the MongoDB service (e.g. `net start MongoDB` on Windows, or run `mongod`).
- **Docker:** `docker run -d -p 27017:27017 --name mongo mongo:latest`
- **MongoDB Atlas:** Use your Atlas connection string in `.env` as `MONGO_URI`.

## Run the app

1. **Backend** (from project root):
   ```bash
   cd backend
   cp .env.example .env   # if needed, set MONGO_URI and JWT_SECRET
   npm install
   npm start
   ```
   The server starts only after MongoDB connects. If you see "MongoDB connection error", start MongoDB first.

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173

## Features

- **Workouts** – Log exercises (weight, reps, sets), track progressive overload (Progressed / Same / Regressed).
- **AI Coach** – Floating chat widget: get workout suggestions from your history and basic fitness Q&A.

## Environment (backend)

Create `backend/.env` with:

- `MONGO_URI` – e.g. `mongodb://127.0.0.1:27017/gymTracker`
- `JWT_SECRET` – secret for signing tokens
- `PORT` – optional, default 5000

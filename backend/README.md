# Gym Workout Tracker - Backend API

A Node.js + Express backend for tracking gym workouts with JWT authentication and MongoDB.

## Features

- ✅ User authentication (JWT-based)
- ✅ User registration and login
- ✅ Workout CRUD operations
- ✅ MongoDB database with Mongoose ODM
- ✅ Protected routes with authentication middleware
- ✅ RESTful API design

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=mongodb://localhost:27017/gym-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**Important:** 
- Replace `MONGO_URI` with your MongoDB connection string
- Generate a strong random string for `JWT_SECRET` (e.g., use `crypto.randomBytes(32).toString('hex')`)

### 3. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB locally:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`).

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Workout Routes (`/api/workouts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/workouts` | Add a new workout | Yes |
| GET | `/api/workouts` | Get all workouts for authenticated user | Yes |
| GET | `/api/workouts/:id` | Get a single workout by ID | Yes |
| PUT | `/api/workouts/:id` | Update a workout | Yes |
| DELETE | `/api/workouts/:id` | Delete a workout | Yes |

## API Usage Examples

### Register a New User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes a `token` that should be used in subsequent requests.

### Add a Workout

```bash
POST http://localhost:5000/api/workouts
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "exerciseName": "Bench Press",
  "weight": 80,
  "reps": 8,
  "sets": 4,
  "date": "2024-01-15T10:00:00Z"
}
```

### Get All Workouts

```bash
GET http://localhost:5000/api/workouts
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
backend/
├── Server.js              # Main Express server entry point
├── models/
│   ├── User.js           # User Mongoose model
│   └── Workout.js        # Workout Mongoose model
├── controllers/
│   ├── authController.js # Authentication logic
│   └── workoutController.js # Workout CRUD logic
├── Routes/
│   ├── authRoutes.js     # Authentication routes
│   └── workoutRoutes.js  # Workout routes
├── middleware/
│   └── authMiddleware.js # JWT authentication middleware
└── package.json          # Dependencies and scripts
```

# Eventora — MERN Event Booking Platform

A full-stack event booking application built with **MongoDB, Express, React, and Node.js**. Suitable for placement projects and fresher portfolios.

## Features

- User registration with email OTP verification
- Login / logout with JWT authentication
- Browse events by category (Technology, Music, Business, Art)
- Book events with OTP confirmation
- View and cancel your bookings
- Admin dashboard to create, edit, delete events
- Admin can confirm pending bookings

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (Gmail) |

## Project Structure

```
EVENTORA/
├── server/                 # Backend (Express + MongoDB)
│   ├── controller/         # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── utils/              # Email utility
│   ├── seed.js             # Dummy data seeder
│   └── index.js            # Server entry
└── client/vite-project/    # Frontend (React + Vite)
    └── src/
        ├── api/              # Axios instance
        ├── context/          # Auth context
        ├── components/       # Reusable UI
        └── pages/            # Route pages
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (free tier works)

### 2. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Seed dummy data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client/vite-project
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Demo Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventora.com | password123 |
| User | user@eventora.com | password123 |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/verify-otp` — Verify email OTP

### Events
- `GET /api/events` — List all events
- `GET /api/events/:id` — Get event by ID
- `POST /api/events` — Create event (Admin)
- `PUT /api/events/:id` — Update event (Admin)
- `DELETE /api/events/:id` — Delete event (Admin)

### Bookings
- `POST /api/bookings/send-otp` — Send booking OTP
- `POST /api/bookings` — Create booking
- `GET /api/bookings/my` — User's bookings
- `GET /api/bookings/all` — All bookings (Admin)
- `PUT /api/bookings/:id/confirm` — Confirm booking (Admin)
- `DELETE /api/bookings/:id` — Cancel booking

## User Flow

1. **Register** → OTP sent to email → **Verify OTP** → Login
2. **Browse events** on home page → filter by category
3. **View event details** → Send OTP → Enter OTP → **Book event**
4. Check **My Bookings** → cancel if needed
5. **Admin** logs in → creates events → confirms pending bookings

## Gmail App Password Setup

1. Enable 2-Step Verification on Google Account
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Use it as `EMAIL_PASS` in `.env`

## Author

Anjali — MERN Stack Placement Project

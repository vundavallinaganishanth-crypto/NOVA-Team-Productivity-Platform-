# NOVA — Team Productivity Platform

Plan. Collaborate. Deliver.

A full-stack project management app: create projects, manage tasks, add team
members, and track progress — built with React (Vite) on the frontend and
Express + MongoDB on the backend.

## Stack

- **Frontend:** React 19, React Router, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt

## Project structure

```
Nova-Project-Management/
├── client/     # React frontend
└── server/     # Express backend
```

## Getting started

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy `.env.example`) and fill in:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

Then run:

```bash
npm run dev
```

The API will start on `http://localhost:5000`.

### 2. Frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The app will start on `http://localhost:5173` (Vite's default).

### 3. Try it out

1. Register a new account
2. Log in
3. Create a project
4. Open the project → add tasks, update task status, and add team members by email (any other registered user's email)

## Features

- JWT-based authentication (register/login)
- Create, view, update, and delete projects
- Project ownership + membership access control
- Task management per project (create, assign, update status, delete)
- Team member management (add/remove by email, owner-only)
- Dashboard with live stats (project count, task count, in-progress, completed)

## Notes on deployment

- **Backend:** deploy to Render, Railway, or similar. Set the same environment
  variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) in your hosting provider's
  dashboard — never commit `.env`.
- **Frontend:** update the `baseURL` in `client/src/api/axios.js` to point to
  your deployed backend URL, then deploy the `client/` folder to Vercel or
  Netlify (`npm run build` → deploy the `dist/` folder).

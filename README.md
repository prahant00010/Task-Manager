# Team Task Manager (MERN)

A production-ready full-stack Team Task Manager built with **MongoDB**, **Express**, **React**, and **Node.js**.

Teams can create projects, manage members, assign tasks, track progress, comment on tasks, and monitor metrics through a modern SaaS-style dashboard with JWT authentication and role-based access control.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Context API, Framer Motion, React Hot Toast |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, Helmet, rate limiting |
| Database | MongoDB |

## Project Structure

```text
Task-Manager/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios client & API services
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth & app state (Context API)
│       ├── layouts/        # Dashboard & auth layouts
│       ├── pages/          # Route pages
│       ├── routes/         # React Router config
│       └── utils/
├── server/                 # Express API
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/
│   └── validators/
└── package.json            # Root scripts (dev both apps)
```

## MongoDB Schema Relationships

```text
User ──owns──> Project
User <──members[]── Project   (embedded: { user, role })
User ──creates──> Task
User <──assignedTo── Task
Project <──projectId── Task
Task ──comments[]──> { text, author (User) }
```

- **User**: Global role (`admin` | `member`) for app-level RBAC.
- **Project**: `owner` references User; `members` embeds user refs with per-project roles.
- **Task**: References `projectId`, `createdBy`, `assignedTo`; nested `comments` reference authors.

## Authentication Flow

1. User registers (`POST /api/auth/register`) or logs in (`POST /api/auth/login`).
2. Server hashes passwords with **bcryptjs** and returns a **JWT** (`id`, `role`) plus safe user object.
3. Client stores token in `localStorage`; Axios attaches `Authorization: Bearer <token>`.
4. Protected routes use `authMiddleware` → loads user from DB.
5. `GET /api/auth/me` validates session on app load.
6. Expired/invalid tokens return 401; client redirects to login.

## Frontend Routing

| Path | Access | Page |
|------|--------|------|
| `/login`, `/register` | Public | Auth |
| `/dashboard` | Protected | Overview stats |
| `/projects` | Protected | Projects & members |
| `/tasks` | Protected | Tasks (list/kanban) |
| `/team` | Protected | Users table |
| `/profile` | Protected | Account info |
| `/settings` | Protected | Preferences |

`ProtectedRoute` guards dashboard routes; `PublicOnly` redirects authenticated users away from auth pages.

## State Management

- **AuthContext**: User, token, login/register/logout, persistent session.
- **AppContext**: Projects, tasks, users, dashboard stats, CRUD helpers, shared loading.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register (alias: `/signup`)
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

### Users
- `GET /api/users` — List users
- `GET /api/users/:id` — User by id

### Projects
- `GET /api/projects` — User's projects
- `POST /api/projects` — Create (global admin only)
- `GET /api/projects/:id` — Project detail
- `PUT /api/projects/:id` — Update
- `DELETE /api/projects/:id` — Delete
- `POST /api/projects/:id/members` — Add member

### Tasks
- `GET /api/tasks` — List (query: status, priority, search, sortBy)
- `POST /api/tasks` — Create
- `PUT /api/tasks/:id` — Update
- `PATCH /api/tasks/:id` — Partial update
- `DELETE /api/tasks/:id` — Delete
- `POST /api/tasks/:id/comments` — Add comment

### Dashboard
- `GET /api/dashboard` — Stats

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

**server/.env** (copy from `server/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**client/.env** (optional — leave unset in dev to use Vite proxy):

```env
# Dev: omit VITE_API_URL so requests go to /api → Vite proxies to backend
# Production:
# VITE_API_URL=https://your-api.com/api
```

### Demo accounts (dev seed)

```bash
cd server && npm run seed
```

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| Admin | `admin@gmail.com` | `admin123` |
| Employee (member) | `employee@example.com` | `employee123` |
| Employee (member) | `employee@gmail.com` | `employee123` |

Employees can join projects, create tasks, and update status — but **cannot** create new projects (admin only).

Full API reference: [server/API_ROUTES.md](server/API_ROUTES.md)

### Troubleshooting 502 / API errors

1. Ensure **MongoDB** is running.
2. Start **backend** before using the app: `cd server && npm run dev`
3. If you see `502 Bad Gateway` on `/api/*`, the backend is down or unreachable — restart it.
4. Do **not** set `VITE_API_URL` in dev unless the backend is on that exact URL.

### 3. Run development

From project root (both server + client):

```bash
npm install
npm run dev
```

Or run separately:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

- API: http://localhost:5000
- App: http://localhost:5173

## RBAC (Preserved)

| Action | Who |
|--------|-----|
| Create project | Global `admin` |
| Add project member | Project `admin` (or global admin) |
| View/update tasks | Project members |
| Assign task | Assignee must be project member |

## Security

- Helmet HTTP headers
- CORS with configurable origin
- Rate limiting (general + stricter on auth)
- `express-mongo-sanitize` for NoSQL injection
- `express-validator` on inputs
- Password hashing with bcryptjs

## License

ISC

# API Routes Reference

Base URL: `http://127.0.0.1:5000/api` (dev)

All protected routes require header: `Authorization: Bearer <token>`

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Server health check |

## Auth — `/api/auth`

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/register` | No | `{ name, email, password, role? }` | Create account |
| POST | `/signup` | No | same as register | Alias |
| POST | `/login` | No | `{ email, password }` | Login, returns JWT |
| GET | `/me` | Yes | — | Current user |

## Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | List all users |
| GET | `/:id` | Yes | User by MongoDB id |

## Projects — `/api/projects`

| Method | Path | Auth | RBAC | Body |
|--------|------|------|------|------|
| GET | `/` | Yes | Member | — |
| POST | `/` | Yes | Global admin | `{ name, description? }` |
| GET | `/:id` | Yes | Project member | — |
| PUT | `/:id` | Yes | Project admin | `{ name?, description? }` |
| DELETE | `/:id` | Yes | Owner/project admin | — |
| POST | `/:id/members` | Yes | Project admin | `{ userEmail, role? }` |

## Tasks — `/api/tasks`

| Method | Path | Auth | Query / Body |
|--------|------|------|--------------|
| GET | `/` | Yes | `?status&priority&projectId&search&sortBy&order` |
| POST | `/` | Yes | `{ title, projectId, description?, assignedTo?, dueDate?, priority?, status? }` |
| PUT | `/:id` | Yes | Partial task update |
| PATCH | `/:id` | Yes | Same as PUT |
| DELETE | `/:id` | Yes | — |
| POST | `/:id/comments` | Yes | `{ text }` |

## Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | `{ stats: { total, todo, inProgress, done, overdue, byPriority } }` |

## Response format

Success: `{ success: true, ...data }`  
Error: `{ success: false, message, errors? }`

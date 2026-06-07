# InstaWeb — Leads Dashboard

This assignment implements a simple leads management application with a Node/Express backend (Neon DB) and a React + Vite frontend (Tailwind CSS). The app supports creating, listing, updating, deleting, and searching leads.

**Summary:**
- **Backend:** Express server with REST endpoints under `/api/leads` using `@neondatabase/serverless` for Neon/Postgres connectivity.
- **Frontend:** React + Vite single-page app, componentized under `frontend/src`, using Tailwind CSS for styling. Client-side pagination, search, status filtering, create/edit modal, and delete confirmation modal are implemented.



Getting started
---------------

Prerequisites
- Node.js (18+ recommended)
- npm or yarn
- A Neon (Postgres) database; set `DATABASE_URL` accordingly

Environment variables

Backend (create a `.env` file in `backend/`):

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

Frontend (create or edit `frontend/.env`):

```
VITE_API_BASE_URL=http://localhost:3000
```

Database schema (leads table)
----------------------------
Example SQL for the `leads` table used by the backend (adjust types/constraints to your needs):

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE,
  phone_no BIGINT UNIQUE,
  company_name text,
  status lead_status,
  notes text,
  created_date timestamptz DEFAULT now()
);
```

API (backend)
-------------
All endpoints are rooted at `/api/leads` (see [backend/app.js](backend/app.js)).

- `POST /api/leads` — Create a lead. Accepts JSON body with fields such as `name`, `email`, `phone_no`, `company`, `status`, `notes`. Returns the created row.
- `GET /api/leads` — Return all leads ordered by `created_date DESC`.
- `GET /api/leads/search?q=<term>` — Search `name`, `email`, and `company` using a case-insensitive ILIKE match.
- `PUT /api/leads/:id` — Update an existing lead (partial updates supported via COALESCE in the query). Returns the updated row.
- `DELETE /api/leads/:id` — Delete a lead by id.

Error handling notes
- Unique constraint violations from Postgres (e.g. duplicate `email` or `phone_no`) are mapped to HTTP `409 Conflict`. The backend attempts to provide a human-readable message which the frontend displays inside the lead modal. See [backend/app.js](backend/app.js) for `handleDbError`.

Frontend
--------
The frontend is a Vite + React app located in the `frontend/` folder. Key implementation points:

- API wrapper: [frontend/src/services/leadsApi.js](frontend/src/services/leadsApi.js) — centralizes fetch requests and error parsing.
- State & hooks: [frontend/src/hooks/useLeads.js](frontend/src/hooks/useLeads.js) — provides debounced search, leads list, and CRUD wrappers used by the UI.
- Lead dashboard: [frontend/src/features/leads/LeadDashboard.jsx](frontend/src/features/leads/LeadDashboard.jsx) — orchestrates toolbar, table, modals, pagination, and filtering.
- Components: `LeadFormModal`, `DeleteConfirmModal`, `LeadsToolbar`, `LeadsTable` under `frontend/src/components/leads`.

Pagination and filtering
- Pagination is client-side over the dataset returned by `GET /api/leads`. The UI supports page sizes of 10, 20, and 50 (default 10).
- Search is debounced (250ms) and queries the backend search endpoint when a search term is present.

Run the apps (development)
--------------------------
Backend (from repository root):

```bash
cd backend
npm install
node app.js
```

or, to run with nodemon for hot reloads:

```bash
npm install -g nodemon
nodemon app.js
```

Frontend (from repository root):

```bash
cd frontend
npm install
npm run dev
```

Build for production
--------------------
Frontend:

```bash
cd frontend
npm run build
```

Backend:
- The backend is a simple Express server; in production you can run via a process manager (pm2, systemd) or containerize it.

Customization & development notes
--------------------------------
- API base URL: change `VITE_API_BASE_URL` in [frontend/.env](frontend/.env) for staging/production.
- Table name: the backend uses a hard-coded `leads` table; change SQL queries in [backend/app.js](backend/app.js) if you rename the table.
- Duplicate/error messages: the backend inspects Postgres error codes and attempts to return field-specific messages; see `handleDbError` in [backend/app.js](backend/app.js) to extend parsing.
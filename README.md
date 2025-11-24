# HDR-UK — Event Registration

This repository contains a small example application to track event registrations for internal users. It uses a Laravel backend (API) and a Next.js single-page frontend.

### Project Structure
- `backend/`: Laravel application (API server)
  - `app/Models/Event.php` — Event model
  - `app/Http/Controllers/EventController.php` — API controller (list/register/leave)
  - `database/migrations/` — migrations (creates `events` table)
  - `database/seeders/` — seeders (`DatabaseSeeder`, `EventSeeder`)
  - `routes/api.php` — API routes
  - `public/`, `artisan`, etc. — standard Laravel files
- `frontend/`: Next.js SPA (client)
  - `app/page.tsx` — main page that lists events and allows Register / Leave
  - `app/lib/api.ts` — API client functions
  - `package.json` — frontend dependencies and scripts
- `.gitignore` — ignores `vendor`, `node_modules`, `.env` and build artifacts

## Quick Start

1. Start the backend server:

```bash
cd backend
php artisan serve --port=8000
```
2. Start the frontend server:

```bash
cd frontend
npm run dev
```
3. Open `http://localhost:3000` in your browser.

## Backend (Laravel) from Sratch

The backend can run using SQLite (recommended for quick local testing) or MySQL.

SQLite (quick):

1. Open a terminal and go to the backend folder:

```bash
cd backend
```

2. Install dependencies and prepare env (if you haven't already):

```bash
composer install
cp .env.example .env
# Ensure DB_CONNECTION is `sqlite` in .env (default)
touch database/database.sqlite
php artisan key:generate
```

3. Run migrations and seed sample data:

```bash
php artisan migrate --seed
```

4. Start the dev server:

```bash
php artisan serve --port=8000
```

The API base will be `http://localhost:8000/api`.

5. Unit tests:

```bash
php artisan test
```

**Notes:**
For local development with PHP 8.5 you may see a deprecation warning about `PDO::MYSQL_ATTR_SSL_CA`. This repository suppresses E_DEPRECATED at the CLI and HTTP entry points to avoid noisy startup messages (`backend/artisan` and `backend/public/index.php`). This is a development convenience — in production prefer upgrading vendor code or adjusting PHP error reporting centrally.

**API Endpoints**
- `GET /api/events` — list events (JSON)
- `POST /api/events/{id}/register` — increment registration count
- `POST /api/events/{id}/leave` — decrement registration count

All endpoints return JSON and use HTTP status codes for errors (400/404).

## Frontend (Next.js) from Scratch

1. In a new terminal, open the frontend folder:

```bash
cd frontend
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Open `http://localhost:3000` in your browser.

By default the frontend expects the backend at `http://localhost:8000/api`. If your backend runs elsewhere, set the environment variable before starting the frontend:

```bash
export NEXT_PUBLIC_API_BASE="http://localhost:8000/api"
npm run dev
```

The UI uses optimistic updates so it updates immediately on Register/Leave. If the server returns an error the UI will refetch the current state.

4. Frontend tests:

```bash
npm test
``` 

## Troubleshooting
- 404 when the frontend fetches `/api/events`:
  - Ensure the backend is running (`php artisan serve --port=8000`).
  - Verify routes with:

    ```bash
    cd backend
    php artisan route:list | grep events
    curl http://localhost:8000/api/events
    ```

- UNIQUE constraint / seeder errors: run idempotent seeding or refresh DB:

```bash
php artisan db:seed
# or to recreate schema
php artisan migrate:fresh --seed
```


## AI Tooling
 ChatGPT web free guest version (model GPT-5.1) has been used to assist in refining code and documentation within this project.
 Prompts used:
 - command to setup a laravel backend project
 - command to setup a nextjs frontend project
 - what is SWR
 - update Node version
 - php artisan route:list Showing [5] routes, why 5 routes
 - http://localhost:8000/api/events 404, how to fix on backend
 - how should web.php look like
 - add Tests (PHPUnit for backend, Jest for frontend)
 - POST requests + SWR, how to achieve multi-user realtime sync
 - add logging to handle info and errors
 - add global toast message when user register or leave an event successfully

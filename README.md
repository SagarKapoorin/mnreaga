MGNREGA Dashboard (Fullstack)

This project demonstrates a production-ready dashboard for Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) data.

The repository contains two main components:

- **backend/**: Express.js + TypeScript API
  - PostgreSQL via Prisma ORM
  - Redis for caching with TTL and pre-warming
  - Nightly data sync from data.gov.in (with retry/backoff)
  - Zod-based request validation
  - Prometheus metrics endpoint (`/metrics`)
  - Structured logging with request IDs and health checks
  - Dockerfile + Docker Compose for local development

- **frontend/**: React + TypeScript single-page application
  - District selection and performance visualization
  - Interactive charts via Recharts
  - Mobile-first, low-literacy friendly UI

## Local Development

1. Build and start all services (Postgres, Redis, backend, frontend):

   ```bash
   docker-compose up -d --build

   # If you make changes to the backend Dockerfile or `prisma/` schema,
   # rebuild the backend image explicitly:
   # docker-compose up -d --build backend
   ```
   This brings up Postgres, Redis, the backend API (port 5000), and the frontend UI (port 80).

2. Initialize the database (apply migrations and seed data) in the running backend container:

   ```bash
   # Run migrations (uses `--schema=./prisma/schema.prisma` by default)
   docker-compose exec backend npm run prisma:migrate
   docker-compose exec backend npm run prisma:seed
   ```

3. Open your browser at http://localhost/ (or http://localhost:<PORT>/ if you remapped ports) to access the frontend UI.

Frontend will open at http://localhost:3000 and backend at http://localhost:5000.

## Architecture Highlights

- **Type safety** with TypeScript and Zod
- **Resiliency**: retry/backoff on API calls, graceful shutdown, health checks
- **Performance**: Redis caching, pre-warming, P95 <150ms on cache hits
- **Observability**: Prometheus metrics, structured logs with request IDs
- **Scalability**: Docker Compose, easy to scale backend behind a load balancer

## Next Steps

- Add CI/CD pipelines, production deployment scripts
- Enhance accessibility (WCAG) and localization (i18n)
- Integrate real geolocation for district auto-detection
- Monitor with Grafana dashboards and alerting
- Add database materialized views (e.g., `state_monthly_performance`, `national_monthly_performance`) to pre-aggregate metrics per month and speed up `/compare` queries.
- Deploy to a VM/VPS for production:
  - Provision a Linux server (Ubuntu/Debian/CentOS).
  - Install Docker & Docker Compose on the server.
  - Clone this repo and set up `backend/.env` with production variables.
  - Run `docker-compose up -d --build` to start backend, Postgres, Redis, and frontend.
  - Configure a reverse proxy (e.g., Nginx) with SSL (Let's Encrypt) to expose services.
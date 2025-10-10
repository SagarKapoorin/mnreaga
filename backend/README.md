# MGNREGA Dashboard Backend

This is the backend service for the MGNREGA dashboard, built with Express, TypeScript, and Prisma.

## Setup

1. Copy `.env.example` to `.env` and fill in environment variables.
   - `DATA_GOV_API_URL`: e.g. `https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722`
   - `DATA_GOV_API_KEY`: your API key from data.gov.in
   - Set `DATA_GOV_API_URL` to your Data.gov.in resource endpoint (e.g., `https://api.data.gov.in/resource/RESOURCE_ID`).
     If unset, the seed script will populate sample data instead.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Seed the database:
   ```bash
   npm run prisma:seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

**Data Sync Example**
You can test the upstream Data.gov.in API manually using curl:
```bash
curl -X GET \
  "${DATA_GOV_API_URL}?api-key=${DATA_GOV_API_KEY}&format=json&filters[state_name]=MADHYA%20PRADESH&filters[fin_year]=2023&filters[month]=10" \
  -H 'accept: application/json'
```
The response will include metadata and a `records` array with monthly metrics for the specified state, financial year, and month.
- `dev`: Run the server in development mode with hot reload.
- `build`: Compile TypeScript to JavaScript.
- `start`: Run the compiled server in production mode.
- `prisma:generate`: Generate the Prisma client.
- `prisma:migrate`: Apply database migrations.

## Docker Compose (Local Development)

Ensure Docker and Docker Compose are installed. From the project root, run:
```bash
docker-compose up --build
```
This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend service on port 5000

After services are up, in another terminal:
```bash
docker-compose exec backend npm run prisma:generate
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

## Folder Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server bootstrap
│   ├── cors.ts             # CORS configuration
│   ├── validate.ts         # Zod validation middleware
│   ├── routes/
│   │   ├── health.ts       # Health check endpoint
│   │   └── districts.ts    # District data endpoints
│   ├── jobs/
│   │   ├── scheduler.ts    # Job scheduler setup
│   │   └── tasks.ts        # Sync and cache warming tasks
│   └── utils/
│       ├── errorHandler.ts # Global error handler
│       ├── logger.ts       # Winston logger
│       ├── dates.ts        # Date helper functions
│       └── strings.ts      # String helper functions
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Seed script for initial data
├── docs/
│   └── openapi.yaml        # OpenAPI specification
├── .env.example            # Example environment variables
├── Dockerfile              # Docker build instructions
└── README.md               # Project overview
```
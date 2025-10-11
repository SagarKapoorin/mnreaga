# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install all deps (including dev) for build and Prisma generation
RUN npm install
# Copy Prisma schema and generate client code
COPY prisma ./prisma
RUN npx prisma generate
# Copy rest of source and compile TS
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
    # Install all dependencies (including dev) so ts-node and prisma CLI are available for migrations/seeding
    RUN npm install
# Copy Prisma schema and migrations for runtime migrate/seed
COPY prisma ./prisma
# Copy built Prisma client and engine
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Copy compiled app
COPY --from=builder /app/dist ./dist
CMD ["npm", "start"]

# Healthcheck to ensure the API is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:5000/api/health || exit 1
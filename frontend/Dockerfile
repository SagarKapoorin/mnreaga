###
# Multi-stage Dockerfile for building and serving the frontend
###
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
# Install build dependencies for image optimization plugins
RUN apt-get update && apt-get install -y --no-install-recommends \
    autoconf automake libtool pkg-config build-essential nasm \
    libpng-dev zlib1g-dev libjpeg62-turbo-dev \
    && rm -rf /var/lib/apt/lists/*
# Install Node dependencies
RUN npm ci
# Copy the rest of the application
COPY . .
# Build the production assets
RUN npm run build

###
# Stage 2: serve with nginx
###
FROM nginx:stable-alpine
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
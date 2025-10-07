###
# Multi-stage Dockerfile for building and serving the frontend
###
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
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
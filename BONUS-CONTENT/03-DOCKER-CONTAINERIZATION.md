# Docker & Containerization Guide

## Dockerfile for Angular Application

```dockerfile
# Build stage
FROM node:16-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/app /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

## Nginx Configuration

```nginx
# nginx.conf
server {
  listen 80;
  server_name _;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  # Root directory
  root /usr/share/nginx/html;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Disable cache for index.html
  location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }
}
```

## Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
    networks:
      - app-network
    restart: unless-stopped

  api:
    image: node:16-alpine
    working_dir: /app
    volumes:
      - ./api:/app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=mongodb://mongo:27017/app
    depends_on:
      - mongo
    networks:
      - app-network
    restart: unless-stopped

  mongo:
    image: mongo:5
    environment:
      - MONGO_INITDB_DATABASE=app
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

## Multi-Stage Build with Optimization

```dockerfile
# Stage 1: Dependencies
FROM node:16-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 3: Production
FROM nginx:alpine
COPY --from=build /app/dist/app /usr/share/nginx/html
COPY --from=dependencies /app/node_modules /usr/share/nginx/html/node_modules
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

## Building and Running

```bash
# Build image
docker build -t my-angular-app:latest .

# Run container
docker run -d -p 80:80 my-angular-app:latest

# Docker Compose
docker-compose up -d

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Push to registry
docker tag my-angular-app:latest myregistry/my-angular-app:latest
docker push myregistry/my-angular-app:latest
```

## Environment Management

```dockerfile
# Use build args for environment variables
FROM node:16-alpine

ARG API_URL=http://localhost:3000
ARG ENVIRONMENT=production

ENV API_URL=${API_URL}
ENV ENVIRONMENT=${ENVIRONMENT}

# Copy and build
COPY . .
RUN npm ci && npm run build -- --configuration ${ENVIRONMENT}

# Usage: docker build --build-arg API_URL=https://api.example.com -t app .
```

## Best Practices

1. **Use Alpine Linux** - Smaller image sizes
2. **Multi-stage builds** - Reduce final image size
3. **Minimize layers** - Combine RUN commands
4. **Use .dockerignore** - Exclude unnecessary files
5. **Security** - Don't run as root
6. **Health checks** - Monitor container health
7. **Logging** - Use proper logging drivers


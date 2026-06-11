# Blue Edge Fleet Management — Backend
# Multi-stage build for NestJS API

# ─── Stage 1: Build ───
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ─── Stage 2: Production ───
FROM node:20-alpine AS production
WORKDIR /app

# Security: non-root user
RUN addgroup -S blueedge && adduser -S api -G blueedge

# Install production deps only
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built app
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

USER api
EXPOSE 3000

CMD ["node", "dist/main.js"]

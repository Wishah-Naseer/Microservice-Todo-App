# Stage 1: Build
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# copy only production deps
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# copy compiled code
COPY --from=builder /app/dist ./dist

# bind to the correct port (adjust if your service runs on a different one)
EXPOSE 4000

# start the app
CMD ["node", "dist/index.js"]

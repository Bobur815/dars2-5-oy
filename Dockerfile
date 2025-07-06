# Dockerfile (at project root)
FROM node:20-alpine

# we’ll use BuildKit features for network tuning
# syntax must be on the very first line:
# ───────────────────────────────────────────────
# syntax=docker/dockerfile:1.4
# ───────────────────────────────────────────────

WORKDIR /app

# 1) copy lockfile too
COPY package.json package-lock.json ./

# 2) configure npm for better resilience then install dependencies
#    - increase retry count
#    - back off more on each retry
#    - extend timeouts
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-factor 10 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --silent

# 3) copy the rest of your code
COPY . .

EXPOSE 3000
CMD ["npm","run","start:dev"]

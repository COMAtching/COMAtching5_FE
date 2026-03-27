# ===========================
# Stage 1: Dependencies
# ===========================
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile


# ===========================
# Stage 2: Builder
# ===========================
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 🔥 .env 포함
COPY .env .env
COPY . .

RUN pnpm run build


# ===========================
# Stage 3: Runner
# ===========================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 🔥 .env 복사
COPY --from=builder /app/.env ./.env

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# 🔥 .env → 환경변수 export 후 실행
CMD ["sh", "-c", "set -a && . ./.env && set +a && node server.js"]

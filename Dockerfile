# ===========================
# Stage 1: Dependencies
# ===========================
FROM node:24-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile


# ===========================
# Stage 2: Builder
# ===========================
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


# ===========================
# Stage 3: Runner
# ===========================
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# 환경변수는 docker run --env-file .env 또는 -e KEY=VALUE 로 외부 주입
CMD ["node", "server.js"]

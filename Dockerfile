# ===========================
# Stage 1: Dependencies
# ===========================
FROM node:18-alpine AS deps

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치 (프로덕션 의존성만)
RUN pnpm install --prod --frozen-lockfile

# ===========================
# Stage 2: Builder
# ===========================
FROM node:18-alpine AS builder

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 빌드 시 환경 변수 선언 (NEXT_PUBLIC_* 변수들은 빌드 타임에 필요)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY

# 환경 변수로 설정
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=$NEXT_PUBLIC_FIREBASE_VAPID_KEY

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 모든 의존성 설치 (devDependencies 포함)
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN pnpm run build

# ===========================
# Stage 3: Runner (Production)
# ===========================
FROM node:18-alpine AS runner

WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV=production

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 소유권 변경
RUN chown -R nextjs:nodejs /app

# non-root 유저로 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js 서버 실행
CMD ["node", "server.js"]

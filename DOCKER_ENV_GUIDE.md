# 🐳 Docker & Jenkins 환경 변수 관리 가이드

## 📋 목차

1. [환경 변수 관리 방법](#환경-변수-관리-방법)
2. [로컬 개발](#로컬-개발)
3. [Jenkins 설정](#jenkins-설정)
4. [Docker 명령어](#docker-명령어)

---

## 🔐 환경 변수 관리 방법

### ⚠️ 중요: `.env` 파일은 절대 Git/Docker 이미지에 포함하지 마세요!

### 📁 환경 변수 파일 구조

```
.env.example        ← 템플릿 (Git ✅, 실제 값 없음)
.env.development    ← 개발 환경 (Git ❌, 로컬/개발 서버용)
.env.production     ← 프로덕션 환경 (Git ❌, 실제 배포용)
.env.local          ← 개인 로컬 설정 (Git ❌, 최우선 순위)
```

### 🔄 Next.js 자동 로딩 순서

| 명령어           | 로딩되는 파일 (우선순위 순)                                           |
| ---------------- | --------------------------------------------------------------------- |
| `pnpm run dev`   | `.env.development.local` → `.env.local` → `.env.development` → `.env` |
| `pnpm run build` | `.env.production.local` → `.env.local` → `.env.production` → `.env`   |

### 📝 필요한 환경 변수

현재 프로젝트는 다음 환경 변수들을 사용합니다:

- `BACKEND_LOCATION` - 백엔드 서버 주소
- `NEXT_PUBLIC_API_URL` - API 서버 주소
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API 키
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth 도메인
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase 프로젝트 ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage 버킷
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase 메시징 발신자 ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase 앱 ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase 측정 ID
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` - Firebase VAPID 키

---

## 💻 로컬 개발

### 방법 1: 환경별 파일 사용 (권장)

프로젝트에는 이미 `.env.development`와 `.env.production` 파일이 생성되어 있습니다.

```bash
# 개발 모드 실행 (.env.development 자동 로드)
pnpm run dev

# 프로덕션 빌드 (.env.production 자동 로드)
pnpm run build
pnpm start
```

### 방법 2: 개인 설정 파일 생성

개인별로 다른 설정이 필요한 경우:

```bash
# .env.local 파일 생성 (최우선 순위!)
cp .env.example .env.local

# .env.local 파일 수정
# 예: 로컬 백엔드 서버 주소 변경
BACKEND_LOCATION=http://192.168.0.100:8080
```

### 방법 3: Docker Compose로 실행

```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

---

## 🔧 Jenkins 설정

### 1. Jenkins Credentials 등록

Jenkins 관리 → Credentials → Global credentials 에서 각 환경 변수를 등록합니다:

| Credential ID                      | Type        | Value                         |
| ---------------------------------- | ----------- | ----------------------------- |
| `BACKEND_LOCATION`                 | Secret text | `http://3.38.167.73:8080`     |
| `NEXT_PUBLIC_API_URL`              | Secret text | `https://srv.comatching.site` |
| `NEXT_PUBLIC_FIREBASE_API_KEY`     | Secret text | `실제 API 키`                 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Secret text | `실제 Auth Domain`            |
| ...                                | ...         | ...                           |

### 2. Jenkinsfile 사용

프로젝트에 포함된 `Jenkinsfile`이 자동으로 Credentials를 읽어서 사용합니다.

Jenkins Pipeline 생성 시:

1. **New Item** → **Pipeline** 선택
2. **Pipeline** 섹션에서:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: 프로젝트 Git URL
   - Script Path: `Jenkinsfile`

---

## 🐋 Docker 명령어

### 방법 1: 빌드 시 환경 변수 주입 (권장)

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://srv.comatching.site \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id \
  --build-arg NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key \
  -t comatching-fe:latest .
```

### 방법 2: 런타임에 환경 변수 주입

```bash
docker run -d \
  -p 3000:3000 \
  -e BACKEND_LOCATION=http://3.38.167.73:8080 \
  -e NEXT_PUBLIC_API_URL=https://srv.comatching.site \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  -e NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id \
  -e NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key \
  --name comatching-fe \
  comatching-fe:latest
```

### 방법 3: .env 파일 사용 (로컬 개발만)

```bash
# .env 파일을 컨테이너에 마운트
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name comatching-fe \
  comatching-fe:latest
```

---

## 🔍 Next.js 환경 변수 주의사항

### `NEXT_PUBLIC_*` 변수

- **빌드 타임**에 번들에 포함됩니다
- 클라이언트 사이드에서 접근 가능합니다
- **반드시 빌드 시점에 주입**해야 합니다 (`--build-arg` 사용)

### 일반 환경 변수 (예: `BACKEND_LOCATION`)

- 서버 사이드에서만 사용 가능합니다
- 런타임에 주입 가능합니다 (`-e` 사용)

---

## 📝 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `.env.example` 파일에 필요한 모든 변수가 나열되어 있는지 확인
- [ ] Jenkins Credentials에 모든 환경 변수가 등록되어 있는지 확인
- [ ] Docker 이미지 빌드 시 `--build-arg`로 `NEXT_PUBLIC_*` 변수를 전달하는지 확인
- [ ] 프로덕션 환경에서 실제 값으로 환경 변수가 설정되어 있는지 확인

---

## 🆘 문제 해결

### Q: 환경 변수가 `undefined`로 나옵니다

A: `NEXT_PUBLIC_*` 변수는 빌드 시점에 주입해야 합니다. `--build-arg`를 사용하세요.

### Q: Docker 이미지 크기가 너무 큽니다

A: 멀티 스테이지 빌드를 사용하고 있으므로 최종 이미지는 최적화되어 있습니다. `node_modules`는 포함되지 않습니다.

### Q: Jenkins에서 환경 변수를 못 읽습니다

A: Jenkins Credentials Manager에 Credential ID가 정확히 일치하는지 확인하세요.

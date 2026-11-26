# COMAtching Frontend

Next.js 16 / React 19. 프로젝트 실행 버전은 Node.js 24, pnpm 10.28.1이다.

## 로컬 실행

Homebrew로 설치한 nvm이 있다면 새 터미널에서 다음 순서로 실행한다:

```bash
nvm install       # .nvmrc의 Node 24 설치 또는 기존 버전 선택
nvm use
npm install -g pnpm@10.28.1  # 해당 Node 버전에서 최초 1회
pnpm install --frozen-lockfile
cp .env.development.example .env.development.local  # 최초 1회, 기존 파일 유지
pnpm dev
```

접속: http://localhost:3000. 백엔드 Gateway는 http://localhost:8080에서 실행한다.

## 로컬 / 운영 설정 선택

| 구분 | 로컬 개발 | 운영 빌드/실행 |
|---|---|---|
| 명령 | `pnpm dev` | `pnpm build`, `pnpm start` / 기존 Docker 배포 |
| env | `.env.development.local` | 기존 `.env` 또는 `.env.production.local` |
| API | localhost:8080 | 운영 API |
| 최초 기능 상태 (백엔드 기본값) | 모든 기능 운영 | 전체 서비스 종료 (매칭·상점도 개별 종료) |
| Firebase 기본값 | false | true |
| localhost CSP/이미지 허용 | 개발 환경에서만 허용 | 미허용 |

최초 상태는 사용자 서비스의 `OPERATIONS_INITIALLY_CLOSED`에서 정한다. 이후 `/adminpage/operations`에서 전체 서비스와 채팅·매칭·상점을 관리한다. 전체 종료 시 열린 회원 탭은 종료 안내로 이동하고, 재개 후에는 새 로그인이 필요하다.

Next.js가 실행 모드에 맞는 env 파일을 자동 선택한다. `.env.development.local`은 운영 빌드에서 읽지 않으므로 운영에서 가져온 `.env`와 함께 둘 수 있다. `.env.local`은 개발/운영 공통으로 읽히므로 이 구성에서는 만들지 않는다. 셸에 이미 export한 동일 이름의 값은 파일보다 우선하므로 실행 전 확인한다.

`NEXT_PUBLIC_*`는 브라우저 번들에 포함된다. 값 변경 후 개발 서버를 재시작하고, 운영에서는 다시 빌드해야 한다. 서버 비밀키는 NEXT_PUBLIC 변수에 넣지 않는다.

로컬 설정:

```dotenv
SERVER_API_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FIREBASE_ENABLED=false
```

`SERVER_API_URL`은 서버 요청과 개발 API 프록시, `NEXT_PUBLIC_API_URL`은 카카오 이동/채팅/FCM 직접 요청 등에 쓰인다. 기존 예제의 `BACKEND_LOCATION`은 사용하지 않는다. 개발 주소는 localhost로 통일한다.

## Firebase 복구

운영 프론트 env 또는 Firebase 콘솔에서 `.env.development.example`에 나열된 `NEXT_PUBLIC_FIREBASE_*` 웹 설정과 VAPID 키를 가져온다. `NEXT_PUBLIC_FIREBASE_ENABLED=true`로 변경 후 `pnpm dev`를 다시 실행한다. 백엔드 notification의 서비스 계정도 같은 Firebase 프로젝트로 맞춘다.

Firebase를 끄면 알림 권한 요청과 FCM 등록을 생략한다. 개발 환경에서는 이전에 등록한 `/sw.js`도 해제한다. 운영에서는 Firebase 설정과 독립적으로 오프라인 안내 화면을 설치하고 구버전의 개인 문서 캐시를 삭제한다.

카카오 로그인 테스트 시 백엔드의 `KAKAO_REDIRECT_URI`와 Kakao Developers의 등록 URI를 `http://localhost:8080/login/oauth2/code/kakao`로 맞춘다.

## 확인

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

기본 로컬 점검 순서: 화면 → 이메일/카카오 로그인 → 프로필 → 매칭 → 채팅 → 이미지 업로드/푸시. 실제 외부 서비스 키와 로컬 테스트 계정이 없는 상태에서는 화면/기동 확인과 전체 기능 테스트를 구분한다.

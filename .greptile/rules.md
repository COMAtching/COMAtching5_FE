# Code Review Rules

## 1. Language

- 모든 코드 리뷰, 코멘트, 피드백, 수정 제안은 반드시 한국어로 작성하세요.
- 코드와 주석이 영어로 작성되어 있어도 리뷰는 한국어로 작성하세요.
- 불필요하게 장황한 설명은 피하고, 문제와 해결 방법을 명확하게 작성하세요.

## 2. Project Stack

이 프로젝트의 주요 기술 스택은 다음과 같습니다.

- React 19
- Next.js 16
- TypeScript
- App Router
- Tailwind CSS

모든 리뷰는 React 19 및 Next.js 16의 현재 권장 패턴과 프로젝트의 기존 코드 구조를 기준으로 수행하세요.

## 3. Review Priority

다음 순서로 문제를 우선적으로 검토하세요.

1. 실제 버그 또는 런타임 오류 가능성
2. 보안 문제
3. 데이터 손실 또는 잘못된 상태 변경 가능성
4. React 및 Next.js API의 잘못된 사용
5. 성능 문제
6. 접근성 문제
7. 타입 안정성
8. 유지보수성 및 코드 구조
9. 코드 스타일

단순히 다른 구현 방법이 존재한다는 이유만으로 문제를 지적하지 마세요.

실제 코드의 품질, 안정성, 성능 또는 유지보수성에 영향을 주는 경우에만 리뷰 코멘트를 작성하세요.

## 4. React 19

### React Compiler

- React Compiler 사용을 고려하여 불필요한 `useMemo`, `useCallback` 사용을 검토하세요.
- 참조 안정성이 실제로 필요하거나 외부 라이브러리 API에서 요구하는 경우에는 문제로 지적하지 마세요.

### Forms

- 폼 처리 시 `useActionState`, `useFormStatus` 등의 React 19 API를 적절히 활용할 수 있는지 검토하세요.
- 네트워크 응답을 기다리는 동안 사용자 경험 개선이 필요한 경우 `useOptimistic` 활용 가능성을 검토하세요.
- 기존 구현보다 실질적으로 안전하거나 단순해지는 경우에만 새로운 API 사용을 제안하세요.

### ref

- React 19에서는 필요한 경우 `ref`를 prop으로 전달할 수 있으므로 불필요한 `forwardRef` 사용을 검토하세요.
- 기존 코드에 `forwardRef`가 있다는 이유만으로 반드시 문제로 판단하지 마세요.

### use()

- Promise 또는 Context를 읽는 코드에서는 `use()` 활용이 적절한 경우 이를 고려하세요.
- 기존 구현보다 명확하거나 실질적인 이점이 있는 경우에만 제안하세요.

## 5. Next.js 16

### App Router

- App Router 구조를 기준으로 리뷰하세요.

### Async Request APIs

다음 API의 비동기 처리를 확인하세요.

- `params`
- `searchParams`
- `cookies()`
- `headers()`

Next.js 16 환경에서 Promise 형태의 값을 동기적으로 사용하는 코드가 있다면 지적하세요.

### Metadata

- `<title>` 등의 SEO 정보를 컴포넌트 내부에서 직접 관리하기보다 `metadata` 또는 `generateMetadata()`를 사용하는 것이 적절한지 확인하세요.

### Server Components 및 Client Components

- 불필요한 `'use client'` 사용을 확인하세요.
- 상태, 이벤트 핸들러 또는 브라우저 API가 필요하지 않은 컴포넌트는 Server Component로 유지하는 것을 우선하세요.
- Client Component의 범위가 지나치게 넓어지는 구조를 지적하세요.

### Server Actions

- 데이터 Mutation에 Server Actions가 적절하게 사용되고 있는지 확인하세요.
- Webhook, 외부 API, 공개 REST Endpoint 등 Route Handler가 적절한 경우에는 Server Actions 사용을 강제하지 마세요.

### Caching

- 데이터 특성에 맞는 캐싱 전략이 사용되고 있는지 확인하세요.
- 캐싱 가능한 데이터에는 `use cache`, `force-cache` 등의 활용을 검토하세요.
- 최신성이 필요한 데이터에 캐싱을 강제하지 마세요.

### Streaming

- 데이터 로딩 시간이 긴 화면에서는 `Suspense`, `loading.tsx` 등을 통한 Streaming 활용 가능성을 검토하세요.
- 단순하거나 즉시 로딩되는 화면에 불필요한 Streaming 구조를 강제하지 마세요.

## 6. TypeScript

- `any` 사용을 최소화하고 가능한 경우 구체적인 타입을 사용하세요.
- 타입을 알 수 없는 외부 데이터는 `unknown`으로 받고 적절한 타입 Narrowing을 수행하는지 확인하세요.
- 불필요한 타입 Assertion인 `as` 사용을 확인하세요.
- `params`, `searchParams` 등 비동기 Props의 타입이 실제 Next.js 16 동작과 일치하는지 확인하세요.
- Server Action의 입력값과 반환값에 명확한 타입이 있는지 확인하세요.
- `?.`, `??` 등을 이용해 `null` 또는 `undefined` 상황이 적절하게 처리되는지 확인하세요.

## 7. Performance

- 일반 `<img>` 대신 `next/image` 사용이 적절한 경우 이를 권장하세요.
- 이미지 크기 미지정으로 인한 CLS 가능성을 확인하세요.
- 무거운 컴포넌트나 라이브러리가 불필요하게 초기 번들에 포함되는지 확인하세요.
- 필요한 경우 `next/dynamic` 또는 Lazy Loading을 검토하세요.
- 불필요한 Client Component 전환으로 클라이언트 JavaScript 번들이 증가하지 않는지 확인하세요.
- 반복적인 계산, 네트워크 요청 또는 렌더링이 발생하는지 확인하세요.
- 측정 가능한 영향이나 명확한 병목이 없는 미세 최적화는 지적하지 마세요.

## 8. Component Design

- 하나의 컴포넌트가 지나치게 많은 책임을 갖는지 확인하세요.
- 단순히 코드가 200줄을 넘었다는 이유만으로 무조건 분리하지 마세요.
- UI, 데이터 Fetching, 상태 관리 및 비즈니스 로직이 지나치게 결합되어 있다면 분리를 제안하세요.
- Server Component와 Client Component의 책임이 명확히 구분되어 있는지 확인하세요.

## 9. Naming & Clean Code

- 변수, 함수 및 컴포넌트 이름이 역할을 명확하게 표현하는지 확인하세요.
- 이벤트 Handler 함수는 `handleClick`, `handleSubmit`, `handleChange` 등의 형태를 권장하세요.
- 이벤트 Callback Prop은 `onClick`, `onSubmit`, `onChange` 등의 일반적인 React 관례를 따르세요.
- 중복 코드나 불필요하게 복잡한 조건문을 확인하세요.
- 기존 프로젝트에서 일관되게 사용하는 명명 규칙이 있다면 해당 규칙을 우선하세요.

## 10. Tailwind CSS

- 프로젝트에서는 Tailwind CSS를 기본 스타일링 방식으로 사용하세요.
- 조건부 Class 조합에는 필요한 경우 `clsx`, `tailwind-merge` 또는 프로젝트의 `cn()` 유틸리티 사용을 권장하세요.
- 동일한 스타일이 반복되거나 지나치게 긴 `className`으로 인해 유지보수성이 실질적으로 떨어지는 경우 개선을 제안하세요.
- 단순히 Class 문자열이 길다는 이유만으로 분리를 강제하지 마세요.

## 11. Security

특히 다음 사항을 중요하게 검토하세요.

- Server Action 및 Route Handler의 인증·인가 확인 누락
- 사용자 입력을 그대로 신뢰하는 코드
- XSS 가능성
- 민감정보 노출
- 클라이언트 번들에 Secret 또는 서버 전용 환경변수가 포함되는 문제
- 권한 확인 없이 데이터 수정이 가능한 코드

사용자 입력은 서버에서 반드시 검증되어야 합니다.

클라이언트 검증은 사용자 경험 개선 목적으로 사용할 수 있지만 서버 검증을 대체할 수 없습니다.

## 12. Accessibility

다음 사항을 확인하세요.

- 이미지의 `alt`
- 아이콘 전용 버튼의 `aria-label`
- 입력 필드와 `label` 연결
- 키보드 접근성
- 올바른 `button` 타입
- 적절한 Semantic HTML
- 클릭 가능한 `div` 사용 여부

실제 사용성과 접근성에 영향을 주는 경우에만 리뷰 코멘트를 작성하세요.

## 13. HTML / Web Standards

- 의미 없는 `<div>` 남용을 확인하세요.
- 가능한 경우 `main`, `section`, `article`, `nav`, `button` 등의 Semantic HTML을 사용하세요.
- 잘못된 DOM Nesting을 확인하세요.
- React Hydration Mismatch를 유발할 수 있는 HTML 구조를 중요하게 검토하세요.
- `<p>` 내부의 `<div>` 등 유효하지 않은 HTML 구조를 지적하세요.

## 14. Review Comment Format

문제를 발견한 경우 다음 기준에 따라 작성하세요.

- 무엇이 문제인지 명확하게 설명하세요.
- 실제로 어떤 문제가 발생할 수 있는지 설명하세요.
- 가능한 경우 구체적인 수정 방법이나 코드 예시를 제시하세요.
- 문제의 심각도를 `Critical`, `High`, `Medium`, `Low` 중 하나로 표시하세요.
- 파일 경로와 관련 코드 위치를 명시하세요.

리뷰 코멘트는 짧고 실용적으로 작성하세요.

사소한 개인 취향이나 단순한 스타일 차이에 대해서는 코멘트를 남기지 마세요.

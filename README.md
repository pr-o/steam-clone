# Steam 스토어 클론

Steam 스토어를 픽셀 단위로 재현한 웹 + 데스크탑 클론 프로젝트

---

# Steam 스토어 클론

Steam 스토어 UI를 재현한 모노레포 기반 풀스택 클론 프로젝트

Next.js 웹 앱과 Electron 데스크탑 앱이 공통 패키지를 공유하는 모노레포 구조다. 게임 탐색, 리뷰 조회, 장바구니·위시리스트 관리, 검색 등 Steam 스토어의 핵심 기능을 재현한다. 실제 백엔드나 Steam API 연결은 없으며, 모든 데이터는 브라우저 서비스 워커 기반의 MSW(Mock Service Worker)로 시뮬레이션된다.

## 모노레포 구조

**도구:** pnpm workspaces + Turborepo

```
steam-clone/
├── apps/
│   ├── web/        # Next.js 15 + React 19 — 스토어 웹사이트 (포트 :3000)
│   └── desktop/    # Electron 35 + React 19 + Vite 5 — 데스크탑 클라이언트
├── packages/
│   ├── ui/         # 공유 React 컴포넌트 (GameCard, PriceDisplay, RatingBadge 등)
│   ├── types/      # 공유 TypeScript 타입 (Game, User, Cart, Review 등)
│   └── api/        # 공유 API 클라이언트 팩토리 (createApiClient)
```

모든 패키지는 TypeScript 소스를 직접 export한다. Next.js와 Vite가 빌드 시점에 컴파일하므로 별도의 패키지 빌드 단계가 없다.

## 주요 모듈

- **Next.js 15** (App Router, 웹 프레임워크)
- **Electron 35** + **electron-vite 2** (데스크탑 셸)
- **React 19** (두 앱 공통)
- **TypeScript 5** (전 패키지 타입 안전성)
- **Tailwind CSS 3** (스타일링 — CSS 커스텀 프로퍼티 기반 Steam 브랜드 컬러 토큰)
- **shadcn/ui** (Radix UI 프리미티브 — 앱별 설치, Steam 테마 적용)
- **MSW 2** (브라우저 서비스 워커 기반 목 API 백엔드)
- **TanStack React Query 5** (서버 상태 관리 — `staleTime: 60_000`)
- **Jotai 2** (클라이언트 전용 상태 — 장바구니, 위시리스트, UI, 유저 세션)
- **Embla Carousel 8** (히어로 캐러셀 및 피처드 행)
- **wouter 3** (데스크탑 SPA 경량 라우터)
- **react-resizable-panels** (데스크탑 패널 레이아웃)
- **Lucide React** (아이콘)

## 웹 앱 페이지

| 경로 | 설명 |
|---|---|
| `/` | 홈 — 히어로 캐러셀, 피처드 게임, 특가 섹션, 탑 셀러, Steam Deck |
| `/app/[id]/[slug]` | 게임 상세 — 스크린샷, 설명, 리뷰, 평점, 가격 |
| `/cart` | 장바구니 — 상품 목록, 주문 요약, 추천 게임 |
| `/search` | 검색 결과 — 쿼리 기반 필터링 |
| `/login` | 로그인 — 블러 처리된 게임 그리드 배경, QR 코드 스텁, 계정 생성 흐름 |
| `/specials` | 전체 특가 목록 |
| `/specials/[slug]` | 동적 특가 랜딩 페이지 |
| `/explore/new` | 신작 및 인기 게임 (정렬 지원) |
| `/explore/upcoming` | 출시 예정 게임 |
| `/genre/[name]` | 장르별 게임 목록 |
| `/ways-to-play/[slug]` | 동적 플레이 방식 페이지 |
| `/about` | Steam 소개 — 교차 배치 피처 섹션, 기능 그리드 |
| `/community` | 커뮤니티 소개 |
| `/support` | 고객 지원 소개 |
| `/hardware` | Steam 하드웨어 쇼케이스 |
| `/points/shop` | 포인트 상점 스텁 |

## 데스크탑 앱 뷰

사이드바 탭 네비게이션과 리사이즈 가능한 패널로 구성된 단일 페이지 SPA다.

| 뷰 | 설명 |
|---|---|
| **Store** | 게임 탐색 및 구매 |
| **Library** | 보유 게임 라이브러리 |
| **Community** | 커뮤니티 기능 |
| **Profile** | 유저 프로필 및 통계 |
| **Downloads** | 다운로드 현황 및 대기열 |
| **Settings** | 앱 환경설정 |
| **Game Launch Screen** | 게임 실행 화면 |

**레이아웃:**
```
[ TitleBar — 윈도우 컨트롤, 검색 ]
[ 사이드바 네비게이션 ] [ 콘텐츠 영역 — 활성 뷰 ]
```

## 데이터 및 상태 관리

### 목 데이터 (MSW)

Counter-Strike 2, Dota 2, Cyberpunk 2077, Baldur's Gate 3, Elden Ring, Stardew Valley, Civilization VII 등 22개의 목 게임이 장르별로 포함된다. 각 게임은 할인 가격, 평점, 스크린샷, 플랫폼 지원 여부, 카테고리, 장르, 태그 등 전체 메타데이터를 포함한다.

리뷰는 게임 ID별로 관리된다. 목 유저 계정은 5개의 게임 라이브러리, 위시리스트, 지갑 잔액을 포함한다.

**MSW가 인터셉트하는 API 엔드포인트:**
- `GET /api/games/featured`
- `GET /api/games?genre=…`
- `GET /api/games/search?q=…`
- `GET /api/games/:id`
- `GET /api/games/:gameId/reviews`
- `GET /api/users/me`
- `POST /api/users/me/wishlist`

### 클라이언트 상태 (Jotai 아톰)

| 아톰 | 상태 |
|---|---|
| `cartItemsAtom` | 장바구니 상품 목록 |
| `cartCountAtom` / `cartTotalAtom` | 파생: 장바구니 수량 및 합계 |
| `wishlistAtom` | 위시리스트 게임 ID 배열 |
| `currentUserAtom` / `isSignedInAtom` | 세션 유저 및 로그인 여부 |
| `searchQueryAtom` | 현재 검색 입력값 |
| `mobileNavOpenAtom` | 모바일 드로어 열림/닫힘 |
| `activeVideoAtom` | 게임 상세 페이지 활성 미디어 인덱스 |

### 데이터 흐름

```
컴포넌트 → useQuery 훅 → React Query 캐시
                               ↓
                        MSW 서비스 워커 → MOCK_* 데이터
                               ↓
                        응답이 캐시에 반영

클라이언트 액션 (장바구니 추가, 위시리스트 토글) → Jotai 아톰 (비영속적)
```

## UI 및 컬러 시스템

컬러는 Steam 브랜드 토큰에 매핑된 CSS 커스텀 프로퍼티로 정의된다. Tailwind 기본 팔레트 컬러는 사용하지 않는다.

| 토큰 | Hex | 용도 |
|---|---|---|
| `backgrounds.pageBase` | `#171a21` | 페이지 / 네비게이션 배경 |
| `backgrounds.contentDark` | `#1b2838` | 콘텐츠 패널 |
| `backgrounds.cardBase` | `#16202d` | 게임 카드 |
| `backgrounds.sidebarPanel` | `#2a475e` | 사이드바 / 보조 패널 |
| `brand.steamBlue` | `#1a9fff` | 인터랙티브 액센트 |
| `brand.accentLight` | `#66c0f4` | 링크, 하이라이트 |
| `text.primary` | `#c7d5e0` | 본문 텍스트 |
| `text.secondary` | `#8f98a0` | 메타데이터, 부가 레이블 |
| `price.discountBadgeBg` | `#4c6b22` | 할인 뱃지 배경 |
| `price.discountBadgeText` | `#a4d007` | 할인율 텍스트 |
| `price.salePrice` | `#acdbf5` | 최종 / 할인 가격 |

**기본 폰트:** Motiva Sans (대체: `Arial, Helvetica, sans-serif`)

## 공유 패키지

### `@steam-clone/types`
핵심 도메인 인터페이스: `Game`, `Price`, `Rating`, `Platforms`, `Category`, `Genre`, `Tag`, `User`, `CartItem`, `Cart`, `Review`, `NavItem`

### `@steam-clone/api`
`createApiClient(config)` 팩토리 — `games`, `reviews`, `users` 네임스페이스로 구성된 타입 안전 `ApiClient` 반환

### `@steam-clone/ui`
웹과 데스크탑이 공유하는 재사용 React 컴포넌트:
- **Button** — primary / secondary / ghost 변형; sm / md / lg 크기
- **GameCard** — 헤더 이미지, 제목, 가격 표시, 키보드 접근성 지원
- **PriceDisplay** — 할인 뱃지, 취소선 원가, 할인가; sm / md / lg 크기
- **RatingBadge** — 평점 감성별 색상 코딩 (긍정 → 초록, 혼재 → 황색, 부정 → 빨강)
- **PlatformIcons** — Windows / Mac / Linux 지원 뱃지

## 개발

```bash
pnpm dev                               # 웹 + 데스크탑 전체 실행
pnpm --filter @steam-clone/web dev     # 웹만 실행 (localhost:3000)
pnpm --filter @steam-clone/desktop dev # 데스크탑만 실행
pnpm build                             # 전체 빌드
pnpm type-check                        # 전체 TypeScript 검사
pnpm lint                              # 전체 ESLint
```

---

# Steam Store Clone

A pixel-faithful clone of the [Steam](https://store.steampowered.com/) storefront — web + desktop.

A monorepo-based full-stack clone replicating the Steam store UI. A Next.js web app and an Electron desktop app share common packages for types, API, and UI components. Core features include game browsing, reviews, cart and wishlist management, and search. All data is simulated via MSW (Mock Service Worker) running as a browser service worker — there is no real backend or Steam API connection.

## Monorepo Structure

**Tooling:** pnpm workspaces + Turborepo

```
steam-clone/
├── apps/
│   ├── web/        # Next.js 15 + React 19 — storefront website (port :3000)
│   └── desktop/    # Electron 35 + React 19 + Vite 5 — desktop client
├── packages/
│   ├── ui/         # Shared React components (GameCard, PriceDisplay, RatingBadge, etc.)
│   ├── types/      # Shared TypeScript types (Game, User, Cart, Review, etc.)
│   └── api/        # Shared API client factory (createApiClient)
```

All packages export TypeScript source directly — Next.js and Vite compile them at build time with no separate package build step.

## Key Modules

- **Next.js 15** (App Router, web framework)
- **Electron 35** + **electron-vite 2** (desktop shell)
- **React 19** (both apps)
- **TypeScript 5** (type safety across all packages)
- **Tailwind CSS 3** (styling — Steam brand color tokens via CSS custom properties)
- **shadcn/ui** (Radix UI primitives — installed per-app, themed to Steam)
- **MSW 2** (browser service worker mock API backend)
- **TanStack React Query 5** (server state management — `staleTime: 60_000`)
- **Jotai 2** (client-only state — cart, wishlist, UI, user session)
- **Embla Carousel 8** (hero carousel and featured rows)
- **wouter 3** (lightweight router for desktop SPA)
- **react-resizable-panels** (desktop panel layout)
- **Lucide React** (icons)

## Web App Pages

| Route | Description |
|---|---|
| `/` | Home — hero carousel, featured games, special offers, top sellers, Steam Deck section |
| `/app/[id]/[slug]` | Game detail — screenshots, description, reviews, ratings, pricing |
| `/cart` | Shopping cart — item list, order summary, recommendations |
| `/search` | Search results — query-based filtering |
| `/login` | Sign in — form with blurred game grid background, QR code stub, create account flow |
| `/specials` | All special offers |
| `/specials/[slug]` | Dynamic special offer landing pages |
| `/explore/new` | New & trending games with sorting |
| `/explore/upcoming` | Upcoming releases |
| `/genre/[name]` | Games filtered by genre |
| `/ways-to-play/[slug]` | Dynamic ways-to-play pages |
| `/about` | About Steam — alternating feature sections, features grid |
| `/community` | Community overview |
| `/support` | Support overview |
| `/hardware` | Steam hardware showcase |
| `/points/shop` | Points shop stub |

## Desktop App Views

The desktop app is a single-page SPA with sidebar tab navigation and resizable panels.

| View | Description |
|---|---|
| **Store** | Game browsing and purchasing |
| **Library** | User's owned game library |
| **Community** | Community features |
| **Profile** | User profile and stats |
| **Downloads** | Active and queued downloads |
| **Settings** | App preferences |
| **Game Launch Screen** | In-progress game launch UI |

**Layout:**
```
[ TitleBar — window controls, search ]
[ Sidebar nav ] [ Content area — active view ]
```

## Data & State

### Mock Data (MSW)

22 mock games across genres including Counter-Strike 2, Dota 2, Cyberpunk 2077, Baldur's Gate 3, Elden Ring, Stardew Valley, Civilization VII, and more. Each game carries full metadata: pricing with discounts, ratings, screenshots, platform flags, categories, genres, and tags.

Reviews are keyed per game. A mock user account ships with a library of 5 games, a wishlist, and wallet balance.

**API handlers intercept:**
- `GET /api/games/featured`
- `GET /api/games?genre=…`
- `GET /api/games/search?q=…`
- `GET /api/games/:id`
- `GET /api/games/:gameId/reviews`
- `GET /api/users/me`
- `POST /api/users/me/wishlist`

### Client State (Jotai Atoms)

| Atom | State |
|---|---|
| `cartItemsAtom` | Items currently in cart |
| `cartCountAtom` / `cartTotalAtom` | Derived cart count and total |
| `wishlistAtom` | Array of wishlisted game IDs |
| `currentUserAtom` / `isSignedInAtom` | Session user and sign-in status |
| `searchQueryAtom` | Current search input |
| `mobileNavOpenAtom` | Mobile drawer open/closed |
| `activeVideoAtom` | Active media index on game detail |

### Data Flow

```
Component → useQuery hook → React Query cache
                                  ↓
                           MSW service worker → MOCK_* data
                                  ↓
                           Response hydrates cache

Client actions (add to cart, wishlist toggle) → Jotai atoms (no persistence)
```

## UI & Color System

Colors are defined as CSS custom properties mapped to Steam brand tokens. No default Tailwind palette colors are used.

| Token | Hex | Usage |
|---|---|---|
| `backgrounds.pageBase` | `#171a21` | Page / nav background |
| `backgrounds.contentDark` | `#1b2838` | Content panels |
| `backgrounds.cardBase` | `#16202d` | Game cards |
| `backgrounds.sidebarPanel` | `#2a475e` | Sidebar / secondary panels |
| `brand.steamBlue` | `#1a9fff` | Interactive accent |
| `brand.accentLight` | `#66c0f4` | Links, highlights |
| `text.primary` | `#c7d5e0` | Body text |
| `text.secondary` | `#8f98a0` | Metadata, dimmed labels |
| `price.discountBadgeBg` | `#4c6b22` | Discount badge background |
| `price.discountBadgeText` | `#a4d007` | Discount percentage |
| `price.salePrice` | `#acdbf5` | Final / sale price |

**Primary font:** Motiva Sans (fallback: `Arial, Helvetica, sans-serif`)

## Shared Packages

### `@steam-clone/types`
Core domain interfaces: `Game`, `Price`, `Rating`, `Platforms`, `Category`, `Genre`, `Tag`, `User`, `CartItem`, `Cart`, `Review`, `NavItem`

### `@steam-clone/api`
`createApiClient(config)` factory returning a typed `ApiClient` with namespaced methods for `games`, `reviews`, and `users`.

### `@steam-clone/ui`
Reusable React components shared between web and desktop:
- **Button** — primary / secondary / ghost variants; sm / md / lg sizes
- **GameCard** — header image, title, price display, keyboard-accessible click handler
- **PriceDisplay** — discount badge, strikethrough original price, sale price; sm / md / lg sizes
- **RatingBadge** — color-coded by sentiment (positive → green, mixed → amber, negative → red)
- **PlatformIcons** — Windows / Mac / Linux support badges

## Development

```bash
pnpm dev                               # Start web + desktop
pnpm --filter @steam-clone/web dev     # Web only (localhost:3000)
pnpm --filter @steam-clone/desktop dev # Desktop only
pnpm build                             # Build all
pnpm type-check                        # TypeScript check all
pnpm lint                              # ESLint all
```

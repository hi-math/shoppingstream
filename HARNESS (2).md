# 🎁 Sincerity-Temperature Gift Stream App — Build Harness
## v0.2 — 2026-05-27 업데이트

---

## 1. 파일/폴더 구조

```
gift-stream-app/
├── HARNESS.md
│
├── /data
│   └── gift_dataset.js            ← 30개 상품 벡터 데이터 (내부 전용, UI 미노출)
│
├── /components
│   ├── StreamCard.jsx             ← 개별 숏폼 카드 (이미지/영상 + 상품 오버레이)
│   ├── SwipeEngine.jsx            ← 4방향 스와이프 제스처 핸들러
│   ├── TemperatureGauge.jsx       ← 성의 온도 게이지 (스트림 내부 전용, 숫자 미표시)
│   ├── ContextTagBar.jsx          ← 활성 맥락 태그 표시 (#생일 등)
│   ├── LongPressCard.jsx          ← 꾹 누르기 시 상품 정보 카드 노출
│   └── BottomNavBar.jsx           ← 하단 5탭 네비게이션 바
│
├── /screens
│   ├── HomeScreen.jsx             ← 홈: 프로모션 배너 + 신상품 + 태그 피드
│   ├── StreamScreen.jsx           ← 스트림: 핵심 스와이프 추천 피드 (실제 로직)
│   ├── CategoryScreen.jsx         ← 카테고리: 목업 그리드
│   ├── BrandScreen.jsx            ← 브랜드: 목업 리스트
│   └── MyScreen.jsx               ← MY: 개인정보·찜·장바구니·결제수단 메뉴
│
├── /engine                        ← UI 레이어에 절대 노출하지 않는 내부 연산
│   ├── vectorMath.js              ← 벡터 유틸 (코사인 유사도, 유클리드 거리)
│   ├── momentumEngine.js          ← GD 모멘텀 상태머신 (V, γ, η, ∇L)
│   └── feedRanker.js             ← U 벡터 기반 피드 정렬
│
├── /hooks
│   ├── useSwipeGesture.js
│   ├── useMomentum.js
│   └── useLongPress.js
│
└── App.jsx
```

---

## 2. 5탭 네비게이션 구조

| 탭 | 아이콘 | 화면 | 구현 수준 |
|----|--------|------|-----------|
| 홈 | ti-home | HomeScreen | 목업 |
| 스트림 | ti-player-play | StreamScreen | **실제 로직** |
| 카테고리 | ti-layout-grid | CategoryScreen | 목업 |
| 브랜드 | ti-bookmark | BrandScreen | 목업 |
| MY | ti-user | MyScreen | 목업 |

---

## 3. 화면별 구현 명세

### 3.1 HomeScreen (목업)
- 기간한정 프로모션 배너 카드 (상단 고정)
- 인기 맥락 태그 필 (#생일 #집들이 #야근 등)
- 신상품 가로 스크롤 카드
- 오늘의 추천 가로 스크롤 카드

### 3.2 StreamScreen (실제 로직)
- 전체화면 숏폼 카드 스택
- 4방향 스와이프 제스처 (터치 + 버튼 UI 병행)
- 맥락 태그 표시바 (좌상단)
- 성의 온도 게이지 (우측 세로, 시각적 표현만 — 수치·좌표 미노출)
- Feedback 오버레이 (LIKE / NOPE / UP / DOWN 애니메이션)
- LongPress 정보 카드 (가격, 태그, 빠른 저장)

### 3.3 CategoryScreen (목업)
카테고리 그리드 (2열):
기프티콘 / 플라워 / 식품·음료 / 뷰티·케어 / 리빙·인테리어 / 패션·잡화

### 3.4 BrandScreen (목업)
브랜드 리스트:
스타벅스 / 아솝 / 샤넬 / 록시땅 / 정관장 / 닌텐도 등

### 3.5 MyScreen (목업)
```
프로필 섹션
  └─ 아바타 + 이름 + 이메일

계정 관리
  ├─ 개인정보 관리      →
  └─ 알림 설정          →

쇼핑 활동
  ├─ 좋아요 누른 선물   → [N개]
  ├─ 장바구니           → [N개]
  └─ 주문 내역          →

결제
  ├─ 결제수단 관리      →
  └─ 쿠폰·포인트        →
```

**벡터 좌표, 성의 온도 수치는 MY 화면에 절대 노출하지 않는다.**

---

## 4. 핵심 데이터 스키마 (내부 전용)

### 4.1 상품 벡터 (`gift_dataset.js`) — UI 미노출
```js
{
  id: "01",
  name: "스타벅스 아이스 아메리카노 쿠폰",
  vector: { F: 0.1, W: 0.1, D: 0.0, E: 0.2 },
  tags: ["#일상감사", "#야근"],
  price: 6000,
  type: "gifticon",
  thumbnail: "/assets/thumbnails/01.jpg"
}
```

### 4.2 유저 상태 벡터 (`useMomentum.js`) — 내부 연산 전용
```js
{
  U: { F: 0.5, W: 0.5, D: 0.5, E: 0.5 },
  V: { F: 0.0, W: 0.0, D: 0.0, E: 0.0 },
  activeTag: "#생일",
  gamma: 0.85,
  eta: 0.1
}
```

---

## 5. 스와이프 → 피드백 매핑

| 제스처 | 방향 | Feedback Score | 벡터 동작 |
|--------|------|---------------|-----------|
| Swipe Right | → | +1.0 | 상품 벡터 방향으로 U 가속 |
| Swipe Left  | ← | -1.0 | 상품 벡터 반대 방향 Hard-cap |
| Swipe Up    | ↑ | +0.5 (E·F 축) | E·F 상향 → 프리미엄 이동 |
| Swipe Down  | ↓ | -0.5 (E·F 축) | E·F 하향 → 기프티콘 이동 |
| Long Press  | — | 0 (중립) | 정보 카드 노출, 벡터 불변 |

---

## 6. 모멘텀 엔진 수식

```js
function update(U, V, I_t, feedbackScore, gamma = 0.85, eta = 0.1) {
  const grad = vecScale(vecSub(I_t, U), feedbackScore);
  const V_next = vecAdd(vecScale(V, gamma), vecScale(grad, eta));
  const U_next = vecClamp(vecAdd(U, V_next), 0, 1);
  return { U: U_next, V: V_next };
}
```

---

## 7. Cold Start 초기 벡터 (내부 전용)

```js
const coldStart = {
  male:     { F: 0.3, W: 0.3, D: 0.2, E: 0.2 },
  female:   { F: 0.4, W: 0.4, D: 0.3, E: 0.4 },
  teen:     { F: 0.2, W: 0.4, D: 0.6, E: 0.7 },
  thirties: { F: 0.5, W: 0.5, D: 0.6, E: 0.3 },
  fifties:  { F: 0.7, W: 0.6, D: 0.5, E: 0.4 }
}
```

---

## 8. UI 노출 원칙

| 요소 | 노출 여부 | 비고 |
|------|-----------|------|
| 상품명 / 가격 / 태그 | ✅ 노출 | StreamCard, LongPressCard |
| 맥락 태그 (#생일 등) | ✅ 노출 | ContextTagBar |
| 성의 온도 게이지 (시각) | ✅ 노출 | 막대 형태만, 수치 없음 |
| 4차원 벡터 좌표 수치 | ❌ 미노출 | 내부 엔진 전용 |
| 유저 U 벡터 값 | ❌ 미노출 | MY 화면 포함 전 화면 |
| Feedback Score | ❌ 미노출 | 엔진 내부 변수 |

---

## 9. 에셋 폴더

```
/assets
├── /thumbnails    ← 01.jpg ~ 30.jpg
├── /videos        ← (선택) 숏폼 루프 .mp4
└── /icons         ← 태그 아이콘, 스와이프 가이드 SVG
```

---

## 10. 빌드 로드맵

```
Phase 1 — Core Loop
  gift_dataset.js → vectorMath + momentumEngine → feedRanker → StreamCard + SwipeEngine

Phase 2 — UX Polish
  TemperatureGauge (시각) → LongPressCard → BottomNavBar + 화면 전환

Phase 3 — Personalization
  ProfileScreen Cold Start → ContextSetScreen 태그 선택 → SavedScreen 장바구니

Phase 4 — Mock Completion
  HomeScreen 배너/신상품 → CategoryScreen → BrandScreen → MyScreen 메뉴 연결
```

---

## 11. 현재 구현 상태 (v0.2 기준)

| 화면 | 상태 |
|------|------|
| HomeScreen | 목업 완성 |
| StreamScreen | Phase 1 완성 (8개 샘플, 모멘텀 엔진 연동) |
| CategoryScreen | 목업 완성 |
| BrandScreen | 목업 완성 |
| MyScreen | 목업 완성 (개인정보·찜·장바구니·결제수단) |
| LongPressCard | 미구현 |
| feedRanker (30개 전체) | 미구현 |
| Cold Start UI | 미구현 |

---

*벡터 좌표 및 성의 온도 수치는 어떤 UI 화면에도 절대 노출하지 않는다.*

# Softsoul API 통합 가이드

## 🎯 개요

Notion 기반 물류/쇼핑몰 관리 시스템의 모든 API를 제공합니다. 모든 API는 동일한 패턴으로 작동하며, **간편 모드**와 **전문 모드**를 모두 지원합니다.

---

## 📚 전체 API 목록

| # | API | 엔드포인트 | 설명 | 문서 |
|---|-----|-----------|------|------|
| 1️⃣ | Products | `/api/products` | 상품 데이터 관리 | [PRODUCTS_API.md](./PRODUCTS_API.md) |
| 2️⃣ | Shipping | `/api/shipping` | 배송 데이터 관리 | [SHIPPING_API.md](./SHIPPING_API.md) |
| 3️⃣ | Fund | `/api/fund` | 입금 데이터 관리 | [FUND_API.md](./FUND_API.md) |
| 4️⃣ | Customers | `/api/customers` | 구매자 데이터 관리 | [CUSTOMERS_API.md](./CUSTOMERS_API.md) |
| 5️⃣ | Vendors | `/api/vendors` | 구매처 데이터 관리 | [VENDORS_API.md](./VENDORS_API.md) |
| 6️⃣ | Warehouses | `/api/warehouses` | 배송처 데이터 관리 | [WAREHOUSES_API.md](./WAREHOUSES_API.md) |
| 7️⃣ | Exchange | `/api/exchange` | 환율 데이터 관리 | [EXCHANGE_API.md](./EXCHANGE_API.md) |
| 8️⃣ | Transactions | `/api/transactions` | 입출금계좌 관리 | [TRANSACTIONS_API.md](./TRANSACTIONS_API.md) |
| 9️⃣ | Myanmar Delivery | `/api/myanmar-delivery` | 미얀마배송 관리 | [MYANMAR_DELIVERY_API.md](./MYANMAR_DELIVERY_API.md) |
| 🔟 | Levels | `/api/levels` | 주문 상태 관리 | [LEVELS_API.md](./LEVELS_API.md) |
| 1️⃣1️⃣ | External IDs | `/api/external-ids` | 외부ID 관리 | [EXTERNAL_IDS_API.md](./EXTERNAL_IDS_API.md) |

---

## 🔧 공통 API 패턴

모든 API는 다음 엔드포인트를 제공합니다:

### 기본 CRUD

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/{api}/list` | 전체 목록 조회 |
| POST | `/{api}/get` | 특정 항목 조회 |
| POST | `/{api}` | 새 항목 추가 |
| PATCH | `/{api}/:pageId` | 항목 업데이트 |
| DELETE | `/{api}/:pageId` | 항목 삭제 (아카이브) |

### Properties 전용

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/{api}/:pageId/properties` | 모든 properties 조회 |
| GET | `/{api}/:pageId/properties/:propertyName` | 특정 property 조회 |
| PATCH | `/{api}/:pageId/properties` | 여러 properties 업데이트 |
| PATCH | `/{api}/:pageId/properties/:propertyName` | 단일 property 업데이트 |

---

## 🚀 빠른 시작

### 1. 간편 모드로 데이터 조회

```javascript
// 상품 목록 조회 (간편 형식)
const response = await fetch('http://localhost:3001/api/products/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    simplified: true,
    filter: {},
    sorts: []
  })
});

const data = await response.json();
// properties가 간단한 객체 형태로 반환됩니다
```

### 2. 특정 필드만 조회

```javascript
// 상품명만 조회
const response = await fetch(
  'http://localhost:3001/api/products/페이지ID/properties/상품명?simplified=true'
);

const data = await response.json();
console.log(data.data.value); // "상품명"
```

### 3. 간편하게 필드 업데이트

```javascript
// 여러 필드 한번에 업데이트
const response = await fetch(
  'http://localhost:3001/api/products/페이지ID/properties',
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      updates: {
        "상품명": { type: "rich_text", value: "새 상품명" },
        "상품금액": { type: "number", value: 10000 },
        "개수": { type: "number", value: 5 }
      }
    })
  }
);
```

---

## 💡 주요 기능

### 1. Simplified 모드

복잡한 Notion API 응답 형식 대신 값만 추출:

**기존 (복잡):**
```json
{
  "상품명": {
    "id": "...",
    "type": "rich_text",
    "rich_text": [
      {
        "type": "text",
        "text": { "content": "상품명" },
        "plain_text": "상품명"
      }
    ]
  }
}
```

**Simplified (간단):**
```json
{
  "상품명": "상품명"
}
```

### 2. 간편 업데이트

타입과 값만 지정하면 자동으로 Notion 형식으로 변환:

```javascript
// 이것만 보내면...
{
  "type": "rich_text",
  "value": "새 값"
}

// 자동으로 이렇게 변환됩니다
{
  "rich_text": [{ "text": { "content": "새 값" } }]
}
```

### 3. 세분화된 제어

- 전체 데이터 조회/수정
- 특정 필드만 조회/수정
- 단일/다중 필드 업데이트

---

## 🗂️ 데이터 구조

### Unique ID 접두사

각 데이터베이스는 고유한 ID 접두사를 사용합니다:

| 접두사 | 데이터베이스 |
|--------|-------------|
| PD | Products (상품) |
| SD | Shipping (배송) |
| FD | Fund (입금) |
| CD | Customers (구매자) |
| VD | Vendors (구매처) |
| WD | Warehouses (배송처) |
| ED | Exchange (환율) |
| TD | Transactions (계좌) |
| MD | Myanmar Delivery (미얀마배송) |
| LD | Levels (상태) |

### 데이터 관계

```
구매자 (Customers)
  ├─ 상품 (Products)
  ├─ 입금 (Fund)
  ├─ 배송 (Shipping)
  └─ 미얀마배송 (Myanmar Delivery)

상품 (Products)
  ├─ 구매처 (Vendors)
  ├─ 배송 (Shipping)
  └─ 상태 (Levels)

입금 (Fund)
  ├─ 환율 (Exchange)
  └─ 계좌 (Transactions)

배송 (Shipping)
  ├─ 배송처 (Warehouses)
  └─ 미얀마배송 (Myanmar Delivery)
```

---

## 📊 지원하는 Property 타입

### 쓰기 가능한 타입
- `title` - 제목
- `rich_text` - 텍스트
- `number` - 숫자
- `select` - 단일 선택
- `multi_select` - 다중 선택
- `date` - 날짜
- `checkbox` - 체크박스
- `url` - URL
- `email` - 이메일
- `phone_number` - 전화번호
- `relation` - 관계

### 읽기 전용 타입
- `formula` - 수식 (자동 계산)
- `rollup` - 롤업 (자동 집계)
- `created_time` - 생성 시간
- `created_by` - 생성자
- `last_edited_time` - 최종 수정 시간
- `last_edited_by` - 최종 수정자
- `unique_id` - 고유 ID

---

## 🎨 필터 및 정렬 예제

### 필터 예제

```javascript
// 숫자 필터
{
  property: "상품금액",
  number: {
    greater_than: 5000
  }
}

// 텍스트 필터
{
  property: "상품명",
  rich_text: {
    contains: "화장품"
  }
}

// 날짜 필터
{
  property: "장바구니날짜",
  date: {
    on_or_after: "2025-03-01"
  }
}

// 복합 필터
{
  and: [
    { property: "상품금액", number: { greater_than: 5000 } },
    { property: "개수", number: { greater_than: 0 } }
  ]
}
```

### 정렬 예제

```javascript
sorts: [
  {
    property: "장바구니날짜",
    direction: "descending"  // 또는 "ascending"
  }
]
```

---

## 🔐 환경 설정

`.env` 파일에 다음 항목을 설정하세요:

```env
NOTION_API_KEY=your_notion_api_key
PORT=3001

# 데이터베이스 ID
PRODUCT_DATABASE_ID=...
SHIPPING_DATABASE_ID=...
FUND_DATABASE_ID=...
CUSTOMER_DATABASE_ID=...
VENDOR_DATABASE_ID=...
WAREHOUSE_DATABASE_ID=...
EXCHANGE_DATABASE_ID=...
TRANSACTION_DATABASE_ID=...
MYANMAR_DELIVERY_DATABASE_ID=...
LEVEL_DATABASE_ID=...
EXTERNAL_ID_DATABASE_ID=...
```

자세한 내용은 [SETUP_ENV.md](./SETUP_ENV.md)를 참조하세요.

---

## 🛠️ 개발 도구

### 서버 실행

```bash
npm start
```

### API 테스트

```bash
# 상품 목록 조회
curl -X POST http://localhost:3001/api/products/list \
  -H "Content-Type: application/json" \
  -d '{"simplified": true}'

# 특정 상품 조회
curl http://localhost:3001/api/products/페이지ID/properties?simplified=true
```

---

## 📖 추가 문서

- 각 API별 상세 가이드는 위의 문서 링크를 참조하세요.
- 각 문서에는 10개 이상의 실제 사용 예제가 포함되어 있습니다.

---

## 🎊 전체 시스템 구조

```
Softsoul API
├── 상품 관리
│   └── Products API
├── 구매 관리
│   ├── Customers API (구매자)
│   ├── Vendors API (구매처)
│   └── Fund API (입금)
├── 배송 관리
│   ├── Shipping API (국내배송)
│   ├── Warehouses API (배송처)
│   └── Myanmar Delivery API (미얀마배송)
├── 재무 관리
│   ├── Exchange API (환율)
│   └── Transactions API (계좌)
├── 상태 관리
│   └── Levels API (주문 상태)
└── 시스템 연동
    └── External IDs API (외부ID)
```

---

## ⚡ 빠른 참조

### 모든 API의 공통 사용법

```javascript
// 1. 목록 조회 (간편)
const list = await fetch('/api/{endpoint}/list', {
  method: 'POST',
  body: JSON.stringify({ simplified: true })
});

// 2. 단일 조회 (간편)
const item = await fetch('/api/{endpoint}/get', {
  method: 'POST',
  body: JSON.stringify({ 
    pageId: "페이지ID",
    simplified: true 
  })
});

// 3. 모든 properties 조회
const props = await fetch(
  '/api/{endpoint}/페이지ID/properties?simplified=true'
);

// 4. 특정 property 조회
const prop = await fetch(
  '/api/{endpoint}/페이지ID/properties/필드명?simplified=true'
);

// 5. 간편 업데이트
const update = await fetch('/api/{endpoint}/페이지ID/properties', {
  method: 'PATCH',
  body: JSON.stringify({
    updates: {
      "필드명": { type: "타입", value: "값" }
    }
  })
});
```

---

## 🌟 특별 기능

### Customers API
- 스키마 검증 기능 포함
- `POST /api/customers/schema` - 스키마 분석
- `POST /api/customers/crud-schema` - CRUD 스키마 생성

### Levels API
- 주문 처리 워크플로우 관리
- 상태별 상품 개수 자동 집계

### Transactions API
- 입출금 자동 집계
- 평균 환율 자동 계산
- 실시간 잔액 확인

---

## 📞 문의

프로젝트 관련 문의사항은 README.md를 참조하세요.

---

**🎉 모든 API가 동일한 패턴으로 작동하므로, 하나를 배우면 모두 사용할 수 있습니다!**


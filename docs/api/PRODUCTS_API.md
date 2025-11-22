# Products API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 상품 조회
```http
POST /api/products/list
```

**요청 Body:**
```json
{
  "filter": {},
  "sorts": [],
  "simplified": true  // properties를 간단한 형태로 반환 (선택)
}
```

**응답 예제 (simplified: false - 기본):**
```json
{
  "success": true,
  "data": [
    {
      "id": "201053df-aa4c-8190-a5a7-ccd209c1a056",
      "properties": {
        "상품명": {
          "id": "\\ChQ:",
          "type": "rich_text",
          "rich_text": [
            {
              "type": "text",
              "text": { "content": "이것은 설명입니다." },
              "plain_text": "이것은 설명입니다."
            }
          ]
        },
        "개수": {
          "id": "HdML",
          "type": "number",
          "number": null
        }
      }
    }
  ]
}
```

**응답 예제 (simplified: true):**
```json
{
  "success": true,
  "data": [
    {
      "id": "201053df-aa4c-8190-a5a7-ccd209c1a056",
      "properties": {
        "상품명": "이것은 설명입니다.",
        "개수": null,
        "상품금액": 6001,
        "배송비": 2500
      }
    }
  ]
}
```

### 2. 특정 상품 조회
```http
POST /api/products/get
```

**요청 Body:**
```json
{
  "pageId": "201053df-aa4c-8190-a5a7-ccd209c1a056",
  "simplified": true  // 선택
}
```

### 3. 상품 추가
```http
POST /api/products
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "상품명": {
      "rich_text": [{ "text": { "content": "새로운 상품" } }]
    },
    "상품금액": {
      "number": 10000
    },
    "개수": {
      "number": 5
    }
  }
}
```

### 4. 상품 업데이트
```http
PATCH /api/products/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "상품명": {
      "rich_text": [{ "text": { "content": "수정된 상품명" } }]
    },
    "상품금액": {
      "number": 15000
    }
  }
}
```

### 5. 상품 삭제 (아카이브)
```http
DELETE /api/products/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/products/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "상품명": "화장품, 연예인굿즈",
    "상품금액": 6001,
    "개수": 1,
    "배송비": 2500,
    "대행수수료": 6,
    "쿠폰할인": 1500,
    "사용포인트": 4500,
    "장바구니날짜": {
      "start": "2025-03-10",
      "end": null
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/products/:pageId/properties/상품명?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "상품명",
    "type": "rich_text",
    "value": "화장품, 연예인굿즈"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/products/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "상품명": {
      "type": "rich_text",
      "value": "새 상품명"
    },
    "상품금액": {
      "type": "number",
      "value": 20000
    },
    "개수": {
      "type": "number",
      "value": 10
    },
    "장바구니날짜": {
      "type": "date",
      "value": "2025-03-15"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/products/:pageId/properties/상품명
```

**요청 Body:**
```json
{
  "type": "rich_text",
  "value": "업데이트된 상품명"
}
```

---

## 사용 예제

### 예제 1: 상품 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/products/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "상품금액",
      number: {
        greater_than: 5000
      }
    },
    sorts: [
      {
        property: "장바구니날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 상품의 정보만 조회

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "상품명": "화장품, 연예인굿즈",
//   "상품금액": 6001,
//   ...
// }
```

### 예제 3: 상품명만 조회

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties/상품명?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // "화장품, 연예인굿즈"
```

### 예제 4: 여러 필드 한번에 업데이트 (간편 방식)

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "상품명": {
          type: "rich_text",
          value: "수정된 상품명"
        },
        "상품금액": {
          type: "number",
          value: 25000
        },
        "개수": {
          type: "number",
          value: 3
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 단일 필드만 업데이트

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties/상품금액`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 30000
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 날짜 필드 업데이트

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties/장바구니날짜`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "date",
      value: "2025-03-20"  // 또는 { start: "2025-03-20", end: "2025-03-25" }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 관계(Relation) 필드 업데이트

```javascript
const pageId = '201053df-aa4c-8190-a5a7-ccd209c1a056';

const response = await fetch(
  `http://localhost:3001/api/products/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "test_구매자데이터": {
          type: "relation",
          value: ["a446c74a-20ff-4382-8d40-83fe3b5f7fb5"]  // 관련 페이지 ID 배열
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

---

## 📌 지원하는 Property 타입

### 읽기/쓰기 가능한 타입
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
- `formula` - 수식
- `rollup` - 롤업
- `created_time` - 생성 시간
- `created_by` - 생성자
- `last_edited_time` - 최종 수정 시간
- `last_edited_by` - 최종 수정자
- `unique_id` - 고유 ID

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **Notion 원본 형식**: 복잡한 업데이트가 필요한 경우 기본 `PATCH /api/products/:pageId` 엔드포인트에서 Notion 원본 형식을 사용하세요.

4. **에러 처리**: 모든 API는 `{ success: boolean, data?: any, error?: string }` 형식으로 응답합니다.


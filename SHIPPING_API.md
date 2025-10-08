# Shipping API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 배송 조회
```http
POST /api/shipping/list
```

**요청 Body:**
```json
{
  "filter": {},
  "sorts": [],
  "simplified": true  // properties를 간단한 형태로 반환 (선택)
}
```

**응답 예제 (simplified: true):**
```json
{
  "success": true,
  "data": [
    {
      "id": "93da1f14-8925-439c-9455-86c2d77abf04",
      "properties": {
        "Batch.No": "3414k",
        "SeaAir": "see",
        "실택배비": 2500,
        "요청택배비": 5000,
        "실포장비": 2300,
        "요청포장비": 5000,
        "실중량kg": 6.7,
        "CargoRatio": 12000,
        "국내택배발송날짜": {
          "start": "2025-03-21",
          "end": null
        },
        "Cargo영수증날짜": {
          "start": "2025-03-26",
          "end": null
        }
      }
    }
  ]
}
```

### 2. 특정 배송 조회
```http
POST /api/shipping/get
```

**요청 Body:**
```json
{
  "pageId": "93da1f14-8925-439c-9455-86c2d77abf04",
  "simplified": true  // 선택
}
```

### 3. 배송 추가
```http
POST /api/shipping
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "실택배비": {
      "number": 3000
    },
    "실포장비": {
      "number": 2500
    },
    "실중량kg": {
      "number": 7.5
    },
    "SeaAir": {
      "select": { "name": "see" }
    }
  }
}
```

### 4. 배송 업데이트
```http
PATCH /api/shipping/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "실택배비": {
      "number": 3500
    },
    "실중량kg": {
      "number": 8.0
    }
  }
}
```

### 5. 배송 삭제 (아카이브)
```http
DELETE /api/shipping/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/shipping/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "Batch.No": "3414k",
    "SeaAir": "see",
    "실택배비": 2500,
    "요청택배비": 5000,
    "실포장비": 2300,
    "요청포장비": 5000,
    "실중량kg": 6.7,
    "CargoRatio": 12000,
    "국내택배발송날짜": {
      "start": "2025-03-21",
      "end": null,
      "time_zone": null
    },
    "Cargo영수증날짜": {
      "start": "2025-03-26",
      "end": null,
      "time_zone": null
    },
    "국내택배발송사진link": "https://imgur.com/...",
    "Cargo영수증사진link": "https://imgur.com/..."
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/shipping/:pageId/properties/실택배비?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "실택배비",
    "type": "number",
    "value": 2500
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/shipping/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "실택배비": {
      "type": "number",
      "value": 3000
    },
    "실포장비": {
      "type": "number",
      "value": 2500
    },
    "실중량kg": {
      "type": "number",
      "value": 8.5
    },
    "국내택배발송날짜": {
      "type": "date",
      "value": "2025-03-25"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/shipping/:pageId/properties/실택배비
```

**요청 Body:**
```json
{
  "type": "number",
  "value": 3500
}
```

---

## 사용 예제

### 예제 1: 배송 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/shipping/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "실중량kg",
      number: {
        greater_than: 5
      }
    },
    sorts: [
      {
        property: "국내택배발송날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 배송의 모든 정보 조회

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "Batch.No": "3414k",
//   "SeaAir": "see",
//   "실택배비": 2500,
//   ...
// }
```

### 예제 3: 실택배비만 조회

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties/실택배비?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // 2500
```

### 예제 4: 배송비 정보 일괄 업데이트

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "실택배비": {
          type: "number",
          value: 3000
        },
        "실포장비": {
          type: "number",
          value: 2800
        },
        "실중량kg": {
          type: "number",
          value: 7.2
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
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties/실중량kg`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 8.5
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 배송 방식(Select) 업데이트

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties/SeaAir`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "select",
      value: "air"  // 또는 "see"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 날짜 필드 업데이트

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "국내택배발송날짜": {
          type: "date",
          value: "2025-03-25"
        },
        "Cargo영수증날짜": {
          type: "date",
          value: "2025-03-28"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 8: 관계(Relation) 필드 업데이트

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "test_상품데이터": {
          type: "relation",
          value: [
            "18d7142e-7997-44eb-9031-0fe4d2924777",
            "1b4053df-aa4c-80c1-896c-cf9c7bb9bbf5"
          ]
        },
        "test_구매자데이터": {
          type: "relation",
          value: ["a446c74a-20ff-4382-8d40-83fe3b5f7fb5"]
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 9: 이미지 링크 업데이트

```javascript
const pageId = '93da1f14-8925-439c-9455-86c2d77abf04';

const response = await fetch(
  `http://localhost:3001/api/shipping/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "국내택배발송사진link": {
          type: "rich_text",
          value: "https://example.com/shipping-image.jpg"
        },
        "Cargo영수증사진link": {
          type: "rich_text",
          value: "https://example.com/cargo-receipt.jpg"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

---

## 📌 주요 배송 데이터 필드

### 쓰기 가능한 필드
- `Batch.No` (rich_text) - 배치 번호
- `SeaAir` (select) - 배송 방식 (see/air)
- `실택배비` (number) - 실제 택배비
- `요청택배비` (number) - 요청 택배비
- `실포장비` (number) - 실제 포장비
- `요청포장비` (number) - 요청 포장비
- `실중량kg` (number) - 실제 중량
- `CargoRatio` (number) - 카고 비율
- `국내택배발송날짜` (date) - 국내 택배 발송 날짜
- `Cargo영수증날짜` (date) - 카고 영수증 날짜
- `국내택배발송사진link` (rich_text) - 국내 택배 발송 사진 링크
- `Cargo영수증사진link` (rich_text) - 카고 영수증 사진 링크
- `test_상품데이터` (relation) - 상품 데이터 관계
- `test_구매자데이터` (relation) - 구매자 데이터 관계
- `test_배송처데이터` (relation) - 배송처 데이터 관계
- `test_미얀마배송데이터` (relation) - 미얀마 배송 데이터 관계

### 읽기 전용 필드 (Rollup/Formula)
- `[상품명]` (rollup) - 관련 상품명들
- `[배송처명]` (rollup) - 배송처명
- `[구매자명]` (rollup) - 구매자명
- `한국요청배송비` (formula) - 계산된 한국 요청 배송비
- `ID` (unique_id) - 고유 ID (SD 접두사)

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **배송 방식**: `SeaAir` 필드는 "see" 또는 "air" 값을 가집니다.

4. **관계 필드**: 여러 상품을 한 배송에 연결할 때는 배열로 ID를 전달합니다.

5. **에러 처리**: 모든 API는 `{ success: boolean, data?: any, error?: string }` 형식으로 응답합니다.


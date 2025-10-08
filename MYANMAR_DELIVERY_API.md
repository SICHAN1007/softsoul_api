# Myanmar Delivery API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 미얀마배송 조회
```http
POST /api/myanmar-delivery/list
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
      "id": "41ccd18b-d947-44fd-a6d8-973bf67f09e4",
      "properties": {
        "미얀마요청배송비M": 3500,
        "미얀마실배송비M": 1200,
        "요청중량": 7,
        "현지배송영수증날짜": {
          "start": "2025-03-29",
          "end": null
        },
        "현지배송영수증사진link": "https://imgur.com/...",
        "한국총배송비k": {
          "type": "number",
          "number": 94000
        }
      }
    }
  ]
}
```

### 2. 특정 미얀마배송 조회
```http
POST /api/myanmar-delivery/get
```

**요청 Body:**
```json
{
  "pageId": "41ccd18b-d947-44fd-a6d8-973bf67f09e4",
  "simplified": true  // 선택
}
```

### 3. 미얀마배송 추가
```http
POST /api/myanmar-delivery
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "미얀마요청배송비M": {
      "number": 3500
    },
    "미얀마실배송비M": {
      "number": 1200
    },
    "요청중량": {
      "number": 7
    },
    "현지배송영수증날짜": {
      "date": { "start": "2025-03-30" }
    }
  }
}
```

### 4. 미얀마배송 업데이트
```http
PATCH /api/myanmar-delivery/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "미얀마실배송비M": {
      "number": 1500
    },
    "현지배송영수증날짜": {
      "date": { "start": "2025-03-31" }
    }
  }
}
```

### 5. 미얀마배송 삭제 (아카이브)
```http
DELETE /api/myanmar-delivery/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/myanmar-delivery/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "미얀마요청배송비M": 3500,
    "미얀마실배송비M": 1200,
    "요청중량": 7,
    "현지배송영수증날짜": {
      "start": "2025-03-29",
      "end": null,
      "time_zone": null
    },
    "현지배송영수증사진link": "https://imgur.com/...",
    "한국총배송비k": {
      "type": "number",
      "number": 94000
    },
    "[CargoRatio]k": {
      "type": "number",
      "number": 12000
    },
    "[한국요청배송비]k": {
      "type": "number",
      "number": 10000
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/myanmar-delivery/:pageId/properties/미얀마요청배송비M?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "미얀마요청배송비M",
    "type": "number",
    "value": 3500
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/myanmar-delivery/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "미얀마요청배송비M": {
      "type": "number",
      "value": 4000
    },
    "미얀마실배송비M": {
      "type": "number",
      "value": 1500
    },
    "요청중량": {
      "type": "number",
      "value": 8
    },
    "현지배송영수증날짜": {
      "type": "date",
      "value": "2025-03-30"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/myanmar-delivery/:pageId/properties/미얀마실배송비M
```

**요청 Body:**
```json
{
  "type": "number",
  "value": 1500
}
```

---

## 사용 예제

### 예제 1: 미얀마배송 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/myanmar-delivery/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "요청중량",
      number: {
        greater_than: 5
      }
    },
    sorts: [
      {
        property: "현지배송영수증날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 미얀마배송의 모든 정보 조회

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "미얀마요청배송비M": 3500,
//   "미얀마실배송비M": 1200,
//   "요청중량": 7,
//   ...
// }
```

### 예제 3: 배송비 정보만 조회

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

// 모든 속성 조회
const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties?simplified=true`
);
const allProps = await response.json();

// 필요한 정보만 추출
const deliveryInfo = {
  요청배송비_MMK: allProps.data.미얀마요청배송비M,
  실배송비_MMK: allProps.data.미얀마실배송비M,
  한국배송비_KRW: allProps.data.한국총배송비k?.number,
  중량_kg: allProps.data.요청중량
};

console.log(deliveryInfo);
// {
//   요청배송비_MMK: 3500,
//   실배송비_MMK: 1200,
//   한국배송비_KRW: 94000,
//   중량_kg: 7
// }
```

### 예제 4: 배송비 정보 일괄 업데이트

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "미얀마요청배송비M": {
          type: "number",
          value: 4000
        },
        "미얀마실배송비M": {
          type: "number",
          value: 1500
        },
        "요청중량": {
          type: "number",
          value: 8.5
        },
        "현지배송영수증날짜": {
          type: "date",
          value: "2025-03-30"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 실배송비만 업데이트

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties/미얀마실배송비M`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 1800
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 영수증 사진 링크 업데이트

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties/현지배송영수증사진link`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "rich_text",
      value: "https://example.com/delivery-receipt.jpg"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 관계 필드 업데이트 (상품/구매자/배송 연결)

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "[상품명]test_상품데이터": {
          type: "relation",
          value: [
            "18d7142e-7997-44eb-9031-0fe4d2924777",
            "1b4053df-aa4c-80c1-896c-cf9c7bb9bbf5"
          ]
        },
        "[구매자]test_구매자데이터": {
          type: "relation",
          value: ["a446c74a-20ff-4382-8d40-83fe3b5f7fb5"]
        },
        "[Batch.No]test_배송데이터": {
          type: "relation",
          value: ["93da1f14-8925-439c-9455-86c2d77abf04"]
        },
        "[입금자명]test_입금데이터": {
          type: "relation",
          value: ["96edb252-0cee-467c-868f-46658023ae7f"]
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 8: 새 미얀마배송 추가

```javascript
const response = await fetch('http://localhost:3001/api/myanmar-delivery', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PageID": {
        title: [{ text: { content: "새배송ID" } }]
      },
      "미얀마요청배송비M": {
        number: 4000
      },
      "미얀마실배송비M": {
        number: 1500
      },
      "요청중량": {
        number: 8
      },
      "현지배송영수증날짜": {
        date: { start: "2025-03-30" }
      },
      "현지배송영수증사진link": {
        rich_text: [{ text: { content: "https://example.com/receipt.jpg" } }]
      },
      "[구매자]test_구매자데이터": {
        relation: [{ id: "a446c74a-20ff-4382-8d40-83fe3b5f7fb5" }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 9: 배송비 차액 계산

```javascript
const pageId = '41ccd18b-d947-44fd-a6d8-973bf67f09e4';

const response = await fetch(
  `http://localhost:3001/api/myanmar-delivery/${pageId}/properties?simplified=true`
);

const data = await response.json();
const props = data.data;

const 미얀마배송비차액 = props.미얀마요청배송비M - props.미얀마실배송비M;
const 한국배송비 = props['[한국요청배송비]k']?.number || 0;
const 총배송비차액 = 미얀마배송비차액;

console.log('배송비 분석:');
console.log('- 미얀마 요청:', props.미얀마요청배송비M);
console.log('- 미얀마 실제:', props.미얀마실배송비M);
console.log('- 차액:', 미얀마배송비차액);
console.log('- 한국 배송비:', 한국배송비);
```

### 예제 10: 무게별 배송 목록 조회

```javascript
const response = await fetch('http://localhost:3001/api/myanmar-delivery/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      and: [
        {
          property: "요청중량",
          number: {
            greater_than_or_equal_to: 5
          }
        },
        {
          property: "요청중량",
          number: {
            less_than_or_equal_to: 10
          }
        }
      ]
    },
    sorts: [
      {
        property: "요청중량",
        direction: "ascending"
      }
    ]
  })
});

const data = await response.json();
console.log(`5~10kg 범위의 배송 ${data.count}개 찾음`);

data.data.forEach(item => {
  console.log(`- ${item.properties.요청중량}kg: ${item.properties.미얀마요청배송비M} MMK`);
});
```

---

## 📌 주요 미얀마배송 데이터 필드

### 쓰기 가능한 필드
- `미얀마요청배송비M` (number) - 미얀마 요청 배송비 (짯)
- `미얀마실배송비M` (number) - 미얀마 실제 배송비 (짯)
- `요청중량` (number) - 요청 중량 (kg)
- `현지배송영수증날짜` (date) - 현지 배송 영수증 날짜
- `현지배송영수증사진link` (rich_text) - 현지 배송 영수증 사진 링크
- `[상품명]test_상품데이터` (relation) - 상품 데이터 관계
- `[구매자]test_구매자데이터` (relation) - 구매자 데이터 관계
- `[Batch.No]test_배송데이터` (relation) - 배송 데이터 관계
- `[입금자명]test_입금데이터` (relation) - 입금 데이터 관계

### 읽기 전용 필드 (Formula/Rollup)
- `한국총배송비k` (formula) - 계산된 한국 총 배송비 (원)
- `[CargoRatio]k` (rollup) - 카고 비율
- `[한국요청배송비]k` (rollup) - 한국 요청 배송비
- `[요청총배송비]` (rollup) - 총 요청 배송비
- `배송입금확인날짜` (rollup) - 배송 입금 확인 날짜
- `[FaceBookID]` (rollup) - 구매자 페이스북 ID
- `[연락처]` (rollup) - 구매자 연락처
- `[주소]` (rollup) - 구매자 주소

### 시스템 필드
- `ID` (unique_id) - 고유 ID (MD 접두사)
- `PageID` (title) - 기본 키

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **배송비 단위**: 
   - 미얀마 배송비: `M` 접미사 (MMK, 짯)
   - 한국 배송비: `k` 접미사 (KRW, 원)

4. **중량 관리**: `요청중량` 필드로 무게별 배송비를 관리할 수 있습니다.

5. **영수증 관리**: `현지배송영수증날짜`와 `현지배송영수증사진link`로 배송 증빙을 관리합니다.

6. **자동 계산**: `한국총배송비k`는 formula 필드로 자동 계산됩니다.

7. **관계 필드**: 상품, 구매자, 배송, 입금 데이터와 연결하여 전체 프로세스를 추적할 수 있습니다.

8. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.

---

## 📊 미얀마배송 관리 시나리오

### 배송 프로세스 추적
상품 주문부터 미얀마 현지 배송까지 전체 프로세스 추적

```javascript
// 1. 미얀마배송 생성 및 관계 설정
const newDelivery = await fetch('http://localhost:3001/api/myanmar-delivery', {
  method: 'POST',
  body: JSON.stringify({
    properties: {
      PageID: { title: [{ text: { content: `delivery_${Date.now()}` } }] },
      미얀마요청배송비M: { number: 4000 },
      요청중량: { number: 7.5 },
      "[상품명]test_상품데이터": {
        relation: [{ id: "상품ID" }]
      },
      "[구매자]test_구매자데이터": {
        relation: [{ id: "구매자ID" }]
      }
    }
  })
});

// 2. 실제 배송 후 정보 업데이트
const pageId = newDelivery.data.id;
await fetch(`http://localhost:3001/api/myanmar-delivery/${pageId}/properties`, {
  method: 'PATCH',
  body: JSON.stringify({
    updates: {
      미얀마실배송비M: { type: "number", value: 1200 },
      현지배송영수증날짜: { type: "date", value: "2025-03-30" },
      현지배송영수증사진link: { type: "rich_text", value: "https://..." }
    }
  })
});
```


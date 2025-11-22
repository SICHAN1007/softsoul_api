# Exchange API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 환율 조회
```http
POST /api/exchange/list
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
      "id": "d437ac2f-8380-4452-88f6-9f11b592092f",
      "properties": {
        "마켓환율": 3.12,
        "환율날짜": {
          "start": "2025-03-11",
          "end": null,
          "time_zone": null
        },
        "적용환율": {
          "type": "number",
          "number": 3.14
        }
      }
    }
  ]
}
```

### 2. 특정 환율 조회
```http
POST /api/exchange/get
```

**요청 Body:**
```json
{
  "pageId": "d437ac2f-8380-4452-88f6-9f11b592092f",
  "simplified": true  // 선택
}
```

### 3. 환율 추가
```http
POST /api/exchange
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "마켓환율": {
      "number": 3.14
    },
    "환율날짜": {
      "date": { "start": "2025-03-15" }
    }
  }
}
```

### 4. 환율 업데이트
```http
PATCH /api/exchange/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "마켓환율": {
      "number": 3.16
    },
    "환율날짜": {
      "date": { "start": "2025-03-20" }
    }
  }
}
```

### 5. 환율 삭제 (아카이브)
```http
DELETE /api/exchange/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/exchange/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "마켓환율": 3.12,
    "환율날짜": {
      "start": "2025-03-11",
      "end": null,
      "time_zone": null
    },
    "적용환율": {
      "type": "number",
      "number": 3.14
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/exchange/:pageId/properties/마켓환율?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "마켓환율",
    "type": "number",
    "value": 3.12
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/exchange/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "마켓환율": {
      "type": "number",
      "value": 3.16
    },
    "환율날짜": {
      "type": "date",
      "value": "2025-03-25"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/exchange/:pageId/properties/마켓환율
```

**요청 Body:**
```json
{
  "type": "number",
  "value": 3.18
}
```

---

## 사용 예제

### 예제 1: 최신 환율 조회

```javascript
const response = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    sorts: [
      {
        property: "환율날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
const latestExchange = data.data[0];
console.log('최신 환율:', latestExchange.properties.마켓환율);
console.log('적용일:', latestExchange.properties.환율날짜.start);
```

### 예제 2: 특정 날짜 환율 조회

```javascript
const response = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "환율날짜",
      date: {
        equals: "2025-03-11"
      }
    }
  })
});

const data = await response.json();
if (data.data.length > 0) {
  console.log('2025-03-11 환율:', data.data[0].properties.마켓환율);
}
```

### 예제 3: 환율 범위로 검색

```javascript
const response = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      and: [
        {
          property: "마켓환율",
          number: {
            greater_than_or_equal_to: 3.10
          }
        },
        {
          property: "마켓환율",
          number: {
            less_than_or_equal_to: 3.20
          }
        }
      ]
    },
    sorts: [
      {
        property: "환율날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(`3.10~3.20 범위의 환율 ${data.count}개 찾음`);
```

### 예제 4: 특정 환율의 정보 조회

```javascript
const pageId = 'd437ac2f-8380-4452-88f6-9f11b592092f';

const response = await fetch(
  `http://localhost:3001/api/exchange/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "마켓환율": 3.12,
//   "환율날짜": { "start": "2025-03-11", ... },
//   ...
// }
```

### 예제 5: 환율 업데이트 (간편 방식)

```javascript
const pageId = 'd437ac2f-8380-4452-88f6-9f11b592092f';

const response = await fetch(
  `http://localhost:3001/api/exchange/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "마켓환율": {
          type: "number",
          value: 3.18
        },
        "환율날짜": {
          type: "date",
          value: "2025-03-25"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 마켓환율만 업데이트

```javascript
const pageId = 'd437ac2f-8380-4452-88f6-9f11b592092f';

const response = await fetch(
  `http://localhost:3001/api/exchange/${pageId}/properties/마켓환율`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 3.20
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 오늘 환율 등록

```javascript
const today = new Date().toISOString().split('T')[0]; // 2025-03-15 형식

const response = await fetch('http://localhost:3001/api/exchange', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PageID": {
        title: [{ text: { content: `환율_${today}` } }]
      },
      "마켓환율": {
        number: 3.15
      },
      "환율날짜": {
        date: { start: today }
      }
    }
  })
});

const data = await response.json();
console.log('오늘 환율 등록 완료:', data);
```

### 예제 8: 입금 데이터 관계 업데이트

```javascript
const pageId = 'd437ac2f-8380-4452-88f6-9f11b592092f';

const response = await fetch(
  `http://localhost:3001/api/exchange/${pageId}/properties/test_입금데이터`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "relation",
      value: [
        "ee1dc8c4-a8bc-4304-91ae-730474b48443",
        "96edb252-0cee-467c-868f-46658023ae7f"
      ]
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 9: 환율 이력 조회 (최근 7일)

```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const startDate = sevenDaysAgo.toISOString().split('T')[0];

const response = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "환율날짜",
      date: {
        on_or_after: startDate
      }
    },
    sorts: [
      {
        property: "환율날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
const exchangeHistory = data.data.map(item => ({
  날짜: item.properties.환율날짜.start,
  환율: item.properties.마켓환율
}));

console.log('최근 7일 환율 이력:', exchangeHistory);
```

### 예제 10: 평균 환율 계산

```javascript
const response = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true
  })
});

const data = await response.json();
const rates = data.data.map(item => item.properties.마켓환율).filter(r => r !== null);
const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

console.log(`평균 환율: ${avgRate.toFixed(2)}`);
console.log(`최저: ${Math.min(...rates)}, 최고: ${Math.max(...rates)}`);
```

---

## 📌 주요 환율 데이터 필드

### 쓰기 가능한 필드
- `마켓환율` (number) - 시장 환율 (MMK/KRW)
- `환율날짜` (date) - 환율 적용 날짜
- `test_입금데이터` (relation) - 입금 데이터 관계

### 읽기 전용 필드
- `적용환율` (rollup) - 실제 적용된 환율 (입금 데이터에서 집계)

### 시스템 필드
- `ID` (unique_id) - 고유 ID (ED 접두사)
- `PageID` (title) - 기본 키
- `생성 일시` (created_time) - 생성 시간

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **날짜별 정렬**: 환율 데이터는 `환율날짜` 기준으로 정렬하여 최신 환율을 쉽게 조회할 수 있습니다.

4. **환율 범위 검색**: `number` 필터를 사용하여 특정 범위의 환율을 검색할 수 있습니다.

5. **입금 데이터 연결**: `test_입금데이터` relation을 통해 어떤 입금에 어떤 환율이 적용되었는지 추적할 수 있습니다.

6. **적용환율**: `적용환율`은 rollup 필드로, 실제로 입금 데이터에 적용된 환율을 보여줍니다.

7. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.

---

## 📊 환율 관리 시나리오

### 일일 환율 업데이트
매일 환율을 새로 등록하고 최신 환율로 입금 계산

```javascript
// 1. 오늘 날짜로 새 환율 등록
const today = new Date().toISOString().split('T')[0];
await fetch('http://localhost:3001/api/exchange', {
  method: 'POST',
  body: JSON.stringify({
    properties: {
      PageID: { title: [{ text: { content: `rate_${today}` } }] },
      마켓환율: { number: 3.16 },
      환율날짜: { date: { start: today } }
    }
  })
});

// 2. 최신 환율 조회
const latest = await fetch('http://localhost:3001/api/exchange/list', {
  method: 'POST',
  body: JSON.stringify({
    simplified: true,
    sorts: [{ property: "환율날짜", direction: "descending" }]
  })
});
```





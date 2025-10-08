# Fund API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 입금 조회
```http
POST /api/fund/list
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
      "id": "96edb252-0cee-467c-868f-46658023ae7f",
      "properties": {
        "입금K": 94000,
        "출금k": null,
        "적용환율": 3.14,
        "확인날짜": {
          "start": "2025-03-29",
          "end": null
        },
        "금액k": {
          "type": "number",
          "number": 94000
        },
        "환율인자M": {
          "type": "number",
          "number": 295160
        },
        "금액M+미얀마배송": {
          "type": "number",
          "number": 298660
        }
      }
    }
  ]
}
```

### 2. 특정 입금 조회
```http
POST /api/fund/get
```

**요청 Body:**
```json
{
  "pageId": "96edb252-0cee-467c-868f-46658023ae7f",
  "simplified": true  // 선택
}
```

### 3. 입금 추가
```http
POST /api/fund
```

**요청 Body:**
```json
{
  "properties": {
    "PrimaryKey": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "입금K": {
      "number": 100000
    },
    "적용환율": {
      "number": 3.14
    },
    "확인날짜": {
      "date": { "start": "2025-03-15" }
    }
  }
}
```

### 4. 입금 업데이트
```http
PATCH /api/fund/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "입금K": {
      "number": 120000
    },
    "확인날짜": {
      "date": { "start": "2025-03-20" }
    }
  }
}
```

### 5. 입금 삭제 (아카이브)
```http
DELETE /api/fund/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/fund/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "입금K": 94000,
    "출금k": null,
    "적용환율": 3.14,
    "확인날짜": {
      "start": "2025-03-29",
      "end": null,
      "time_zone": null
    },
    "금액k": {
      "type": "number",
      "number": 94000
    },
    "환율인자M": {
      "type": "number",
      "number": 295160
    },
    "금액M+미얀마배송": {
      "type": "number",
      "number": 298660
    },
    "사용포인트": {
      "type": "number",
      "number": null
    },
    "[미얀마요청배송비M]": {
      "type": "number",
      "number": 3500
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/fund/:pageId/properties/입금K?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "입금K",
    "type": "number",
    "value": 94000
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/fund/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "입금K": {
      "type": "number",
      "value": 100000
    },
    "적용환율": {
      "type": "number",
      "value": 3.15
    },
    "확인날짜": {
      "type": "date",
      "value": "2025-03-25"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/fund/:pageId/properties/입금K
```

**요청 Body:**
```json
{
  "type": "number",
  "value": 120000
}
```

---

## 사용 예제

### 예제 1: 입금 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/fund/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "입금K",
      number: {
        greater_than: 50000
      }
    },
    sorts: [
      {
        property: "확인날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 입금의 모든 정보 조회

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "입금K": 94000,
//   "출금k": null,
//   "적용환율": 3.14,
//   ...
// }
```

### 예제 3: 입금 금액만 조회

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties/입금K?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // 94000
```

### 예제 4: 입금 정보 일괄 업데이트

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "입금K": {
          type: "number",
          value: 120000
        },
        "적용환율": {
          type: "number",
          value: 3.15
        },
        "확인날짜": {
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

### 예제 5: 입금 금액만 업데이트

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties/입금K`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 150000
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 출금 기록 업데이트

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties/출금k`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "number",
      value: 50000
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 관계 필드 업데이트 (계좌/환율/상품 연결)

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

const response = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "test_입출금계좌데이터": {
          type: "relation",
          value: ["a38f86b1-758b-4641-aa8a-c8e378a0267d"]
        },
        "test_환율데이터": {
          type: "relation",
          value: [
            "d437ac2f-8380-4452-88f6-9f11b592092f",
            "f2f8ae18-f8fc-4206-8bd1-8651704f38dc"
          ]
        },
        "[배송]test_상품데이터": {
          type: "relation",
          value: ["1b4053df-aa4c-80c1-896c-cf9c7bb9bbf5"]
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 8: 입금 및 환율 정보 동시 조회

```javascript
const pageId = '96edb252-0cee-467c-868f-46658023ae7f';

// 모든 속성 조회
const allPropsResponse = await fetch(
  `http://localhost:3001/api/fund/${pageId}/properties?simplified=true`
);
const allProps = await allPropsResponse.json();

// 필요한 정보만 추출
const fundInfo = {
  입금액: allProps.data.입금K,
  환율: allProps.data.적용환율,
  환산금액: allProps.data.환율인자M?.number,
  확인일: allProps.data.확인날짜?.start
};

console.log(fundInfo);
// {
//   입금액: 94000,
//   환율: 3.14,
//   환산금액: 295160,
//   확인일: "2025-03-29"
// }
```

### 예제 9: 새로운 입금 기록 추가

```javascript
const response = await fetch('http://localhost:3001/api/fund', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PrimaryKey": {
        title: [{ text: { content: "새입금기록" } }]
      },
      "입금K": {
        number: 200000
      },
      "적용환율": {
        number: 3.16
      },
      "확인날짜": {
        date: { start: "2025-03-30" }
      },
      "test_입출금계좌데이터": {
        relation: [{ id: "a38f86b1-758b-4641-aa8a-c8e378a0267d" }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

---

## 📌 주요 입금 데이터 필드

### 쓰기 가능한 필드
- `입금K` (number) - 입금 금액 (원)
- `출금k` (number) - 출금 금액 (원)
- `적용환율` (number) - 적용된 환율
- `확인날짜` (date) - 입금 확인 날짜
- `test_입출금계좌데이터` (relation) - 계좌 데이터 관계
- `test_환율데이터` (relation) - 환율 데이터 관계
- `[구매]test_상품데이터` (relation) - 구매 상품 데이터 관계
- `[배송]test_상품데이터` (relation) - 배송 상품 데이터 관계
- `[구매자_포인트]test_구매자데이터` (relation) - 구매자 데이터 관계
- `[구매자_배송]test_미얀마배송데이터` (relation) - 미얀마 배송 데이터 관계

### 읽기 전용 필드 (Formula/Rollup)
- `금액k` (formula) - 계산된 금액 (원)
- `환율인자M` (formula) - 환율 적용 금액 (짯)
- `금액M+미얀마배송` (formula) - 배송비 포함 총 금액 (짯)
- `사용포인트` (rollup) - 사용된 포인트
- `[미얀마요청배송비M]` (rollup) - 미얀마 배송비
- `[구매자명]` (rollup) - 구매자명

### 시스템 필드
- `ID` (unique_id) - 고유 ID (FD 접두사)
- `PrimaryKey` (title) - 기본 키
- `생성 일시` (created_time) - 생성 시간
- `최종 편집 일시` (last_edited_time) - 최종 수정 시간

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **환율 계산**: `환율인자M`와 `금액M+미얀마배송`는 formula 필드로 자동 계산됩니다.

4. **관계 필드**: `test_환율데이터`는 여러 환율 데이터를 배열로 연결할 수 있습니다.

5. **입출금 구분**: `입금K`와 `출금k` 필드를 통해 입출금을 구분합니다.

6. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.


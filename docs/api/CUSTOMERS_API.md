# Customers API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [스키마 관련 API](#스키마-관련-api)
4. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 구매자 조회
```http
POST /api/customers/list
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
      "id": "a446c74a-20ff-4382-8d40-83fe3b5f7fb5",
      "properties": {
        "구매자명": "홍길동",
        "FaceBookID": "kaja7776",
        "연락처": 821029845159,
        "주소": "경기도 부천시 원미구 옥산로 16, 연화마을 1410동 2003호",
        "Tag": "",
        "포인트변경날짜": {
          "start": "2025-03-11",
          "end": null
        },
        "보유포인트": {
          "type": "number",
          "number": 91000
        },
        "포인트적립": {
          "type": "number",
          "number": 100000
        },
        "포인트사용": {
          "type": "number",
          "number": 9000
        }
      }
    }
  ]
}
```

### 2. 특정 구매자 조회
```http
POST /api/customers/get
```

**요청 Body:**
```json
{
  "pageId": "a446c74a-20ff-4382-8d40-83fe3b5f7fb5",
  "simplified": true  // 선택
}
```

### 3. 구매자 추가 (스키마 검증 포함)
```http
POST /api/customers
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "구매자명": {
      "rich_text": [{ "text": { "content": "김철수" } }]
    },
    "FaceBookID": {
      "rich_text": [{ "text": { "content": "chulsu123" } }]
    },
    "연락처": {
      "number": 821012345678
    },
    "주소": {
      "rich_text": [{ "text": { "content": "서울시 강남구..." } }]
    }
  }
}
```

### 4. 구매자 업데이트
```http
PATCH /api/customers/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "구매자명": {
      "rich_text": [{ "text": { "content": "김철수(수정)" } }]
    },
    "연락처": {
      "number": 821098765432
    }
  }
}
```

### 5. 구매자 삭제 (아카이브)
```http
DELETE /api/customers/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/customers/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "구매자명": "홍길동",
    "FaceBookID": "kaja7776",
    "연락처": 821029845159,
    "주소": "경기도 부천시 원미구 옥산로 16, 연화마을 1410동 2003호",
    "Tag": "",
    "포인트변경날짜": {
      "start": "2025-03-11",
      "end": null,
      "time_zone": null
    },
    "보유포인트": {
      "type": "number",
      "number": 91000
    },
    "포인트적립": {
      "type": "number",
      "number": 100000
    },
    "포인트사용": {
      "type": "number",
      "number": 9000
    },
    "포인트출금": {
      "type": "number",
      "number": 0
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/customers/:pageId/properties/구매자명?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "구매자명",
    "type": "rich_text",
    "value": "홍길동"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/customers/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "구매자명": {
      "type": "rich_text",
      "value": "홍길동(수정)"
    },
    "연락처": {
      "type": "number",
      "value": 821098765432
    },
    "주소": {
      "type": "rich_text",
      "value": "새로운 주소"
    },
    "포인트변경날짜": {
      "type": "date",
      "value": "2025-03-20"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/customers/:pageId/properties/구매자명
```

**요청 Body:**
```json
{
  "type": "rich_text",
  "value": "홍길동(수정)"
}
```

---

## 스키마 관련 API

### 1. 데이터베이스 스키마 분석
```http
POST /api/customers/schema
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "databaseId": "acaf32a7-1236-4f66-9161-95dbf8eca1cf",
    "properties": {
      "구매자명": {
        "type": "rich_text",
        "id": "sEVD"
      },
      "연락처": {
        "type": "number",
        "id": "gp_~"
      }
    }
  }
}
```

### 2. CRUD 스키마 생성
```http
POST /api/customers/crud-schema
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "create": {
      "구매자명": { "type": "rich_text", "required": false },
      "연락처": { "type": "number", "required": false }
    },
    "update": {
      "구매자명": { "type": "rich_text" },
      "연락처": { "type": "number" }
    }
  }
}
```

---

## 사용 예제

### 예제 1: 구매자 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/customers/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "보유포인트",
      formula: {
        number: {
          greater_than: 50000
        }
      }
    },
    sorts: [
      {
        property: "포인트변경날짜",
        direction: "descending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 구매자의 모든 정보 조회

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "구매자명": "홍길동",
//   "FaceBookID": "kaja7776",
//   "연락처": 821029845159,
//   ...
// }
```

### 예제 3: 구매자명과 포인트 정보만 조회

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

// 모든 속성 조회
const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties?simplified=true`
);
const allProps = await response.json();

// 필요한 정보만 추출
const customerInfo = {
  이름: allProps.data.구매자명,
  보유포인트: allProps.data.보유포인트?.number,
  적립포인트: allProps.data.포인트적립?.number,
  사용포인트: allProps.data.포인트사용?.number
};

console.log(customerInfo);
// {
//   이름: "홍길동",
//   보유포인트: 91000,
//   적립포인트: 100000,
//   사용포인트: 9000
// }
```

### 예제 4: 구매자 정보 일괄 업데이트

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "구매자명": {
          type: "rich_text",
          value: "홍길동(VIP)"
        },
        "연락처": {
          type: "number",
          value: 821098765432
        },
        "주소": {
          type: "rich_text",
          value: "서울시 강남구 테헤란로 123"
        },
        "Tag": {
          type: "rich_text",
          value: "VIP고객"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 구매자명만 업데이트

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties/구매자명`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "rich_text",
      value: "김철수"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 관계 필드 업데이트 (상품/배송 연결)

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties`,
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
        "test_배송데이터": {
          type: "relation",
          value: ["93da1f14-8925-439c-9455-86c2d77abf04"]
        },
        "test_미얀마배송데이터": {
          type: "relation",
          value: ["41ccd18b-d947-44fd-a6d8-973bf67f09e4"]
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 새 구매자 추가 (스키마 검증 포함)

```javascript
const response = await fetch('http://localhost:3001/api/customers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PageID": {
        title: [{ text: { content: "새구매자ID" } }]
      },
      "구매자명": {
        rich_text: [{ text: { content: "이영희" } }]
      },
      "FaceBookID": {
        rich_text: [{ text: { content: "younghee456" } }]
      },
      "연락처": {
        number: 821087654321
      },
      "주소": {
        rich_text: [{ text: { content: "부산시 해운대구..." } }]
      },
      "포인트변경날짜": {
        date: { start: "2025-03-15" }
      }
    }
  })
});

const data = await response.json();
if (!data.success && data.details) {
  // 스키마 검증 실패
  console.error('검증 오류:', data.details);
}
console.log(data);
```

### 예제 8: 포인트 변경일 업데이트

```javascript
const pageId = 'a446c74a-20ff-4382-8d40-83fe3b5f7fb5';

const response = await fetch(
  `http://localhost:3001/api/customers/${pageId}/properties/포인트변경날짜`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "date",
      value: "2025-03-25"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 9: 데이터베이스 스키마 확인

```javascript
const schemaResponse = await fetch('http://localhost:3001/api/customers/schema', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const schema = await schemaResponse.json();
console.log('데이터베이스 스키마:', schema.data);

// CRUD 스키마도 확인
const crudSchemaResponse = await fetch('http://localhost:3001/api/customers/crud-schema', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const crudSchema = await crudSchemaResponse.json();
console.log('CRUD 스키마:', crudSchema.data);
```

---

## 📌 주요 구매자 데이터 필드

### 쓰기 가능한 필드
- `구매자명` (rich_text) - 구매자 이름
- `FaceBookID` (rich_text) - 페이스북 ID
- `연락처` (number) - 전화번호
- `주소` (rich_text) - 배송 주소
- `Tag` (rich_text) - 태그/메모
- `포인트변경날짜` (date) - 포인트 변경 날짜
- `[상품명]test_상품데이터` (relation) - 상품 데이터 관계
- `test_배송데이터` (relation) - 배송 데이터 관계
- `test_미얀마배송데이터` (relation) - 미얀마 배송 데이터 관계
- `[입금명_포인트]test_입금데이터` (relation) - 입금 데이터 관계

### 읽기 전용 필드 (Formula/Rollup)
- `보유포인트` (formula) - 계산된 보유 포인트
- `포인트적립` (rollup) - 총 적립 포인트
- `포인트사용` (rollup) - 총 사용 포인트
- `포인트출금` (rollup) - 총 출금 포인트
- `[ID]` (rollup) - 관련 ID 목록

### 시스템 필드
- `ID` (unique_id) - 고유 ID (CD 접두사)
- `PageID` (title) - 기본 키
- `생성날짜` (created_time) - 생성 시간

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **스키마 검증**: 구매자 추가 시 자동으로 스키마 검증이 수행됩니다. 검증 실패 시 `details`와 `warnings`를 확인하세요.

4. **포인트 시스템**: `보유포인트`는 formula로 자동 계산되며, `포인트적립`, `포인트사용`, `포인트출금`은 rollup으로 집계됩니다.

5. **연락처 형식**: `연락처` 필드는 number 타입이므로 국가번호를 포함한 숫자만 입력합니다 (예: 821012345678).

6. **에러 처리**: 모든 API는 `{ success: boolean, error?: string, details?: object }` 형식으로 응답합니다.





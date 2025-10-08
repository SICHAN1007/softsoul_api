# Warehouses API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 배송처 조회
```http
POST /api/warehouses/list
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
      "id": "eb0a0a89-e278-4040-a790-139bf1eb73df",
      "properties": {
        "배송처명": "경아로지스틱스",
        "수취인명": "진진",
        "주소": "경기도 부천시 옥산로 16",
        "연락처": "03255446546",
        "SiteLink": "www.naver.com",
        "Tag": ""
      }
    }
  ]
}
```

### 2. 특정 배송처 조회
```http
POST /api/warehouses/get
```

**요청 Body:**
```json
{
  "pageId": "eb0a0a89-e278-4040-a790-139bf1eb73df",
  "simplified": true  // 선택
}
```

### 3. 배송처 추가
```http
POST /api/warehouses
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "배송처명": {
      "rich_text": [{ "text": { "content": "CJ대한통운" } }]
    },
    "수취인명": {
      "rich_text": [{ "text": { "content": "홍길동" } }]
    },
    "주소": {
      "rich_text": [{ "text": { "content": "서울시 강남구 테헤란로 123" } }]
    },
    "연락처": {
      "rich_text": [{ "text": { "content": "0212345678" } }]
    },
    "SiteLink": {
      "rich_text": [{ "text": { "content": "www.cjlogistics.com" } }]
    }
  }
}
```

### 4. 배송처 업데이트
```http
PATCH /api/warehouses/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "배송처명": {
      "rich_text": [{ "text": { "content": "경아로지스틱스(본점)" } }]
    },
    "연락처": {
      "rich_text": [{ "text": { "content": "0298765432" } }]
    }
  }
}
```

### 5. 배송처 삭제 (아카이브)
```http
DELETE /api/warehouses/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/warehouses/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "배송처명": "경아로지스틱스",
    "수취인명": "진진",
    "주소": "경기도 부천시 옥산로 16",
    "연락처": "03255446546",
    "SiteLink": "www.naver.com",
    "Tag": ""
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/warehouses/:pageId/properties/배송처명?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "배송처명",
    "type": "rich_text",
    "value": "경아로지스틱스"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/warehouses/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "배송처명": {
      "type": "rich_text",
      "value": "경아로지스틱스(본점)"
    },
    "수취인명": {
      "type": "rich_text",
      "value": "김철수"
    },
    "주소": {
      "type": "rich_text",
      "value": "경기도 부천시 옥산로 20"
    },
    "연락처": {
      "type": "rich_text",
      "value": "0312345678"
    },
    "Tag": {
      "type": "rich_text",
      "value": "주요배송처"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/warehouses/:pageId/properties/배송처명
```

**요청 Body:**
```json
{
  "type": "rich_text",
  "value": "경아로지스틱스(VIP)"
}
```

---

## 사용 예제

### 예제 1: 배송처 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/warehouses/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    sorts: [
      {
        property: "배송처명",
        direction: "ascending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 배송처의 모든 정보 조회

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "배송처명": "경아로지스틱스",
//   "수취인명": "진진",
//   "주소": "경기도 부천시 옥산로 16",
//   ...
// }
```

### 예제 3: 배송처 기본 정보만 조회

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

// 모든 속성 조회
const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties?simplified=true`
);
const allProps = await response.json();

// 필요한 정보만 추출
const warehouseInfo = {
  배송처: allProps.data.배송처명,
  수취인: allProps.data.수취인명,
  주소: allProps.data.주소,
  연락처: allProps.data.연락처,
  웹사이트: allProps.data.SiteLink
};

console.log(warehouseInfo);
// {
//   배송처: "경아로지스틱스",
//   수취인: "진진",
//   주소: "경기도 부천시 옥산로 16",
//   연락처: "03255446546",
//   웹사이트: "www.naver.com"
// }
```

### 예제 4: 배송처 정보 일괄 업데이트

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "배송처명": {
          type: "rich_text",
          value: "경아로지스틱스(강남점)"
        },
        "수취인명": {
          type: "rich_text",
          value: "이영희"
        },
        "주소": {
          type: "rich_text",
          value: "서울시 강남구 테헤란로 456"
        },
        "연락처": {
          type: "rich_text",
          value: "0287654321"
        },
        "Tag": {
          type: "rich_text",
          value: "강남권배송"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 연락처만 업데이트

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties/연락처`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "rich_text",
      value: "0312345678"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 배송 데이터 관계 업데이트

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "[Batch.No]test_배송데이터": {
          type: "relation",
          value: ["93da1f14-8925-439c-9455-86c2d77abf04"]
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 새 배송처 추가

```javascript
const response = await fetch('http://localhost:3001/api/warehouses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PageID": {
        title: [{ text: { content: "새배송처ID" } }]
      },
      "배송처명": {
        "rich_text": [{ text: { content: "한진택배" } }]
      },
      "수취인명": {
        rich_text: [{ text: { content: "박영수" } }]
      },
      "주소": {
        rich_text: [{ text: { content: "인천시 남동구 논현동 123" } }]
      },
      "연락처": {
        rich_text: [{ text: { content: "0323456789" } }]
      },
      "SiteLink": {
        rich_text: [{ text: { content: "www.hanjin.co.kr" } }]
      },
      "Tag": {
        rich_text: [{ text: { content: "전국배송" } }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 8: 배송처명으로 검색

```javascript
const response = await fetch('http://localhost:3001/api/warehouses/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "배송처명",
      rich_text: {
        contains: "로지스틱스"
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 9: 특정 배송처의 연락처만 조회

```javascript
const pageId = 'eb0a0a89-e278-4040-a790-139bf1eb73df';

const response = await fetch(
  `http://localhost:3001/api/warehouses/${pageId}/properties/연락처?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // "03255446546"
```

### 예제 10: 여러 배송처의 기본 정보 조회

```javascript
const response = await fetch('http://localhost:3001/api/warehouses/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true
  })
});

const warehouses = await response.json();

// 배송처 목록 추출
const warehouseList = warehouses.data.map(wh => ({
  id: wh.id,
  이름: wh.properties.배송처명,
  수취인: wh.properties.수취인명,
  연락처: wh.properties.연락처
}));

console.log(warehouseList);
// [
//   {
//     id: "eb0a0a89-e278-4040-a790-139bf1eb73df",
//     이름: "경아로지스틱스",
//     수취인: "진진",
//     연락처: "03255446546"
//   }
// ]
```

---

## 📌 주요 배송처 데이터 필드

### 쓰기 가능한 필드
- `배송처명` (rich_text) - 배송처 이름
- `수취인명` (rich_text) - 수취인 이름
- `주소` (rich_text) - 배송처 주소
- `연락처` (rich_text) - 연락처 전화번호
- `SiteLink` (rich_text) - 배송처 웹사이트 링크
- `Tag` (rich_text) - 태그/메모
- `[Batch.No]test_배송데이터` (relation) - 배송 데이터 관계

### 시스템 필드
- `ID` (unique_id) - 고유 ID (WD 접두사)
- `PageID` (title) - 기본 키

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **연락처 필드**: `연락처` 필드는 rich_text 타입이므로 문자열로 저장됩니다 (하이픈 등 포함 가능).

4. **배송 데이터 연결**: `[Batch.No]test_배송데이터` relation을 통해 배송처와 배송 데이터를 연결할 수 있습니다.

5. **주소 관리**: `주소` 필드에 상세 주소를 저장하여 배송지를 관리할 수 있습니다.

6. **웹사이트 링크**: `SiteLink` 필드에 배송처 웹사이트 URL을 저장할 수 있습니다.

7. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.


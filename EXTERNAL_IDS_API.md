# External IDs API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 외부ID 조회
```http
POST /api/external-ids/list
```

**요청 Body:**
```json
{
  "filter": {},
  "sorts": [],
  "simplified": true  // properties를 간단한 형태로 반환 (선택)
}
```

### 2. 특정 외부ID 조회
```http
POST /api/external-ids/get
```

**요청 Body:**
```json
{
  "pageId": "external-id-page-id",
  "simplified": true  // 선택
}
```

### 3. 외부ID 추가
```http
POST /api/external-ids
```

**요청 Body:**
```json
{
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "External ID Name" } }]
    }
  }
}
```

### 4. 외부ID 업데이트
```http
PATCH /api/external-ids/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "Updated Name" } }]
    }
  }
}
```

### 5. 외부ID 삭제 (아카이브)
```http
DELETE /api/external-ids/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/external-ids/:pageId/properties?simplified=true
```

### 2. 특정 Property 조회
```http
GET /api/external-ids/:pageId/properties/:propertyName?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "PropertyName",
    "type": "rich_text",
    "value": "Property Value"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/external-ids/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "PropertyName": {
      "type": "rich_text",
      "value": "New Value"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/external-ids/:pageId/properties/:propertyName
```

**요청 Body:**
```json
{
  "type": "rich_text",
  "value": "Updated Value"
}
```

---

## 사용 예제

### 예제 1: 모든 외부ID 조회

```javascript
const response = await fetch('http://localhost:3001/api/external-ids/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 외부ID 정보 조회

```javascript
const pageId = 'external-id-page-id';

const response = await fetch(
  `http://localhost:3001/api/external-ids/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
```

### 예제 3: 새 외부ID 추가

```javascript
const response = await fetch('http://localhost:3001/api/external-ids', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "Name": {
        title: [{ text: { content: "API Key 1" } }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 4: 외부ID 정보 업데이트

```javascript
const pageId = 'external-id-page-id';

const response = await fetch(
  `http://localhost:3001/api/external-ids/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "Name": {
          type: "title",
          value: "Updated API Key"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

---

## 📌 주요 외부ID 데이터 필드

### 기본 필드
- Notion 데이터베이스 스키마에 따라 필드가 정의됩니다.
- 데이터 추가 후 스키마를 확인하여 사용 가능한 필드를 파악하세요.

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **외부 시스템 연동**: 외부ID 데이터는 다른 시스템과의 연동을 위한 식별자를 관리하는 용도로 사용할 수 있습니다.

4. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.

---

## 📊 사용 시나리오

외부 시스템과의 연동을 위한 ID 매핑 관리에 활용할 수 있습니다.

```javascript
// 외부 시스템 ID와 Notion 페이지 ID 매핑 관리
const externalId = "EXTERNAL-123";
const notionPageId = "internal-notion-id";

// 매핑 정보 저장
await fetch('http://localhost:3001/api/external-ids', {
  method: 'POST',
  body: JSON.stringify({
    properties: {
      Name: { title: [{ text: { content: externalId } }] }
    }
  })
});
```


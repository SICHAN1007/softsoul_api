# Levels API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 상태 조회
```http
POST /api/levels/list
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
      "id": "198053df-aa4c-8006-9c56-ec889b5d43c1",
      "properties": {
        "이름": "구매확인",
        "[개수]상품데이터": {
          "type": "number",
          "number": 1
        }
      }
    }
  ]
}
```

### 2. 특정 상태 조회
```http
POST /api/levels/get
```

**요청 Body:**
```json
{
  "pageId": "198053df-aa4c-8006-9c56-ec889b5d43c1",
  "simplified": true  // 선택
}
```

### 3. 상태 추가
```http
POST /api/levels
```

**요청 Body:**
```json
{
  "properties": {
    "이름": {
      "title": [{ "text": { "content": "신규상태" } }]
    }
  }
}
```

### 4. 상태 업데이트
```http
PATCH /api/levels/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "이름": {
      "title": [{ "text": { "content": "수정된상태" } }]
    }
  }
}
```

### 5. 상태 삭제 (아카이브)
```http
DELETE /api/levels/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/levels/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "이름": "구매확인",
    "[개수]상품데이터": {
      "type": "number",
      "number": 1
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/levels/:pageId/properties/이름?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "이름",
    "type": "title",
    "value": "구매확인"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/levels/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "이름": {
      "type": "title",
      "value": "구매완료"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/levels/:pageId/properties/이름
```

**요청 Body:**
```json
{
  "type": "title",
  "value": "배송완료"
}
```

---

## 사용 예제

### 예제 1: 모든 상태 목록 조회

```javascript
const response = await fetch('http://localhost:3001/api/levels/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    sorts: [
      {
        property: "이름",
        direction: "ascending"
      }
    ]
  })
});

const data = await response.json();
const statuses = data.data.map(item => ({
  id: item.id,
  이름: item.properties.이름,
  상품수: item.properties['[개수]상품데이터']?.number || 0
}));

console.log('상태 목록:', statuses);
// [
//   { id: "...", 이름: "정보입력", 상품수: 0 },
//   { id: "...", 이름: "구매입금", 상품수: 0 },
//   { id: "...", 이름: "구매확인", 상품수: 1 },
//   ...
// ]
```

### 예제 2: 특정 상태의 정보 조회

```javascript
const pageId = '198053df-aa4c-8006-9c56-ec889b5d43c1';

const response = await fetch(
  `http://localhost:3001/api/levels/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "이름": "구매확인",
//   "[개수]상품데이터": { type: "number", number: 1 }
// }
```

### 예제 3: 상태명만 조회

```javascript
const pageId = '198053df-aa4c-8006-9c56-ec889b5d43c1';

const response = await fetch(
  `http://localhost:3001/api/levels/${pageId}/properties/이름?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // "구매확인"
```

### 예제 4: 상태명 업데이트

```javascript
const pageId = '198053df-aa4c-8006-9c56-ec889b5d43c1';

const response = await fetch(
  `http://localhost:3001/api/levels/${pageId}/properties/이름`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "title",
      value: "구매완료"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 상품 데이터 관계 업데이트

```javascript
const pageId = '198053df-aa4c-8006-9c56-ec889b5d43c1';

const response = await fetch(
  `http://localhost:3001/api/levels/${pageId}/properties/test_상품데이터`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "relation",
      value: ["18d7142e-7997-44eb-9031-0fe4d2924777"]
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 새 상태 추가

```javascript
const response = await fetch('http://localhost:3001/api/levels', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "이름": {
        title: [{ text: { content: "현지배송완료" } }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 7: 상태별 상품 개수 확인

```javascript
const response = await fetch('http://localhost:3001/api/levels/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true
  })
});

const data = await response.json();

const statusSummary = data.data.map(item => ({
  상태: item.properties.이름,
  상품개수: item.properties['[개수]상품데이터']?.number || 0
})).filter(s => s.상품개수 > 0);

console.log('상태별 상품 개수:');
statusSummary.forEach(s => {
  console.log(`- ${s.상태}: ${s.상품개수}개`);
});
```

### 예제 8: 특정 상태명으로 검색

```javascript
const response = await fetch('http://localhost:3001/api/levels/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "이름",
      title: {
        contains: "배송"
      }
    }
  })
});

const data = await response.json();
console.log('배송 관련 상태:', data.data.map(item => item.properties.이름));
// ["배송신청", "배송금액", "배송입금"]
```

### 예제 9: 상태 워크플로우 정의

```javascript
// 주문 처리 워크플로우 상태들
const workflow = [
  "정보입력",
  "구매입금",
  "구매확인",
  "상품도착",
  "배송신청",
  "배송금액",
  "배송입금",
  "Cargo",
  "미얀마",
  "History"
];

// 모든 상태 조회
const response = await fetch('http://localhost:3001/api/levels/list', {
  method: 'POST',
  body: JSON.stringify({ simplified: true })
});

const data = await response.json();
const statuses = new Map(
  data.data.map(item => [item.properties.이름, item.id])
);

// 워크플로우 순서대로 상태 ID 매핑
const workflowMap = workflow.map(status => ({
  status,
  id: statuses.get(status),
  exists: statuses.has(status)
}));

console.log('워크플로우 상태:', workflowMap);
```

---

## 📌 주요 상태 데이터 필드

### 쓰기 가능한 필드
- `이름` (title) - 상태명
- `test_상품데이터` (relation) - 상품 데이터 관계

### 읽기 전용 필드
- `[개수]상품데이터` (formula) - 해당 상태의 상품 개수

### 시스템 필드
- `ID` (unique_id) - 고유 ID (LD 접두사)
- `생성 일시` (created_time) - 생성 시간

---

## 📊 일반적인 상태 워크플로우

주문 처리 프로세스에서 사용되는 상태들:

1. **정보입력** - 초기 상품 정보 입력
2. **구매입금** - 구매 대금 입금 완료
3. **구매확인** - 구매 확인 완료
4. **상품도착** - 상품 도착 완료
5. **배송신청** - 배송 신청
6. **배송금액** - 배송 금액 확인
7. **배송입금** - 배송비 입금 완료
8. **Cargo** - 카고 발송
9. **미얀마** - 미얀마 현지 배송
10. **History** - 완료 (이력)

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **상태 관리**: 상태(Level)는 주문 처리 프로세스의 단계를 나타냅니다.

4. **상품 추적**: `test_상품데이터` relation을 통해 각 상태에 있는 상품들을 추적할 수 있습니다.

5. **자동 집계**: `[개수]상품데이터`는 formula로 해당 상태의 상품 개수를 자동 계산합니다.

6. **워크플로우**: 상태를 순서대로 정의하여 주문 처리 워크플로우를 관리할 수 있습니다.

7. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.


# Vendors API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 구매처 조회
```http
POST /api/vendors/list
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
      "id": "fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653",
      "properties": {
        "구매처명": "쿠팡",
        "담당자이름": "김시찬",
        "담당자ID": "kaja7776",
        "담당자PW": "1234",
        "SiteLink": "www.naver.com",
        "로고이미지link": "https://play-lh.googleusercontent.com/...",
        "Tag": ""
      }
    }
  ]
}
```

### 2. 특정 구매처 조회
```http
POST /api/vendors/get
```

**요청 Body:**
```json
{
  "pageId": "fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653",
  "simplified": true  // 선택
}
```

### 3. 구매처 추가
```http
POST /api/vendors
```

**요청 Body:**
```json
{
  "properties": {
    "PageID": {
      "title": [{ "text": { "content": "고유ID" } }]
    },
    "구매처명": {
      "rich_text": [{ "text": { "content": "11번가" } }]
    },
    "담당자이름": {
      "rich_text": [{ "text": { "content": "홍길동" } }]
    },
    "담당자ID": {
      "rich_text": [{ "text": { "content": "hong123" } }]
    },
    "담당자PW": {
      "rich_text": [{ "text": { "content": "pass1234" } }]
    },
    "SiteLink": {
      "rich_text": [{ "text": { "content": "www.11st.co.kr" } }]
    }
  }
}
```

### 4. 구매처 업데이트
```http
PATCH /api/vendors/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "구매처명": {
      "rich_text": [{ "text": { "content": "쿠팡(수정)" } }]
    },
    "담당자PW": {
      "rich_text": [{ "text": { "content": "newpass5678" } }]
    }
  }
}
```

### 5. 구매처 삭제 (아카이브)
```http
DELETE /api/vendors/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/vendors/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "구매처명": "쿠팡",
    "담당자이름": "김시찬",
    "담당자ID": "kaja7776",
    "담당자PW": "1234",
    "SiteLink": "www.naver.com",
    "로고이미지link": "https://play-lh.googleusercontent.com/X5-X2S0t7G9dTGrPftk-5hXijqRDhwWKxGDs2gBm_kNPcAlO3re4exC_8nekvDhz-H0=w240-h480-rw",
    "Tag": ""
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/vendors/:pageId/properties/구매처명?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "구매처명",
    "type": "rich_text",
    "value": "쿠팡"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/vendors/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "구매처명": {
      "type": "rich_text",
      "value": "쿠팡(수정)"
    },
    "담당자이름": {
      "type": "rich_text",
      "value": "박영희"
    },
    "담당자PW": {
      "type": "rich_text",
      "value": "newpass9999"
    },
    "Tag": {
      "type": "rich_text",
      "value": "주요거래처"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/vendors/:pageId/properties/구매처명
```

**요청 Body:**
```json
{
  "type": "rich_text",
  "value": "쿠팡(VIP)"
}
```

---

## 사용 예제

### 예제 1: 구매처 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/vendors/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    sorts: [
      {
        property: "구매처명",
        direction: "ascending"
      }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### 예제 2: 특정 구매처의 모든 정보 조회

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties?simplified=true`
);

const data = await response.json();
console.log(data.data);
// {
//   "구매처명": "쿠팡",
//   "담당자이름": "김시찬",
//   "담당자ID": "kaja7776",
//   ...
// }
```

### 예제 3: 구매처명과 담당자 정보만 조회

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

// 모든 속성 조회
const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties?simplified=true`
);
const allProps = await response.json();

// 필요한 정보만 추출
const vendorInfo = {
  구매처: allProps.data.구매처명,
  담당자: allProps.data.담당자이름,
  연락ID: allProps.data.담당자ID,
  웹사이트: allProps.data.SiteLink
};

console.log(vendorInfo);
// {
//   구매처: "쿠팡",
//   담당자: "김시찬",
//   연락ID: "kaja7776",
//   웹사이트: "www.naver.com"
// }
```

### 예제 4: 구매처 정보 일괄 업데이트

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "구매처명": {
          type: "rich_text",
          value: "쿠팡(신규계약)"
        },
        "담당자이름": {
          type: "rich_text",
          value: "이철수"
        },
        "담당자ID": {
          type: "rich_text",
          value: "chulsu456"
        },
        "담당자PW": {
          type: "rich_text",
          value: "secure789"
        },
        "Tag": {
          type: "rich_text",
          value: "VIP거래처"
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 비밀번호만 업데이트

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties/담당자PW`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "rich_text",
      value: "newSecurePass123!"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 로고 이미지 링크 업데이트

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties/로고이미지link`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "rich_text",
      value: "https://example.com/new-logo.png"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 7: 관계 필드 업데이트 (상품 연결)

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

const response = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        "[현재]test_상품데이터": {
          type: "relation",
          value: [
            "18d7142e-7997-44eb-9031-0fe4d2924777",
            "1b4053df-aa4c-80c1-896c-cf9c7bb9bbf5"
          ]
        },
        "[이전]test_상품데이터": {
          type: "relation",
          value: []
        }
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 8: 새 구매처 추가

```javascript
const response = await fetch('http://localhost:3001/api/vendors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "PageID": {
        title: [{ text: { content: "새구매처ID" } }]
      },
      "구매처명": {
        rich_text: [{ text: { content: "G마켓" } }]
      },
      "담당자이름": {
        rich_text: [{ text: { content: "최영희" } }]
      },
      "담당자ID": {
        rich_text: [{ text: { content: "younghee789" } }]
      },
      "담당자PW": {
        rich_text: [{ text: { content: "gmarket2024" } }]
      },
      "SiteLink": {
        rich_text: [{ text: { content: "www.gmarket.co.kr" } }]
      },
      "로고이미지link": {
        rich_text: [{ text: { content: "https://example.com/gmarket-logo.png" } }]
      },
      "Tag": {
        rich_text: [{ text: { content: "온라인쇼핑" } }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 9: 특정 구매처의 담당자 정보만 조회

```javascript
const pageId = 'fc8b4b1e-c5f8-46b9-b7e9-ac510ef14653';

// 담당자이름 조회
const nameResponse = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties/담당자이름?simplified=true`
);
const nameData = await nameResponse.json();

// 담당자ID 조회
const idResponse = await fetch(
  `http://localhost:3001/api/vendors/${pageId}/properties/담당자ID?simplified=true`
);
const idData = await idResponse.json();

const managerInfo = {
  이름: nameData.data.value,
  아이디: idData.data.value
};

console.log(managerInfo);
// {
//   이름: "김시찬",
//   아이디: "kaja7776"
// }
```

### 예제 10: 구매처 검색 (이름으로)

```javascript
const response = await fetch('http://localhost:3001/api/vendors/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true,
    filter: {
      property: "구매처명",
      rich_text: {
        contains: "쿠팡"
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

---

## 📌 주요 구매처 데이터 필드

### 쓰기 가능한 필드
- `구매처명` (rich_text) - 구매처 이름
- `담당자이름` (rich_text) - 담당자 이름
- `담당자ID` (rich_text) - 담당자 로그인 ID
- `담당자PW` (rich_text) - 담당자 비밀번호
- `SiteLink` (rich_text) - 구매처 웹사이트 링크
- `로고이미지link` (rich_text) - 로고 이미지 URL
- `Tag` (rich_text) - 태그/메모
- `[현재]test_상품데이터` (relation) - 현재 거래 중인 상품 데이터 관계
- `[이전]test_상품데이터` (relation) - 이전 거래 상품 데이터 관계

### 시스템 필드
- `ID` (unique_id) - 고유 ID (VD 접두사)
- `PageID` (title) - 기본 키

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **보안 정보**: `담당자ID`와 `담당자PW` 필드는 민감한 정보이므로 보안에 주의하세요.

4. **상품 관계**: `[현재]test_상품데이터`와 `[이전]test_상품데이터`를 통해 거래 이력을 관리할 수 있습니다.

5. **웹사이트 링크**: `SiteLink` 필드는 rich_text 타입이므로 URL을 문자열로 저장합니다.

6. **로고 관리**: `로고이미지link` 필드에 이미지 URL을 저장하여 구매처 로고를 관리할 수 있습니다.

7. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.


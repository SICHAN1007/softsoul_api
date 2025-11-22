# Transactions API 사용 가이드

## 📋 목차
1. [기본 CRUD API](#기본-crud-api)
2. [Properties 전용 API](#properties-전용-api)
3. [사용 예제](#사용-예제)

---

## 기본 CRUD API

### 1. 전체 입출금계좌 조회
```http
POST /api/transactions/list
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
      "id": "a38f86b1-758b-4641-aa8a-c8e378a0267d",
      "properties": {
        "Name": "입출금계좌",
        "총입금액K": {
          "type": "number",
          "number": 198000
        },
        "총출금액K": {
          "type": "number",
          "number": 0
        },
        "환율인자합계M": {
          "type": "number",
          "number": 619720
        },
        "잔액M": {
          "type": "number",
          "number": 619720
        },
        "평균환율": {
          "type": "number",
          "number": 3.129898989899
        }
      }
    }
  ]
}
```

### 2. 특정 계좌 조회
```http
POST /api/transactions/get
```

**요청 Body:**
```json
{
  "pageId": "a38f86b1-758b-4641-aa8a-c8e378a0267d",
  "simplified": true  // 선택
}
```

### 3. 계좌 추가
```http
POST /api/transactions
```

**요청 Body:**
```json
{
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "주계좌" } }]
    }
  }
}
```

### 4. 계좌 업데이트
```http
PATCH /api/transactions/:pageId
```

**요청 Body:**
```json
{
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "메인계좌" } }]
    }
  }
}
```

### 5. 계좌 삭제 (아카이브)
```http
DELETE /api/transactions/:pageId
```

---

## Properties 전용 API

### 1. 모든 Properties 조회
```http
GET /api/transactions/:pageId/properties?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "Name": "입출금계좌",
    "총입금액K": {
      "type": "number",
      "number": 198000
    },
    "총출금액K": {
      "type": "number",
      "number": 0
    },
    "환율인자합계M": {
      "type": "number",
      "number": 619720
    },
    "잔액M": {
      "type": "number",
      "number": 619720
    },
    "평균환율": {
      "type": "number",
      "number": 3.129898989899
    }
  }
}
```

### 2. 특정 Property 조회
```http
GET /api/transactions/:pageId/properties/Name?simplified=true
```

**응답 예제:**
```json
{
  "success": true,
  "data": {
    "name": "Name",
    "type": "title",
    "value": "입출금계좌"
  }
}
```

### 3. 여러 Properties 업데이트 (간편 방식)
```http
PATCH /api/transactions/:pageId/properties
```

**요청 Body:**
```json
{
  "updates": {
    "Name": {
      "type": "title",
      "value": "주계좌(업데이트)"
    }
  }
}
```

### 4. 단일 Property 업데이트
```http
PATCH /api/transactions/:pageId/properties/Name
```

**요청 Body:**
```json
{
  "type": "title",
  "value": "메인계좌"
}
```

---

## 사용 예제

### 예제 1: 계좌 목록 조회 (간편 형식)

```javascript
const response = await fetch('http://localhost:3001/api/transactions/list', {
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

### 예제 2: 계좌 잔액 및 통계 조회

```javascript
const pageId = 'a38f86b1-758b-4641-aa8a-c8e378a0267d';

const response = await fetch(
  `http://localhost:3001/api/transactions/${pageId}/properties?simplified=true`
);

const data = await response.json();
const props = data.data;

const accountInfo = {
  계좌명: props.Name,
  총입금_원: props.총입금액K?.number,
  총출금_원: props.총출금액K?.number,
  잔액_짯: props.잔액M?.number,
  평균환율: props.평균환율?.number?.toFixed(2)
};

console.log(accountInfo);
// {
//   계좌명: "입출금계좌",
//   총입금_원: 198000,
//   총출금_원: 0,
//   잔액_짯: 619720,
//   평균환율: "3.13"
// }
```

### 예제 3: 계좌명만 조회

```javascript
const pageId = 'a38f86b1-758b-4641-aa8a-c8e378a0267d';

const response = await fetch(
  `http://localhost:3001/api/transactions/${pageId}/properties/Name?simplified=true`
);

const data = await response.json();
console.log(data.data.value); // "입출금계좌"
```

### 예제 4: 계좌명 업데이트

```javascript
const pageId = 'a38f86b1-758b-4641-aa8a-c8e378a0267d';

const response = await fetch(
  `http://localhost:3001/api/transactions/${pageId}/properties/Name`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "title",
      value: "주계좌(메인)"
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 5: 입금 데이터 관계 업데이트

```javascript
const pageId = 'a38f86b1-758b-4641-aa8a-c8e378a0267d';

const response = await fetch(
  `http://localhost:3001/api/transactions/${pageId}/properties/test_입금데이터`,
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: "relation",
      value: [
        "ee1dc8c4-a8bc-4304-91ae-730474b48443",
        "1b3053df-aa4c-80c1-9eb0-fb0a9c0d8d33",
        "96edb252-0cee-467c-868f-46658023ae7f"
      ]
    })
  }
);

const data = await response.json();
console.log(data);
```

### 예제 6: 새 계좌 추가

```javascript
const response = await fetch('http://localhost:3001/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      "Name": {
        title: [{ text: { content: "서브계좌" } }]
      }
    }
  })
});

const data = await response.json();
console.log(data);
```

### 예제 7: 계좌 재무 상태 확인

```javascript
const pageId = 'a38f86b1-758b-4641-aa8a-c8e378a0267d';

const response = await fetch(
  `http://localhost:3001/api/transactions/${pageId}/properties?simplified=true`
);

const data = await response.json();
const props = data.data;

const financialStatus = {
  계좌명: props.Name,
  입금총액_KRW: props.총입금액K?.number || 0,
  출금총액_KRW: props.총출금액K?.number || 0,
  환산금액_MMK: props.환율인자합계M?.number || 0,
  잔액_MMK: props.잔액M?.number || 0,
  평균환율: props.평균환율?.number?.toFixed(4) || 0
};

console.log('=== 계좌 재무 상태 ===');
console.log(`계좌: ${financialStatus.계좌명}`);
console.log(`총 입금: ${financialStatus.입금총액_KRW.toLocaleString()}원`);
console.log(`총 출금: ${financialStatus.출금총액_KRW.toLocaleString()}원`);
console.log(`잔액(미얀마): ${financialStatus.잔액_MMK.toLocaleString()} MMK`);
console.log(`평균 환율: ${financialStatus.평균환율}`);
```

### 예제 8: 모든 계좌 잔액 합계 조회

```javascript
const response = await fetch('http://localhost:3001/api/transactions/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    simplified: true
  })
});

const data = await response.json();

let 총잔액_KRW = 0;
let 총잔액_MMK = 0;

data.data.forEach(account => {
  const props = account.properties;
  총잔액_KRW += (props.총입금액K?.number || 0) - (props.총출금액K?.number || 0);
  총잔액_MMK += props.잔액M?.number || 0;
});

console.log('=== 전체 계좌 요약 ===');
console.log(`총 잔액(원): ${총잔액_KRW.toLocaleString()}원`);
console.log(`총 잔액(짯): ${총잔액_MMK.toLocaleString()} MMK`);
console.log(`계좌 수: ${data.count}개`);
```

---

## 📌 주요 입출금계좌 데이터 필드

### 쓰기 가능한 필드
- `Name` (title) - 계좌명
- `test_입금데이터` (relation) - 입금 데이터 관계

### 읽기 전용 필드 (Formula/Rollup)
- `총입금액K` (rollup) - 총 입금액 (원)
- `총출금액K` (rollup) - 총 출금액 (원)
- `환율인자합계M` (rollup) - 환율 인자 합계 (짯)
- `잔액M` (rollup) - 잔액 (짯)
- `평균환율` (formula) - 평균 환율

### 시스템 필드
- `ID` (unique_id) - 고유 ID (TD 접두사)

---

## 💡 팁

1. **간편 조회**: `simplified=true` 파라미터를 사용하면 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

2. **간편 업데이트**: `/properties` 엔드포인트를 사용하면 간단한 형식으로 업데이트할 수 있습니다.

3. **자동 집계**: 
   - `총입금액K`, `총출금액K`: 관련 입금 데이터에서 자동 집계
   - `잔액M`: 입금-출금 자동 계산
   - `평균환율`: 모든 거래의 평균 환율 자동 계산

4. **화폐 단위**:
   - `K` 접미사: KRW (원)
   - `M` 접미사: MMK (짯)

5. **입금 데이터 연결**: `test_입금데이터` relation을 통해 모든 입금 내역을 추적할 수 있습니다.

6. **재무 현황**: Rollup과 Formula를 통해 실시간 재무 현황을 파악할 수 있습니다.

7. **에러 처리**: 모든 API는 `{ success: boolean, error?: string }` 형식으로 응답합니다.

---

## 📊 계좌 관리 시나리오

### 계좌 재무 상태 모니터링
입출금 내역을 실시간으로 집계하여 계좌 잔액 확인

```javascript
// 1. 계좌 생성
const newAccount = await fetch('http://localhost:3001/api/transactions', {
  method: 'POST',
  body: JSON.stringify({
    properties: {
      Name: { title: [{ text: { content: "서브계좌" } }] }
    }
  })
});

// 2. 입금 데이터 연결 (입금 발생 시 자동 연결)
// test_입금데이터 relation이 자동으로 업데이트되면
// 총입금액K, 환율인자합계M, 잔액M이 자동 계산됩니다

// 3. 계좌 잔액 확인
const accountId = newAccount.data.id;
const balance = await fetch(
  `http://localhost:3001/api/transactions/${accountId}/properties?simplified=true`
);
const balanceData = await balance.json();

console.log('계좌 잔액:', balanceData.data.잔액M?.number);
console.log('평균 환율:', balanceData.data.평균환율?.number);
```





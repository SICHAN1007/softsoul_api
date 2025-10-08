# 🚀 Notion API 서버

Notion의 11개 데이터베이스를 통합 관리하는 Express 기반 RESTful API 서버입니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [데이터베이스 구조](#데이터베이스-구조)
- [프로젝트 구조](#프로젝트-구조)
- [설치 방법](#설치-방법)
- [환경 설정](#환경-설정)
- [실행 방법](#실행-방법)
- [API 엔드포인트](#api-엔드포인트)
- [사용 예시](#사용-예시)

## ⚙️ 기술 스택

- **Node.js** 18.x 이상
- **Express.js** - 웹 프레임워크
- **@notionhq/client** - Notion SDK
- **dotenv** - 환경변수 관리
- **cors** - CORS 설정
- **morgan** - HTTP 로깅

## 📊 데이터베이스 구조

이 API는 다음 11개의 Notion 데이터베이스를 관리합니다:

| 변수명 | API 경로 | 설명 |
|--------|----------|------|
| `PRODUCT_DATA` | `/api/products` | 상품데이터 |
| `SHIPPING_DATA` | `/api/shipping` | 배송데이터 |
| `FUND_DATA` | `/api/fund` | 입금데이터 |
| `CUSTOMER_DATA` | `/api/customers` | 구매자데이터 |
| `VENDOR_DATA` | `/api/vendors` | 구매처데이터 |
| `WAREHOUSE_DATA` | `/api/warehouses` | 배송처데이터 |
| `EXCHANGE_DATA` | `/api/exchange` | 환율데이터 |
| `MYANMAR_DELIVERY_DATA` | `/api/myanmar-delivery` | 미얀마배송데이터 |
| `TRANSACTION_DATABASE` | `/api/transactions` | 입출금계좌데이터 |
| `LEVEL_DATABASE` | `/api/levels` | 상태데이터 |
| `EXTERNAL_ID_DATA` | `/api/external-ids` | 외부ID데이터 |

## 📁 프로젝트 구조

```
notion-api/
├─ src/
│  ├─ config/
│  │  └─ notionClient.js         # Notion 클라이언트 설정
│  ├─ routes/
│  │  ├─ products.js              # 상품 API
│  │  ├─ shipping.js              # 배송 API
│  │  ├─ fund.js                  # 입금 API
│  │  ├─ customers.js             # 구매자 API
│  │  ├─ vendors.js               # 구매처 API
│  │  ├─ warehouses.js            # 배송처 API
│  │  ├─ exchange.js              # 환율 API
│  │  ├─ myanmar-delivery.js      # 미얀마배송 API
│  │  ├─ transactions.js          # 입출금계좌 API
│  │  ├─ levels.js                # 상태 API
│  │  └─ external-ids.js          # 외부ID API
│  ├─ services/
│  │  └─ genericService.js       # 공통 CRUD 서비스
│  ├─ utils/
│  │  └─ logger.js               # 로깅 유틸리티
│  ├─ app.js                     # Express 앱 설정
│  └─ server.js                  # 서버 실행
├─ env.example                   # 환경변수 템플릿
├─ package.json
└─ README.md
```

## 📦 설치 방법

### 1. 프로젝트 디렉토리로 이동

```bash
cd your-project-directory
```

### 2. 의존성 설치

```bash
npm install
```

## 🔑 환경 설정

### 1. Notion API Key 발급

1. [Notion Developers](https://www.notion.so/my-integrations)에 접속
2. "+ New integration" 클릭
3. 이름을 입력하고 "Submit" 클릭
4. "Internal Integration Token"을 복사 (secret_로 시작)

### 2. Database ID 확인

1. Notion에서 데이터베이스 페이지를 열기
2. URL을 확인: `https://www.notion.so/workspace/{database_id}?v=...`
3. `database_id` 부분을 복사 (32자리 문자열)

### 3. .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
# Notion API Key
NOTION_API_KEY=secret_your_actual_key_here

# Database IDs
PRODUCT_DATA=748cc8d7b5e14cb29b022d80a7d6bb8d
SHIPPING_DATA=3bd4d6b8d9214b99a32f828629943a63
FUND_DATA=98f11a52948b4f3c919de0dee37863da
CUSTOMER_DATA=acaf32a712364f66916195dbf8eca1cf
VENDOR_DATA=fa49c9554f5a4eb383b4a02e095903a6
WAREHOUSE_DATA=79e7174899f74a6b80bb9f08c96ec17d
EXCHANGE_DATA=f93e5295fd3b48d3ae9874241e6b7981
MYANMAR_DELIVERY_DATA=4237beebbeba42fab239eaaa2d8f8782
TRANSACTION_DATABASE=c5c39d34e46e4916b620df5b71628545
LEVEL_DATABASE=198053dfaa4c803b9bc1fb7ca79f673f
EXTERNAL_ID_DATA=208053dfaa4c8050adcbfb34bdfdd58f

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Notion 데이터베이스에 Integration 연결

**중요!** 각 데이터베이스 페이지에서:
1. 우측 상단 `...` 메뉴 클릭
2. "Add connections" 선택
3. 생성한 Integration 선택

## 🚀 실행 방법

### 개발 모드 (nodemon)

```bash
npm run dev
```

### 프로덕션 모드

```bash
npm start
```

서버가 정상적으로 실행되면:

```
🚀 서버가 포트 3000에서 실행 중입니다.
📦 환경: development
🌐 URL: http://localhost:3000
✅ 모든 데이터베이스 ID가 정상적으로 설정되었습니다.
```

## 📡 API 엔드포인트

### 기본 정보

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

### 공통 엔드포인트

#### 서버 정보

```http
GET /
```

서버 정보 및 사용 가능한 엔드포인트 목록을 반환합니다.

#### 헬스 체크

```http
GET /health
```

서버 상태 및 데이터베이스 설정 유효성을 확인합니다.

### 데이터베이스 CRUD API

모든 데이터베이스는 동일한 CRUD 패턴을 따릅니다:

#### 1. 전체 항목 조회

```http
GET /api/{endpoint}
```

**쿼리 파라미터** (선택사항):
- `filter`: Notion API 필터 (JSON 문자열)
- `sorts`: 정렬 옵션 (JSON 문자열)

**응답 예시**:
```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "hasMore": false,
  "nextCursor": null
}
```

#### 2. 특정 항목 조회

```http
GET /api/{endpoint}/:pageId
```

#### 3. 항목 추가

```http
POST /api/{endpoint}
```

**요청 바디**:
```json
{
  "properties": {
    "Name": {
      "title": [
        {
          "text": {
            "content": "새 항목"
          }
        }
      ]
    }
  }
}
```

#### 4. 항목 업데이트

```http
PATCH /api/{endpoint}/:pageId
```

**요청 바디**:
```json
{
  "properties": {
    "Status": {
      "select": {
        "name": "완료"
      }
    }
  }
}
```

#### 5. 항목 삭제 (아카이브)

```http
DELETE /api/{endpoint}/:pageId
```

### 사용 가능한 엔드포인트 목록

| 엔드포인트 | 설명 |
|-----------|------|
| `/api/products` | 상품데이터 |
| `/api/shipping` | 배송데이터 |
| `/api/fund` | 입금데이터 |
| `/api/customers` | 구매자데이터 |
| `/api/vendors` | 구매처데이터 |
| `/api/warehouses` | 배송처데이터 |
| `/api/exchange` | 환율데이터 |
| `/api/myanmar-delivery` | 미얀마배송데이터 |
| `/api/transactions` | 입출금계좌데이터 |
| `/api/levels` | 상태데이터 |
| `/api/external-ids` | 외부ID데이터 |

## 💡 사용 예시

### cURL

#### 상품 전체 조회
```bash
curl http://localhost:3000/api/products
```

#### 고객 추가
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "Name": {
        "title": [{"text": {"content": "홍길동"}}]
      }
    }
  }'
```

#### 항목 삭제
```bash
curl -X DELETE http://localhost:3000/api/shipping/page-id-here
```

### JavaScript (Fetch API)

```javascript
// 전체 조회
const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  const data = await response.json();
  return data;
};

// 항목 추가
const addCustomer = async () => {
  const response = await fetch('http://localhost:3000/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        Name: {
          title: [{ text: { content: '홍길동' } }]
        }
      }
    })
  });
  return await response.json();
};

// 항목 업데이트
const updateProduct = async (pageId) => {
  const response = await fetch(`http://localhost:3000/api/products/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        Status: {
          select: { name: '완료' }
        }
      }
    })
  });
  return await response.json();
};
```

### Python (requests)

```python
import requests

# 전체 조회
def get_products():
    response = requests.get('http://localhost:3000/api/products')
    return response.json()

# 항목 추가
def add_customer():
    data = {
        "properties": {
            "Name": {
                "title": [{"text": {"content": "홍길동"}}]
            }
        }
    }
    response = requests.post('http://localhost:3000/api/customers', json=data)
    return response.json()

# 항목 삭제
def delete_shipping(page_id):
    response = requests.delete(f'http://localhost:3000/api/shipping/{page_id}')
    return response.json()
```

## 🔧 트러블슈팅

### 1. "NOTION_API_KEY가 설정되지 않았습니다"

- `.env` 파일이 프로젝트 루트에 있는지 확인
- `NOTION_API_KEY` 값이 `secret_`으로 시작하는지 확인

### 2. "데이터베이스 조회 실패" / "object_not_found"

- Notion Integration이 해당 데이터베이스에 연결되어 있는지 확인
- Database ID가 올바른지 확인 (32자리 문자열)
- 각 데이터베이스의 "Connections" 설정 확인

### 3. "항목 추가 실패"

- `properties` 객체가 데이터베이스 스키마와 일치하는지 확인
- 필수 필드가 모두 포함되어 있는지 확인
- 데이터 타입이 올바른지 확인

### 4. 포트 충돌

`.env` 파일에서 `PORT`를 다른 값으로 변경:

```env
PORT=3001
```

## 📚 참고 자료

- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Express.js 공식 문서](https://expressjs.com/)

## 📄 라이선스

MIT License

---

**Made with ❤️ for Notion API Integration**

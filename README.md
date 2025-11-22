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
softsoul_api/
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
│  │  ├─ genericService.js       # 공통 CRUD 서비스
│  │  └─ databaseAnalyzer.js     # 데이터베이스 분석기
│  ├─ utils/
│  │  └─ logger.js               # 로깅 유틸리티
│  ├─ app.js                     # Express 앱 설정
│  └─ server.js                  # 서버 실행
├─ docs/
│  ├─ api/                        # API 문서들
│  │  ├─ PRODUCTS_API.md
│  │  ├─ SHIPPING_API.md
│  │  ├─ FUND_API.md
│  │  ├─ CUSTOMERS_API.md
│  │  ├─ VENDORS_API.md
│  │  ├─ WAREHOUSES_API.md
│  │  ├─ EXCHANGE_API.md
│  │  ├─ MYANMAR_DELIVERY_API.md
│  │  ├─ TRANSACTIONS_API.md
│  │  ├─ LEVELS_API.md
│  │  ├─ EXTERNAL_IDS_API.md
│  │  └─ README.md
│  ├─ processes/                  # 프로세스 문서들
│  │  ├─ PROCESS.md              # 시스템 프로세스 가이드
│  │  ├─ SETUP_ENV.md            # 환경 설정 가이드
│  │  ├─ DEPLOYMENT.md           # 배포 가이드
│  │  ├─ TROUBLESHOOTING.md     # 트러블슈팅 가이드
│  │  └─ README.md
│  └─ API_GUIDE.md               # API 통합 가이드
├─ k8s/                          # Kubernetes 배포 파일
│  ├─ deployment.yaml
│  ├─ service.yaml
│  └─ secrets-example.yaml
├─ env.example                   # 환경변수 템플릿
├─ Dockerfile                    # Docker 이미지 빌드 파일
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

자세한 환경 설정 방법은 [환경 설정 가이드](./docs/processes/SETUP_ENV.md)를 참조하세요.

### 빠른 설정

1. **Notion API Key 발급**
   - [Notion Developers](https://www.notion.so/my-integrations)에 접속
   - "+ New integration" 클릭하여 Integration 생성
   - "Internal Integration Token" 복사 (secret_로 시작)

2. **Database ID 확인**
   - Notion 데이터베이스 URL에서 32자리 ID 추출
   - 예: `https://www.notion.so/workspace/{database_id}?v=...`

3. **.env 파일 생성**
   ```bash
   # env.example을 복사하여 .env 파일 생성
   cp env.example .env
   ```
   
   `.env` 파일을 열고 실제 값으로 수정:
   ```env
   NOTION_API_KEY=secret_your_actual_key_here
   PRODUCT_DATA=your_database_id_here
   # ... (나머지 데이터베이스 ID들)
   PORT=3000
   NODE_ENV=development
   ```

4. **Notion 데이터베이스에 Integration 연결**
   - 각 데이터베이스 페이지에서 `...` 메뉴 → "Add connections" → 생성한 Integration 선택
   - **이 단계를 빠뜨리면 API가 작동하지 않습니다!**

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

모든 데이터베이스는 동일한 CRUD 패턴을 따릅니다. 자세한 내용은 [API 통합 가이드](./docs/API_GUIDE.md)를 참조하세요.

#### 기본 CRUD 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/{endpoint}/list` | 전체 목록 조회 |
| POST | `/api/{endpoint}/get` | 특정 항목 조회 |
| POST | `/api/{endpoint}` | 새 항목 추가 |
| PATCH | `/api/{endpoint}/:pageId` | 항목 업데이트 |
| DELETE | `/api/{endpoint}/:pageId` | 항목 삭제 (아카이브) |

#### Properties 전용 API

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/{endpoint}/:pageId/properties` | 모든 properties 조회 |
| GET | `/api/{endpoint}/:pageId/properties/:propertyName` | 특정 property 조회 |
| PATCH | `/api/{endpoint}/:pageId/properties` | 여러 properties 업데이트 |
| PATCH | `/api/{endpoint}/:pageId/properties/:propertyName` | 단일 property 업데이트 |

**간편 모드 (simplified=true)**: 복잡한 Notion 형식 대신 값만 받을 수 있습니다.

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

### 간편 모드로 목록 조회

```javascript
// 상품 목록 조회 (간편 형식)
const response = await fetch('http://localhost:3000/api/products/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    simplified: true,
    filter: {},
    sorts: []
  })
});

const data = await response.json();
// properties가 간단한 객체 형태로 반환됩니다
```

### 특정 필드만 조회

```javascript
// 상품명만 조회
const response = await fetch(
  'http://localhost:3000/api/products/페이지ID/properties/상품명?simplified=true'
);
const data = await response.json();
console.log(data.data.value); // "상품명"
```

### 간편하게 필드 업데이트

```javascript
// 여러 필드 한번에 업데이트
const response = await fetch(
  'http://localhost:3000/api/products/페이지ID/properties',
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      updates: {
        "상품명": { type: "rich_text", value: "새 상품명" },
        "상품금액": { type: "number", value: 10000 }
      }
    })
  }
);
```

더 많은 예시는 각 API 문서를 참조하세요:
- [Products API](./docs/api/PRODUCTS_API.md)
- [Customers API](./docs/api/CUSTOMERS_API.md)
- [Warehouses API](./docs/api/WAREHOUSES_API.md)
- ... (기타 API 문서는 [docs/api/](./docs/api/) 폴더 참조)

## 🔧 트러블슈팅

자세한 문제 해결 방법은 [트러블슈팅 가이드](./docs/processes/TROUBLESHOOTING.md)를 참조하세요.

### 일반적인 문제

1. **"NOTION_API_KEY가 설정되지 않았습니다"**
   - `.env` 파일이 프로젝트 루트에 있는지 확인
   - `NOTION_API_KEY` 값이 `secret_`으로 시작하는지 확인

2. **"데이터베이스 조회 실패" / "object_not_found"**
   - Notion Integration이 해당 데이터베이스에 연결되어 있는지 확인
   - Database ID가 올바른지 확인 (32자리 문자열)
   - 각 데이터베이스의 "Connections" 설정 확인

3. **"항목 추가 실패"**
   - `properties` 객체가 데이터베이스 스키마와 일치하는지 확인
   - 필수 필드가 모두 포함되어 있는지 확인
   - 데이터 타입이 올바른지 확인

4. **포트 충돌**
   - `.env` 파일에서 `PORT`를 다른 값으로 변경

## 📚 문서

### 프로젝트 문서
- [API 통합 가이드](./docs/API_GUIDE.md) - 모든 API의 통합 가이드
- [시스템 프로세스 가이드](./docs/processes/PROCESS.md) - 시스템 아키텍처 및 프로세스
- [환경 설정 가이드](./docs/processes/SETUP_ENV.md) - 환경 설정 방법
- [배포 가이드](./docs/processes/DEPLOYMENT.md) - Kubernetes 배포 방법
- [트러블슈팅 가이드](./docs/processes/TROUBLESHOOTING.md) - 문제 해결 방법

### API 문서
각 API별 상세 문서는 [docs/api/](./docs/api/) 폴더를 참조하세요:
- [Products API](./docs/api/PRODUCTS_API.md)
- [Shipping API](./docs/api/SHIPPING_API.md)
- [Fund API](./docs/api/FUND_API.md)
- [Customers API](./docs/api/CUSTOMERS_API.md)
- [Vendors API](./docs/api/VENDORS_API.md)
- [Warehouses API](./docs/api/WAREHOUSES_API.md)
- [Exchange API](./docs/api/EXCHANGE_API.md)
- [Myanmar Delivery API](./docs/api/MYANMAR_DELIVERY_API.md)
- [Transactions API](./docs/api/TRANSACTIONS_API.md)
- [Levels API](./docs/api/LEVELS_API.md)
- [External IDs API](./docs/api/EXTERNAL_IDS_API.md)

### 외부 참고 자료
- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Express.js 공식 문서](https://expressjs.com/)

## 📄 라이선스

MIT License

---

**Made with ❤️ for Notion API Integration**

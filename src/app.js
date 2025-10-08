import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// 라우터 임포트
import productsRouter from './routes/products.js';              // 상품데이터
import shippingRouter from './routes/shipping.js';              // 배송데이터
import fundRouter from './routes/fund.js';                      // 입금데이터
import customersRouter from './routes/customers.js';            // 구매자데이터
import vendorsRouter from './routes/vendors.js';                // 구매처데이터
import warehousesRouter from './routes/warehouses.js';          // 배송처데이터
import exchangeRouter from './routes/exchange.js';              // 환율데이터
import myanmarDeliveryRouter from './routes/myanmar-delivery.js';  // 미얀마배송데이터
import transactionsRouter from './routes/transactions.js';      // 입출금계좌데이터
import levelsRouter from './routes/levels.js';                  // 상태데이터
import externalIdsRouter from './routes/external-ids.js';       // 외부ID데이터

import { logger } from './utils/logger.js';
import { validateDatabaseIds, DB_NAMES_KR } from './config/notionClient.js';

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 루트 경로
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Notion API 서버에 오신 것을 환영합니다!',
    version: '1.0.0',
    description: '11개의 Notion 데이터베이스를 관리하는 RESTful API',
    endpoints: {
      products: 'POST /api/products/list (전체조회), POST /api/products/get (단일조회), POST /api/products (추가), PATCH /api/products/:pageId (수정), DELETE /api/products/:pageId (삭제)',
      shipping: 'POST /api/shipping/list (전체조회), POST /api/shipping/get (단일조회), POST /api/shipping (추가), PATCH /api/shipping/:pageId (수정), DELETE /api/shipping/:pageId (삭제)',
      fund: 'POST /api/fund/list (전체조회), POST /api/fund/get (단일조회), POST /api/fund (추가), PATCH /api/fund/:pageId (수정), DELETE /api/fund/:pageId (삭제)',
      customers: 'POST /api/customers/list (전체조회), POST /api/customers/get (단일조회), POST /api/customers (추가), PATCH /api/customers/:pageId (수정), DELETE /api/customers/:pageId (삭제), POST /api/customers/schema (스키마분석), POST /api/customers/crud-schema (CRUD스키마)',
      vendors: 'POST /api/vendors/list (전체조회), POST /api/vendors/get (단일조회), POST /api/vendors (추가), PATCH /api/vendors/:pageId (수정), DELETE /api/vendors/:pageId (삭제)',
      warehouses: 'POST /api/warehouses/list (전체조회), POST /api/warehouses/get (단일조회), POST /api/warehouses (추가), PATCH /api/warehouses/:pageId (수정), DELETE /api/warehouses/:pageId (삭제)',
      exchange: 'POST /api/exchange/list (전체조회), POST /api/exchange/get (단일조회), POST /api/exchange (추가), PATCH /api/exchange/:pageId (수정), DELETE /api/exchange/:pageId (삭제)',
      myanmarDelivery: 'POST /api/myanmar-delivery/list (전체조회), POST /api/myanmar-delivery/get (단일조회), POST /api/myanmar-delivery (추가), PATCH /api/myanmar-delivery/:pageId (수정), DELETE /api/myanmar-delivery/:pageId (삭제)',
      transactions: 'POST /api/transactions/list (전체조회), POST /api/transactions/get (단일조회), POST /api/transactions (추가), PATCH /api/transactions/:pageId (수정), DELETE /api/transactions/:pageId (삭제)',
      levels: 'POST /api/levels/list (전체조회), POST /api/levels/get (단일조회), POST /api/levels (추가), PATCH /api/levels/:pageId (수정), DELETE /api/levels/:pageId (삭제)',
      externalIds: 'POST /api/external-ids/list (전체조회), POST /api/external-ids/get (단일조회), POST /api/external-ids (추가), PATCH /api/external-ids/:pageId (수정), DELETE /api/external-ids/:pageId (삭제)',
    },
    documentation: 'README.md를 참고하세요',
  });
});

// 헬스 체크
app.get('/health', (req, res) => {
  const isValid = validateDatabaseIds();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database_config: isValid ? 'Valid' : 'Some IDs missing',
  });
});

// API 라우트 연결
app.use('/api/products', productsRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/fund', fundRouter);
app.use('/api/customers', customersRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/warehouses', warehousesRouter);
app.use('/api/exchange', exchangeRouter);
app.use('/api/myanmar-delivery', myanmarDeliveryRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/levels', levelsRouter);
app.use('/api/external-ids', externalIdsRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청하신 엔드포인트를 찾을 수 없습니다.',
    path: req.path,
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  logger.error('서버 에러:', err);
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;


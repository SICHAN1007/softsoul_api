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
      products: '/api/products (상품데이터)',
      shipping: '/api/shipping (배송데이터)',
      fund: '/api/fund (입금데이터)',
      customers: '/api/customers (구매자데이터)',
      vendors: '/api/vendors (구매처데이터)',
      warehouses: '/api/warehouses (배송처데이터)',
      exchange: '/api/exchange (환율데이터)',
      myanmarDelivery: '/api/myanmar-delivery (미얀마배송데이터)',
      transactions: '/api/transactions (입출금계좌데이터)',
      levels: '/api/levels (상태데이터)',
      externalIds: '/api/external-ids (외부ID데이터)',
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


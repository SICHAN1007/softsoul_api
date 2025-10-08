import dotenv from 'dotenv';
import app from './app.js';
import { logger } from './utils/logger.js';
import { validateDatabaseIds } from './config/notionClient.js';

// 환경변수 로드
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 서버 시작
const server = app.listen(PORT, () => {
  logger.success(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  logger.info(`📦 환경: ${NODE_ENV}`);
  logger.info(`🌐 URL: http://localhost:${PORT}`);
  logger.info('');
  
  // 데이터베이스 ID 검증
  const isValid = validateDatabaseIds();
  if (isValid) {
    logger.success('✅ 모든 데이터베이스 ID가 정상적으로 설정되었습니다.');
  } else {
    logger.warn('⚠️  일부 데이터베이스 ID가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }
  
  logger.info('');
  logger.info('📚 사용 가능한 엔드포인트:');
  logger.info('   - /api/products           (상품데이터)');
  logger.info('   - /api/shipping           (배송데이터)');
  logger.info('   - /api/fund               (입금데이터)');
  logger.info('   - /api/customers          (구매자데이터)');
  logger.info('   - /api/vendors            (구매처데이터)');
  logger.info('   - /api/warehouses         (배송처데이터)');
  logger.info('   - /api/exchange           (환율데이터)');
  logger.info('   - /api/myanmar-delivery   (미얀마배송데이터)');
  logger.info('   - /api/transactions       (입출금계좌데이터)');
  logger.info('   - /api/levels             (상태데이터)');
  logger.info('   - /api/external-ids       (외부ID데이터)');
  logger.info('');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`\n${signal} 신호를 받았습니다. 서버를 종료합니다...`);
  
  server.close(() => {
    logger.success('서버가 정상적으로 종료되었습니다.');
    process.exit(0);
  });
  
  // 강제 종료 (10초 후)
  setTimeout(() => {
    logger.error('강제 종료합니다.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 처리되지 않은 에러 핸들링
process.on('unhandledRejection', (reason, promise) => {
  logger.error('처리되지 않은 Promise 거부:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('처리되지 않은 예외:', error);
  process.exit(1);
});

export default server;


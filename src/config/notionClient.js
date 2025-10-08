import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 데이터베이스 ID 맵핑
export const DATABASE_IDS = {
  productData: process.env.PRODUCT_DATA,                    // 상품데이터
  shippingData: process.env.SHIPPING_DATA,                  // 배송데이터
  fundData: process.env.FUND_DATA,                          // 입금데이터
  customerData: process.env.CUSTOMER_DATA,                  // 구매자데이터
  vendorData: process.env.VENDOR_DATA,                      // 구매처데이터
  warehouseData: process.env.WAREHOUSE_DATA,                // 배송처데이터
  exchangeData: process.env.EXCHANGE_DATA,                  // 환율데이터
  myanmarDeliveryData: process.env.MYANMAR_DELIVERY_DATA,   // 미얀마배송데이터
  transactionDatabase: process.env.TRANSACTION_DATABASE,    // 입출금계좌데이터
  levelDatabase: process.env.LEVEL_DATABASE,                // 상태데이터
  externalIdData: process.env.EXTERNAL_ID_DATA,             // 외부ID데이터
};

// DB 이름 한글 매핑
export const DB_NAMES_KR = {
  productData: '상품데이터',
  shippingData: '배송데이터',
  fundData: '입금데이터',
  customerData: '구매자데이터',
  vendorData: '구매처데이터',
  warehouseData: '배송처데이터',
  exchangeData: '환율데이터',
  myanmarDeliveryData: '미얀마배송데이터',
  transactionDatabase: '입출금계좌데이터',
  levelDatabase: '상태데이터',
  externalIdData: '외부ID데이터',
};

// DB ID 유효성 검증
export const validateDatabaseIds = () => {
  const missingIds = [];
  
  for (const [key, value] of Object.entries(DATABASE_IDS)) {
    if (!value || value === 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      const koreanName = DB_NAMES_KR[key] || key;
      missingIds.push(`${key}(${koreanName})`);
    }
  }
  
  if (missingIds.length > 0) {
    console.warn(`⚠️  다음 데이터베이스 ID가 설정되지 않았습니다:\n   ${missingIds.join('\n   ')}`);
  }
  
  return missingIds.length === 0;
};

export default notion;


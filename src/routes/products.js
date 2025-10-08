import express from 'express';
import { createNotionService } from '../services/genericService.js';
import { DATABASE_IDS } from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const productsService = createNotionService(DATABASE_IDS.productData);

// ===== Properties 헬퍼 함수 =====

/**
 * Notion property 값 추출 헬퍼
 */
const extractPropertyValue = (property) => {
  if (!property) return null;
  
  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || '';
    case 'number':
      return property.number;
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      return property.multi_select?.map(s => s.name) || [];
    case 'date':
      return property.date;
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'formula':
      return property.formula;
    case 'relation':
      return property.relation;
    case 'rollup':
      return property.rollup;
    case 'created_time':
      return property.created_time;
    case 'created_by':
      return property.created_by;
    case 'last_edited_time':
      return property.last_edited_time;
    case 'last_edited_by':
      return property.last_edited_by;
    case 'unique_id':
      return property.unique_id;
    default:
      return property;
  }
};

/**
 * 모든 properties 값을 간단한 형태로 변환
 */
const simplifyProperties = (properties) => {
  if (!properties) return {};
  
  const simplified = {};
  for (const [key, value] of Object.entries(properties)) {
    simplified[key] = extractPropertyValue(value);
  }
  return simplified;
};

/**
 * Property 업데이트를 위한 포맷 생성
 */
const formatPropertyForUpdate = (propertyName, value, type) => {
  switch (type) {
    case 'title':
      return {
        title: [{ text: { content: String(value) } }]
      };
    case 'rich_text':
      return {
        rich_text: [{ text: { content: String(value) } }]
      };
    case 'number':
      return {
        number: Number(value)
      };
    case 'select':
      return {
        select: { name: String(value) }
      };
    case 'multi_select':
      return {
        multi_select: Array.isArray(value) ? value.map(v => ({ name: String(v) })) : []
      };
    case 'date':
      return {
        date: typeof value === 'string' ? { start: value } : value
      };
    case 'checkbox':
      return {
        checkbox: Boolean(value)
      };
    case 'url':
      return {
        url: String(value)
      };
    case 'email':
      return {
        email: String(value)
      };
    case 'phone_number':
      return {
        phone_number: String(value)
      };
    case 'relation':
      return {
        relation: Array.isArray(value) ? value.map(id => ({ id })) : []
      };
    default:
      return value;
  }
};

// ===== 기본 CRUD 엔드포인트 =====

// POST /api/products/list - 전체 조회
router.post('/list', async (req, res) => {
  try {
    const { filter, sorts, simplified = false } = req.body;
    
    const filterObj = filter || {};
    const sortsArr = sorts || [];
    
    const result = await productsService.getAllItems(filterObj, sortsArr);
    
    // simplified 옵션이 true면 properties를 간단한 형태로 변환
    if (simplified && result.success && result.data) {
      result.data = result.data.map(item => ({
        ...item,
        properties: simplifyProperties(item.properties)
      }));
    }
    
    res.json(result);
  } catch (error) {
    logger.error('상품데이터 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/products/get - 특정 항목 조회
router.post('/get', async (req, res) => {
  try {
    const { pageId, simplified = false } = req.body;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        error: 'pageId 필드가 필요합니다.',
      });
    }
    
    const result = await productsService.getItem(pageId);
    
    // simplified 옵션이 true면 properties를 간단한 형태로 변환
    if (simplified && result.success && result.data) {
      result.data.properties = simplifyProperties(result.data.properties);
    }
    
    res.json(result);
  } catch (error) {
    logger.error('상품데이터 항목 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/products - 항목 추가
router.post('/', async (req, res) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({
        success: false,
        error: 'properties 필드가 필요합니다.',
      });
    }
    
    const result = await productsService.addItem(properties);
    res.status(201).json(result);
  } catch (error) {
    logger.error('상품데이터 항목 추가 오류:', error);
    res.status(500).json(error);
  }
});

// PATCH /api/products/:pageId - 항목 업데이트
router.patch('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({
        success: false,
        error: 'properties 필드가 필요합니다.',
      });
    }
    
    const result = await productsService.updateItem(pageId, properties);
    res.json(result);
  } catch (error) {
    logger.error('상품데이터 항목 업데이트 오류:', error);
    res.status(500).json(error);
  }
});

// DELETE /api/products/:pageId - 항목 삭제(아카이브)
router.delete('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await productsService.deleteItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('상품데이터 항목 삭제 오류:', error);
    res.status(500).json(error);
  }
});

// ===== Properties 전용 CRUD 엔드포인트 =====

// GET /api/products/:pageId/properties - 특정 항목의 모든 properties 조회
router.get('/:pageId/properties', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { simplified = 'true' } = req.query;
    
    const result = await productsService.getItem(pageId);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    const properties = simplified === 'true' 
      ? simplifyProperties(result.data.properties)
      : result.data.properties;
    
    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    logger.error('Properties 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/:pageId/properties/:propertyName - 특정 property 조회
router.get('/:pageId/properties/:propertyName', async (req, res) => {
  try {
    const { pageId, propertyName } = req.params;
    const { simplified = 'true' } = req.query;
    
    const result = await productsService.getItem(pageId);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    const property = result.data.properties[propertyName];
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: `Property '${propertyName}'를 찾을 수 없습니다.`
      });
    }
    
    const value = simplified === 'true' 
      ? extractPropertyValue(property)
      : property;
    
    res.json({
      success: true,
      data: {
        name: propertyName,
        type: property.type,
        value: value
      }
    });
  } catch (error) {
    logger.error('Property 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/products/:pageId/properties - 특정 properties 업데이트
router.patch('/:pageId/properties', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { updates } = req.body;
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'updates 객체가 필요합니다. 예: { "상품명": { "type": "rich_text", "value": "새 상품명" } }'
      });
    }
    
    // updates를 Notion API 형식으로 변환
    const properties = {};
    for (const [propertyName, update] of Object.entries(updates)) {
      if (update.type && update.value !== undefined) {
        properties[propertyName] = formatPropertyForUpdate(propertyName, update.value, update.type);
      } else {
        // 이미 Notion 형식인 경우 그대로 사용
        properties[propertyName] = update;
      }
    }
    
    const result = await productsService.updateItem(pageId, properties);
    res.json(result);
  } catch (error) {
    logger.error('Properties 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/products/:pageId/properties/:propertyName - 단일 property 업데이트
router.patch('/:pageId/properties/:propertyName', async (req, res) => {
  try {
    const { pageId, propertyName } = req.params;
    const { type, value } = req.body;
    
    if (!type || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'type과 value 필드가 필요합니다.'
      });
    }
    
    const property = formatPropertyForUpdate(propertyName, value, type);
    
    const result = await productsService.updateItem(pageId, {
      [propertyName]: property
    });
    
    res.json(result);
  } catch (error) {
    logger.error('Property 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;


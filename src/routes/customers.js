import express from 'express';
import { createNotionService } from '../services/genericService.js';
import { DATABASE_IDS } from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const customersService = createNotionService(DATABASE_IDS.customerData);

// POST /api/customers/list - 전체 조회
router.post('/list', async (req, res) => {
  try {
    const { filter, sorts } = req.body;
    
    const filterObj = filter || {};
    const sortsArr = sorts || [];
    
    const result = await customersService.getAllItems(filterObj, sortsArr);
    res.json(result);
  } catch (error) {
    logger.error('구매자데이터 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/customers/get - 특정 항목 조회
router.post('/get', async (req, res) => {
  try {
    const { pageId } = req.body;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        error: 'pageId 필드가 필요합니다.',
      });
    }
    
    const result = await customersService.getItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('구매자데이터 항목 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/customers - 항목 추가
router.post('/', async (req, res) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({
        success: false,
        error: 'properties 필드가 필요합니다.',
      });
    }
    
    // 스키마 기반 검증
    const validation = await customersService.validateProperties(properties);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: '데이터 검증 실패',
        details: validation.errors,
        warnings: validation.warnings,
      });
    }
    
    const result = await customersService.addItem(properties);
    res.status(201).json(result);
  } catch (error) {
    logger.error('구매자데이터 항목 추가 오류:', error);
    res.status(500).json(error);
  }
});

// PATCH /api/customers/:pageId - 항목 업데이트
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
    
    const result = await customersService.updateItem(pageId, properties);
    res.json(result);
  } catch (error) {
    logger.error('구매자데이터 항목 업데이트 오류:', error);
    res.status(500).json(error);
  }
});

// DELETE /api/customers/:pageId - 항목 삭제(아카이브)
router.delete('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await customersService.deleteItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('구매자데이터 항목 삭제 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/customers/schema - 데이터베이스 스키마 분석
router.post('/schema', async (req, res) => {
  try {
    const schema = await customersService.analyzeSchema();
    res.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    logger.error('구매자데이터 스키마 분석 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/customers/crud-schema - CRUD 스키마 생성
router.post('/crud-schema', async (req, res) => {
  try {
    const crudSchema = await customersService.generateCRUDSchema();
    res.json({
      success: true,
      data: crudSchema,
    });
  } catch (error) {
    logger.error('구매자데이터 CRUD 스키마 생성 오류:', error);
    res.status(500).json(error);
  }
});

export default router;


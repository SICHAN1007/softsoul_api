import express from 'express';
import { createNotionService } from '../services/genericService.js';
import { DATABASE_IDS } from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const shippingService = createNotionService(DATABASE_IDS.shippingData);

// POST /api/shipping/list - 전체 조회
router.post('/list', async (req, res) => {
  try {
    const { filter, sorts } = req.body;
    
    const filterObj = filter || {};
    const sortsArr = sorts || [];
    
    const result = await shippingService.getAllItems(filterObj, sortsArr);
    res.json(result);
  } catch (error) {
    logger.error('배송데이터 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/shipping/get - 특정 항목 조회
router.post('/get', async (req, res) => {
  try {
    const { pageId } = req.body;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        error: 'pageId 필드가 필요합니다.',
      });
    }
    
    const result = await shippingService.getItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('배송데이터 항목 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/shipping - 항목 추가
router.post('/', async (req, res) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({
        success: false,
        error: 'properties 필드가 필요합니다.',
      });
    }
    
    const result = await shippingService.addItem(properties);
    res.status(201).json(result);
  } catch (error) {
    logger.error('배송데이터 항목 추가 오류:', error);
    res.status(500).json(error);
  }
});

// PATCH /api/shipping/:pageId - 항목 업데이트
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
    
    const result = await shippingService.updateItem(pageId, properties);
    res.json(result);
  } catch (error) {
    logger.error('배송데이터 항목 업데이트 오류:', error);
    res.status(500).json(error);
  }
});

// DELETE /api/shipping/:pageId - 항목 삭제(아카이브)
router.delete('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await shippingService.deleteItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('배송데이터 항목 삭제 오류:', error);
    res.status(500).json(error);
  }
});

export default router;


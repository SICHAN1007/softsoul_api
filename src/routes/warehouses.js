import express from 'express';
import { createNotionService } from '../services/genericService.js';
import { DATABASE_IDS } from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const warehousesService = createNotionService(DATABASE_IDS.warehouseData);

// GET /api/warehouses - 전체 조회
router.get('/', async (req, res) => {
  try {
    const { filter, sorts } = req.query;
    
    const filterObj = filter ? JSON.parse(filter) : {};
    const sortsArr = sorts ? JSON.parse(sorts) : [];
    
    const result = await warehousesService.getAllItems(filterObj, sortsArr);
    res.json(result);
  } catch (error) {
    logger.error('배송처데이터 조회 오류:', error);
    res.status(500).json(error);
  }
});

// GET /api/warehouses/:pageId - 특정 항목 조회
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await warehousesService.getItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('배송처데이터 항목 조회 오류:', error);
    res.status(500).json(error);
  }
});

// POST /api/warehouses - 항목 추가
router.post('/', async (req, res) => {
  try {
    const { properties } = req.body;
    
    if (!properties) {
      return res.status(400).json({
        success: false,
        error: 'properties 필드가 필요합니다.',
      });
    }
    
    const result = await warehousesService.addItem(properties);
    res.status(201).json(result);
  } catch (error) {
    logger.error('배송처데이터 항목 추가 오류:', error);
    res.status(500).json(error);
  }
});

// PATCH /api/warehouses/:pageId - 항목 업데이트
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
    
    const result = await warehousesService.updateItem(pageId, properties);
    res.json(result);
  } catch (error) {
    logger.error('배송처데이터 항목 업데이트 오류:', error);
    res.status(500).json(error);
  }
});

// DELETE /api/warehouses/:pageId - 항목 삭제(아카이브)
router.delete('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const result = await warehousesService.deleteItem(pageId);
    res.json(result);
  } catch (error) {
    logger.error('배송처데이터 항목 삭제 오류:', error);
    res.status(500).json(error);
  }
});

export default router;


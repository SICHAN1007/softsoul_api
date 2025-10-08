import notion from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

/**
 * 공통 Notion 데이터베이스 서비스 생성 함수
 * @param {string} databaseId - Notion 데이터베이스 ID
 * @returns {Object} - getAllItems, addItem 메서드를 포함한 서비스 객체
 */
export const createNotionService = (databaseId) => {
  /**
   * 데이터베이스의 모든 항목 조회
   * @param {Object} filters - Notion API 필터 객체 (선택사항)
   * @param {Object} sorts - Notion API 정렬 객체 (선택사항)
   * @returns {Promise<Array>} - 조회된 페이지 목록
   */
  const getAllItems = async (filters = {}, sorts = []) => {
    try {
      const queryOptions = {
        database_id: databaseId,
      };

      // 필터가 있으면 추가
      if (Object.keys(filters).length > 0) {
        queryOptions.filter = filters;
      }

      // 정렬이 있으면 추가
      if (sorts.length > 0) {
        queryOptions.sorts = sorts;
      }

      const response = await notion.databases.query(queryOptions);
      
      logger.debug(`데이터베이스 조회 성공: ${databaseId} (${response.results.length}개 항목)`);
      
      return {
        success: true,
        data: response.results,
        count: response.results.length,
        hasMore: response.has_more,
        nextCursor: response.next_cursor,
      };
    } catch (error) {
      logger.error(`데이터베이스 조회 실패: ${databaseId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'DATABASE_QUERY_ERROR',
      };
    }
  };

  /**
   * 데이터베이스에 새 항목 추가
   * @param {Object} properties - Notion 페이지 프로퍼티 객체
   * @returns {Promise<Object>} - 생성된 페이지 객체
   */
  const addItem = async (properties) => {
    try {
      const response = await notion.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties: properties,
      });
      
      logger.success(`데이터베이스에 항목 추가 성공: ${databaseId}`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logger.error(`데이터베이스 항목 추가 실패: ${databaseId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'PAGE_CREATE_ERROR',
      };
    }
  };

  /**
   * 특정 페이지 조회
   * @param {string} pageId - Notion 페이지 ID
   * @returns {Promise<Object>} - 페이지 객체
   */
  const getItem = async (pageId) => {
    try {
      const response = await notion.pages.retrieve({
        page_id: pageId,
      });
      
      logger.debug(`페이지 조회 성공: ${pageId}`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logger.error(`페이지 조회 실패: ${pageId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'PAGE_RETRIEVE_ERROR',
      };
    }
  };

  /**
   * 페이지 업데이트
   * @param {string} pageId - Notion 페이지 ID
   * @param {Object} properties - 업데이트할 프로퍼티 객체
   * @returns {Promise<Object>} - 업데이트된 페이지 객체
   */
  const updateItem = async (pageId, properties) => {
    try {
      const response = await notion.pages.update({
        page_id: pageId,
        properties: properties,
      });
      
      logger.success(`페이지 업데이트 성공: ${pageId}`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logger.error(`페이지 업데이트 실패: ${pageId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'PAGE_UPDATE_ERROR',
      };
    }
  };

  /**
   * 페이지 삭제 (아카이브)
   * @param {string} pageId - Notion 페이지 ID
   * @returns {Promise<Object>} - 삭제된 페이지 객체
   */
  const deleteItem = async (pageId) => {
    try {
      const response = await notion.pages.update({
        page_id: pageId,
        archived: true,
      });
      
      logger.success(`페이지 삭제(아카이브) 성공: ${pageId}`);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logger.error(`페이지 삭제 실패: ${pageId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'PAGE_DELETE_ERROR',
      };
    }
  };

  return {
    getAllItems,
    addItem,
    getItem,
    updateItem,
    deleteItem,
  };
};

export default createNotionService;


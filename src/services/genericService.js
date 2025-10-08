import notion from '../config/notionClient.js';
import { logger } from '../utils/logger.js';
import { DatabaseAnalyzer } from './databaseAnalyzer.js';

/**
 * 공통 Notion 데이터베이스 서비스 생성 함수
 * @param {string} databaseId - Notion 데이터베이스 ID
 * @returns {Object} - getAllItems, addItem 메서드를 포함한 서비스 객체
 */
export const createNotionService = (databaseId) => {
  const analyzer = new DatabaseAnalyzer(databaseId);
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

  /**
   * 데이터베이스 스키마 분석
   * @returns {Promise<Object>} - 분석된 스키마 정보
   */
  const analyzeSchema = async () => {
    return await analyzer.analyzeSchema();
  };

  /**
   * CRUD 스키마 생성
   * @returns {Promise<Object>} - CRUD 스키마
   */
  const generateCRUDSchema = async () => {
    return await analyzer.generateCRUDSchema();
  };

  /**
   * 스키마 기반 데이터 검증
   * @param {Object} properties - 검증할 properties
   * @returns {Promise<Object>} - 검증 결과
   */
  const validateProperties = async (properties) => {
    try {
      const schema = await analyzer.analyzeSchema();
      const validation = {
        valid: true,
        errors: [],
        warnings: [],
      };

      // 필수 필드 검증
      const requiredFields = Object.entries(schema.properties)
        .filter(([key, prop]) => prop.type === 'title')
        .map(([key, prop]) => key);

      requiredFields.forEach(field => {
        if (!properties[field] || (properties[field].title && !properties[field].title[0]?.text?.content)) {
          validation.valid = false;
          validation.errors.push(`필수 필드 '${field}'가 누락되었습니다.`);
        }
      });

      // 필드 타입 검증
      Object.entries(properties).forEach(([key, value]) => {
        const schemaProp = schema.properties[key];
        if (schemaProp) {
          const typeValidation = validatePropertyType(key, value, schemaProp);
          if (!typeValidation.valid) {
            validation.valid = false;
            validation.errors.push(...typeValidation.errors);
          }
          if (typeValidation.warnings.length > 0) {
            validation.warnings.push(...typeValidation.warnings);
          }
        } else {
          validation.warnings.push(`알 수 없는 필드 '${key}'가 무시됩니다.`);
        }
      });

      return validation;
    } catch (error) {
      logger.error('Properties 검증 실패:', error.message);
      return {
        valid: false,
        errors: ['스키마 분석 중 오류가 발생했습니다.'],
        warnings: [],
      };
    }
  };

  /**
   * 개별 Property 타입 검증
   * @param {String} key - 필드명
   * @param {*} value - 값
   * @param {Object} schemaProp - 스키마 속성
   * @returns {Object} - 검증 결과
   */
  const validatePropertyType = (key, value, schemaProp) => {
    const result = { valid: true, errors: [], warnings: [] };

    switch (schemaProp.type) {
      case 'title':
        if (!value.title || !Array.isArray(value.title) || !value.title[0]?.text?.content) {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 title 형식이어야 합니다.`);
        }
        break;
      case 'rich_text':
        if (!value.rich_text || !Array.isArray(value.rich_text)) {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 rich_text 형식이어야 합니다.`);
        }
        break;
      case 'number':
        if (value.number !== null && value.number !== undefined && typeof value.number !== 'number') {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 숫자여야 합니다.`);
        }
        break;
      case 'select':
        if (value.select && !value.select.name) {
          result.valid = false;
          result.errors.push(`'${key}' 필드의 select는 name 속성이 필요합니다.`);
        }
        break;
      case 'multi_select':
        if (value.multi_select && !Array.isArray(value.multi_select)) {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 multi_select 배열이어야 합니다.`);
        }
        break;
      case 'date':
        if (value.date && !value.date.start) {
          result.valid = false;
          result.errors.push(`'${key}' 필드의 date는 start 속성이 필요합니다.`);
        }
        break;
      case 'checkbox':
        if (value.checkbox !== null && value.checkbox !== undefined && typeof value.checkbox !== 'boolean') {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 boolean 값이어야 합니다.`);
        }
        break;
      case 'url':
        if (value.url && typeof value.url !== 'string') {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 문자열이어야 합니다.`);
        }
        break;
      case 'email':
        if (value.email && typeof value.email !== 'string') {
          result.valid = false;
          result.errors.push(`'${key}' 필드는 문자열이어야 합니다.`);
        }
        break;
    }

    return result;
  };

  return {
    getAllItems,
    addItem,
    getItem,
    updateItem,
    deleteItem,
    analyzeSchema,
    generateCRUDSchema,
    validateProperties,
  };
};

export default createNotionService;


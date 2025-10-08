import notion from '../config/notionClient.js';
import { logger } from '../utils/logger.js';

/**
 * Notion 데이터베이스 스키마 분석기
 */
export class DatabaseAnalyzer {
  constructor(databaseId) {
    this.databaseId = databaseId;
    this.schema = null;
    this.cache = new Map();
  }

  /**
   * 데이터베이스 스키마 분석
   * @returns {Promise<Object>} - 분석된 스키마 정보
   */
  async analyzeSchema() {
    try {
      // 캐시에서 확인
      if (this.cache.has('schema')) {
        return this.cache.get('schema');
      }

      // 데이터베이스 정보 조회
      const database = await notion.databases.retrieve({
        database_id: this.databaseId,
      });

      // 샘플 데이터 조회 (최대 10개)
      const sampleData = await notion.databases.query({
        database_id: this.databaseId,
        page_size: 10,
      });

      // Properties 분석
      const properties = this.analyzeProperties(database.properties);
      
      // 샘플 데이터에서 실제 값 타입 분석
      const valueTypes = this.analyzeValueTypes(sampleData.results);

      const schema = {
        databaseId: this.databaseId,
        title: database.title?.[0]?.plain_text || 'Unknown',
        properties: properties,
        valueTypes: valueTypes,
        sampleData: sampleData.results.slice(0, 3), // 처음 3개만 샘플로
        totalCount: sampleData.results.length,
        lastAnalyzed: new Date().toISOString(),
      };

      // 캐시에 저장 (5분간)
      this.cache.set('schema', schema);
      setTimeout(() => this.cache.delete('schema'), 5 * 60 * 1000);

      logger.info(`데이터베이스 스키마 분석 완료: ${schema.title}`);
      return schema;

    } catch (error) {
      logger.error(`데이터베이스 스키마 분석 실패: ${this.databaseId}`, error.message);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'SCHEMA_ANALYSIS_ERROR',
      };
    }
  }

  /**
   * Properties 구조 분석
   * @param {Object} properties - Notion 데이터베이스 properties
   * @returns {Object} - 분석된 properties 구조
   */
  analyzeProperties(properties) {
    const analyzed = {};

    for (const [key, property] of Object.entries(properties)) {
      analyzed[key] = {
        id: property.id,
        name: key,
        type: property.type,
        description: this.getPropertyDescription(property),
        required: false, // Notion에서는 모든 필드가 선택사항
        options: this.getPropertyOptions(property),
        validation: this.getPropertyValidation(property),
      };
    }

    return analyzed;
  }

  /**
   * Property 설명 생성
   * @param {Object} property - Notion property 객체
   * @returns {String} - 설명
   */
  getPropertyDescription(property) {
    const typeDescriptions = {
      title: '제목 필드',
      rich_text: '텍스트 필드',
      number: '숫자 필드',
      select: '선택 필드',
      multi_select: '다중 선택 필드',
      date: '날짜 필드',
      people: '사용자 필드',
      files: '파일 필드',
      checkbox: '체크박스 필드',
      url: 'URL 필드',
      email: '이메일 필드',
      phone_number: '전화번호 필드',
      formula: '수식 필드',
      relation: '관계 필드',
      rollup: '롤업 필드',
      created_time: '생성 시간',
      created_by: '생성자',
      last_edited_time: '수정 시간',
      last_edited_by: '수정자',
    };

    return typeDescriptions[property.type] || `${property.type} 필드`;
  }

  /**
   * Property 옵션 추출
   * @param {Object} property - Notion property 객체
   * @returns {Object} - 옵션 정보
   */
  getPropertyOptions(property) {
    const options = {};

    switch (property.type) {
      case 'select':
        options.choices = property.select?.options || [];
        break;
      case 'multi_select':
        options.choices = property.multi_select?.options || [];
        break;
      case 'number':
        options.format = property.number?.format || 'number';
        break;
      case 'date':
        options.format = 'date';
        break;
      case 'relation':
        options.database_id = property.relation?.database_id;
        break;
    }

    return options;
  }

  /**
   * Property 검증 규칙 생성
   * @param {Object} property - Notion property 객체
   * @returns {Object} - 검증 규칙
   */
  getPropertyValidation(property) {
    const validation = {
      type: property.type,
      required: false,
    };

    switch (property.type) {
      case 'title':
        validation.required = true;
        break;
      case 'number':
        validation.min = null;
        validation.max = null;
        break;
      case 'rich_text':
        validation.maxLength = null;
        break;
      case 'url':
        validation.pattern = '^https?://';
        break;
      case 'email':
        validation.pattern = '^[^@]+@[^@]+\\.[^@]+$';
        break;
    }

    return validation;
  }

  /**
   * 샘플 데이터에서 실제 값 타입 분석
   * @param {Array} sampleData - 샘플 데이터
   * @returns {Object} - 값 타입 분석 결과
   */
  analyzeValueTypes(sampleData) {
    const valueTypes = {};

    sampleData.forEach(page => {
      Object.entries(page.properties).forEach(([key, property]) => {
        if (!valueTypes[key]) {
          valueTypes[key] = {
            type: property.type,
            sampleValues: [],
            hasData: false,
          };
        }

        const value = this.extractPropertyValue(property);
        if (value !== null && value !== undefined && value !== '') {
          valueTypes[key].hasData = true;
          if (valueTypes[key].sampleValues.length < 3) {
            valueTypes[key].sampleValues.push(value);
          }
        }
      });
    });

    return valueTypes;
  }

  /**
   * Property에서 실제 값 추출
   * @param {Object} property - Notion property 객체
   * @returns {*} - 추출된 값
   */
  extractPropertyValue(property) {
    switch (property.type) {
      case 'title':
        return property.title?.[0]?.plain_text || '';
      case 'rich_text':
        return property.rich_text?.[0]?.plain_text || '';
      case 'number':
        return property.number;
      case 'select':
        return property.select?.name || '';
      case 'multi_select':
        return property.multi_select?.map(item => item.name) || [];
      case 'date':
        return property.date?.start || '';
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url || '';
      case 'email':
        return property.email || '';
      case 'phone_number':
        return property.phone_number || '';
      case 'created_time':
        return property.created_time;
      case 'created_by':
        return property.created_by?.name || '';
      case 'last_edited_time':
        return property.last_edited_time;
      case 'last_edited_by':
        return property.last_edited_by?.name || '';
      default:
        return null;
    }
  }

  /**
   * CRUD 스키마 생성
   * @returns {Promise<Object>} - CRUD 스키마
   */
  async generateCRUDSchema() {
    const schema = await this.analyzeSchema();
    
    return {
      database: {
        id: schema.databaseId,
        title: schema.title,
        description: `${schema.title} 데이터베이스 CRUD 스키마`,
      },
      operations: {
        create: {
          description: '새 항목 생성',
          requiredFields: this.getRequiredFields(schema.properties),
          optionalFields: this.getOptionalFields(schema.properties),
          example: this.generateCreateExample(schema.properties, schema.valueTypes),
        },
        read: {
          description: '항목 조회',
          filters: this.generateFilterOptions(schema.properties),
          sorts: this.generateSortOptions(schema.properties),
          example: this.generateReadExample(schema.properties),
        },
        update: {
          description: '항목 수정',
          updatableFields: this.getUpdatableFields(schema.properties),
          example: this.generateUpdateExample(schema.properties, schema.valueTypes),
        },
        delete: {
          description: '항목 삭제 (아카이브)',
          note: 'Notion에서는 실제 삭제가 아닌 아카이브 처리됩니다.',
        },
      },
      schema: schema,
    };
  }

  /**
   * 필수 필드 추출
   * @param {Object} properties - Properties 객체
   * @returns {Array} - 필수 필드 목록
   */
  getRequiredFields(properties) {
    return Object.entries(properties)
      .filter(([key, prop]) => prop.type === 'title')
      .map(([key, prop]) => key);
  }

  /**
   * 선택 필드 추출
   * @param {Object} properties - Properties 객체
   * @returns {Array} - 선택 필드 목록
   */
  getOptionalFields(properties) {
    return Object.entries(properties)
      .filter(([key, prop]) => prop.type !== 'title' && !prop.id.includes('created') && !prop.id.includes('last_edited'))
      .map(([key, prop]) => key);
  }

  /**
   * 수정 가능한 필드 추출
   * @param {Object} properties - Properties 객체
   * @returns {Array} - 수정 가능한 필드 목록
   */
  getUpdatableFields(properties) {
    return Object.entries(properties)
      .filter(([key, prop]) => !prop.id.includes('created') && !prop.id.includes('last_edited'))
      .map(([key, prop]) => key);
  }

  /**
   * 필터 옵션 생성
   * @param {Object} properties - Properties 객체
   * @returns {Object} - 필터 옵션
   */
  generateFilterOptions(properties) {
    const filters = {};

    Object.entries(properties).forEach(([key, prop]) => {
      filters[key] = {
        type: prop.type,
        description: prop.description,
        operators: this.getFilterOperators(prop.type),
      };
    });

    return filters;
  }

  /**
   * 필터 연산자 반환
   * @param {String} type - Property 타입
   * @returns {Array} - 사용 가능한 연산자
   */
  getFilterOperators(type) {
    const operators = {
      title: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
      rich_text: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
      number: ['equals', 'does_not_equal', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to', 'is_empty', 'is_not_empty'],
      select: ['equals', 'does_not_equal', 'is_empty', 'is_not_empty'],
      multi_select: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
      date: ['equals', 'before', 'after', 'on_or_before', 'on_or_after', 'past_week', 'past_month', 'past_year', 'next_week', 'next_month', 'next_year', 'is_empty', 'is_not_empty'],
      checkbox: ['equals', 'does_not_equal'],
      url: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
      email: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
    };

    return operators[type] || ['equals', 'does_not_equal', 'is_empty', 'is_not_empty'];
  }

  /**
   * 정렬 옵션 생성
   * @param {Object} properties - Properties 객체
   * @returns {Object} - 정렬 옵션
   */
  generateSortOptions(properties) {
    const sorts = {};

    Object.entries(properties).forEach(([key, prop]) => {
      if (['title', 'rich_text', 'number', 'date', 'created_time', 'last_edited_time'].includes(prop.type)) {
        sorts[key] = {
          type: prop.type,
          description: prop.description,
          directions: ['ascending', 'descending'],
        };
      }
    });

    return sorts;
  }

  /**
   * 생성 예시 생성
   * @param {Object} properties - Properties 객체
   * @param {Object} valueTypes - 값 타입 객체
   * @returns {Object} - 생성 예시
   */
  generateCreateExample(properties, valueTypes) {
    const example = {};

    Object.entries(properties).forEach(([key, prop]) => {
      if (prop.type === 'title') {
        example[key] = { title: [{ text: { content: '샘플 제목' } }] };
      } else if (valueTypes[key]?.hasData && valueTypes[key].sampleValues.length > 0) {
        example[key] = this.generateSampleValue(prop.type, valueTypes[key].sampleValues[0]);
      } else {
        example[key] = this.generateDefaultValue(prop.type);
      }
    });

    return example;
  }

  /**
   * 조회 예시 생성
   * @param {Object} properties - Properties 객체
   * @returns {Object} - 조회 예시
   */
  generateReadExample(properties) {
    return {
      filter: {
        property: Object.keys(properties)[0],
        [this.getFilterOperators(Object.values(properties)[0].type)[0]]: '값'
      },
      sorts: [{
        property: Object.keys(properties)[0],
        direction: 'descending'
      }]
    };
  }

  /**
   * 수정 예시 생성
   * @param {Object} properties - Properties 객체
   * @param {Object} valueTypes - 값 타입 객체
   * @returns {Object} - 수정 예시
   */
  generateUpdateExample(properties, valueTypes) {
    const example = {};

    Object.entries(properties).forEach(([key, prop]) => {
      if (prop.type !== 'title' && !prop.id.includes('created') && !prop.id.includes('last_edited')) {
        if (valueTypes[key]?.hasData && valueTypes[key].sampleValues.length > 0) {
          example[key] = this.generateSampleValue(prop.type, valueTypes[key].sampleValues[0]);
        } else {
          example[key] = this.generateDefaultValue(prop.type);
        }
      }
    });

    return example;
  }

  /**
   * 샘플 값 생성
   * @param {String} type - Property 타입
   * @param {*} sampleValue - 샘플 값
   * @returns {Object} - Notion API 형식의 값
   */
  generateSampleValue(type, sampleValue) {
    switch (type) {
      case 'title':
        return { title: [{ text: { content: sampleValue } }] };
      case 'rich_text':
        return { rich_text: [{ text: { content: sampleValue } }] };
      case 'number':
        return { number: sampleValue };
      case 'select':
        return { select: { name: sampleValue } };
      case 'multi_select':
        return { multi_select: sampleValue.map(name => ({ name })) };
      case 'date':
        return { date: { start: sampleValue } };
      case 'checkbox':
        return { checkbox: sampleValue };
      case 'url':
        return { url: sampleValue };
      case 'email':
        return { email: sampleValue };
      case 'phone_number':
        return { phone_number: sampleValue };
      default:
        return {};
    }
  }

  /**
   * 기본 값 생성
   * @param {String} type - Property 타입
   * @returns {Object} - 기본 값
   */
  generateDefaultValue(type) {
    switch (type) {
      case 'title':
        return { title: [{ text: { content: '' } }] };
      case 'rich_text':
        return { rich_text: [{ text: { content: '' } }] };
      case 'number':
        return { number: 0 };
      case 'select':
        return { select: null };
      case 'multi_select':
        return { multi_select: [] };
      case 'date':
        return { date: null };
      case 'checkbox':
        return { checkbox: false };
      case 'url':
        return { url: '' };
      case 'email':
        return { email: '' };
      case 'phone_number':
        return { phone_number: '' };
      default:
        return {};
    }
  }
}

export default DatabaseAnalyzer;

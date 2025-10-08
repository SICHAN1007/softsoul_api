# =================================
# Build Stage
# =================================
FROM node:18-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm ci --only=production

# =================================
# Runtime Stage
# =================================
FROM node:18-alpine

WORKDIR /app

# 보안을 위해 non-root 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# builder 스테이지에서 node_modules 복사
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# 소스 코드 복사
COPY --chown=nodejs:nodejs . .

# 사용자 전환
USER nodejs

# 포트 노출
EXPOSE 80

# 환경변수 설정
ENV NODE_ENV=production
ENV PORT=80

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80/api/products', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 서버 실행
CMD ["node", "src/server.js"]


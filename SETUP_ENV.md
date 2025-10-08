# 🔑 환경변수 설정 가이드

## 빠른 시작

### 1단계: .env 파일 생성

프로젝트 루트 폴더에서 아래 명령어 실행:

```bash
# PowerShell (Windows)
Copy-Item env.example .env

# 또는 직접 생성
New-Item .env -ItemType File
```

### 2단계: .env 파일 편집

생성된 `.env` 파일을 열고 실제 값으로 수정:

```env
# Notion API Key
NOTION_API_KEY=secret_여기에실제키입력

# Database IDs
DB1_ID=여기에실제DB_ID입력
DB2_ID=여기에실제DB_ID입력
DB3_ID=여기에실제DB_ID입력
DB4_ID=여기에실제DB_ID입력
DB5_ID=여기에실제DB_ID입력
DB6_ID=여기에실제DB_ID입력
DB7_ID=여기에실제DB_ID입력
DB8_ID=여기에실제DB_ID입력
DB9_ID=여기에실제DB_ID입력
DB10_ID=여기에실제DB_ID입력
DB11_ID=여기에실제DB_ID입력

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 📝 Notion API Key 발급

1. https://www.notion.so/my-integrations 접속
2. `+ New integration` 클릭
3. 이름 입력 후 `Submit`
4. **Internal Integration Token** 복사 (secret_로 시작)

---

## 📝 Database ID 확인

### 방법 1: URL에서 추출
```
https://www.notion.so/workspace/{이부분이DB_ID}?v=...
                                ^^^^^^^^^^^^^^^^
                                32자리 문자열
```

### 방법 2: Share 링크
1. 데이터베이스에서 `Share` 클릭
2. `Copy link` 클릭
3. URL에서 32자리 ID 추출

---

## ⚠️ 중요: Integration 연결

각 데이터베이스마다 다음 작업 필수:

1. 데이터베이스 페이지에서 `⋯` 메뉴 클릭
2. `+ Add connections` 선택
3. 생성한 Integration 선택
4. `Confirm` 클릭

**이 단계를 빠뜨리면 API가 작동하지 않습니다!**

---

## ✅ 설정 확인

```bash
npm run dev
```

성공 시:
```
🚀 서버가 포트 3000에서 실행 중입니다.
✅ 모든 데이터베이스 ID가 정상적으로 설정되었습니다.
```

---

## 🔒 보안 안내

- `.env` 파일은 절대 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)
- API Key는 비밀번호처럼 안전하게 보관하세요
- 공개 저장소에 절대 업로드하지 마세요


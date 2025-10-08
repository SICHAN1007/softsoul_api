# 🚀 Kubernetes 배포 가이드

이 문서는 `softsoul-api`를 Kubernetes 클러스터에 자동 배포하는 방법을 설명합니다.

## 📋 목차
- [사전 준비](#사전-준비)
- [GitHub Secrets 설정](#github-secrets-설정)
- [배포 프로세스](#배포-프로세스)
- [수동 배포](#수동-배포)
- [트러블슈팅](#트러블슈팅)

---

## 📦 사전 준비

### 1. Docker Hub 계정
- Docker Hub 계정이 필요합니다
- Repository: `<your-username>/softsoul-api`

### 2. Kubernetes 클러스터
- 접근 가능한 Kubernetes 클러스터가 필요합니다
- `kubectl` 명령어로 클러스터에 접근 가능해야 합니다

### 3. KUBECONFIG 파일
```bash
# kubeconfig 파일 내용 확인
cat ~/.kube/config
```

⚠️ **중요**: `~/.kube/config` 파일의 **원본 내용을 그대로** GitHub Secret에 저장하세요. Base64 인코딩은 **필요 없습니다**!

---

## 🔐 GitHub Secrets 설정

GitHub Repository → Settings → Secrets and variables → Actions에서 다음 Secrets를 추가하세요:

### Docker 관련
| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `DOCKER_USERNAME` | Docker Hub 사용자명 | `myusername` |
| `DOCKER_PASSWORD` | Docker Hub 비밀번호 또는 토큰 | `dckr_pat_xxx...` |

### Kubernetes 관련
| Secret 이름 | 설명 |
|------------|------|
| `KUBE_CONFIG` | kubeconfig 파일의 원본 내용 (base64 인코딩 불필요) |

### 환경변수 (Notion 데이터베이스 ID)
| Secret 이름 | 설명 |
|------------|------|
| `NOTION_API_KEY` | Notion API 키 |
| `CUSTOMER_DATA` | 구매자 데이터베이스 ID |
| `EXCHANGE_DATA` | 환율 데이터베이스 ID |
| `EXTERNAL_ID_DATA` | 외부 ID 데이터베이스 ID |
| `FUND_DATA` | 입금 데이터베이스 ID |
| `LEVEL_DATABASE` | 상태 데이터베이스 ID |
| `MYANMAR_DELIVERY_DATA` | 미얀마 배송 데이터베이스 ID |
| `PRODUCT_DATA` | 상품 데이터베이스 ID |
| `SHIPPING_DATA` | 배송 데이터베이스 ID |
| `TRANSACTION_DATABASE` | 입출금 계좌 데이터베이스 ID |
| `VENDOR_DATA` | 구매처 데이터베이스 ID |
| `WAREHOUSE_DATA` | 배송처 데이터베이스 ID |

---

## 🔄 배포 프로세스

### 자동 배포 (CI/CD)

`main` 브랜치에 코드를 푸시하면 자동으로 배포가 시작됩니다:

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

### 배포 단계
1. ✅ 코드 체크아웃
2. ✅ Node.js 의존성 설치 및 빌드 검증
3. ✅ Docker 이미지 빌드
4. ✅ Docker Hub에 이미지 푸시
5. ✅ Kubernetes 클러스터 연결
6. ✅ Deployment 및 Service 생성/업데이트
7. ✅ 배포 상태 확인

### GitHub Actions 확인
- Repository → Actions 탭에서 워크플로우 진행 상황을 확인할 수 있습니다

---

## 🛠️ 수동 배포

### 1. Docker 이미지 빌드 및 푸시
```bash
# 이미지 빌드
docker build -t <your-username>/softsoul-api:latest .

# Docker Hub 로그인
docker login

# 이미지 푸시
docker push <your-username>/softsoul-api:latest
```

### 2. Kubernetes Secrets 생성 (최초 1회만)
```bash
kubectl create secret generic softsoul-api-secrets \
  --from-literal=notion-api-key=YOUR_NOTION_API_KEY \
  --from-literal=customer-data=YOUR_CUSTOMER_DATA \
  --from-literal=exchange-data=YOUR_EXCHANGE_DATA \
  --from-literal=external-id-data=YOUR_EXTERNAL_ID_DATA \
  --from-literal=fund-data=YOUR_FUND_DATA \
  --from-literal=level-database=YOUR_LEVEL_DATABASE \
  --from-literal=myanmar-delivery-data=YOUR_MYANMAR_DELIVERY_DATA \
  --from-literal=product-data=YOUR_PRODUCT_DATA \
  --from-literal=shipping-data=YOUR_SHIPPING_DATA \
  --from-literal=transaction-database=YOUR_TRANSACTION_DATABASE \
  --from-literal=vendor-data=YOUR_VENDOR_DATA \
  --from-literal=warehouse-data=YOUR_WAREHOUSE_DATA
```

### 3. Deployment.yaml 수정
`k8s/deployment.yaml` 파일에서 `<DOCKER_USERNAME>`을 실제 Docker Hub 사용자명으로 변경:

```yaml
image: <your-username>/softsoul-api:latest
```

### 4. Kubernetes 리소스 배포
```bash
# Service 생성
kubectl apply -f k8s/service.yaml

# Deployment 생성
kubectl apply -f k8s/deployment.yaml

# 배포 상태 확인
kubectl rollout status deployment/softsoul-api
```

### 5. 배포 확인
```bash
# Pod 상태 확인
kubectl get pods -l app=softsoul-api

# Service 확인
kubectl get svc softsoul-api-service

# Logs 확인
kubectl logs -l app=softsoul-api --tail=100 -f
```

---

## 🔍 배포 확인

### Pod 상태 확인
```bash
kubectl get pods -l app=softsoul-api
```

예상 출력:
```
NAME                            READY   STATUS    RESTARTS   AGE
softsoul-api-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
softsoul-api-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
```

### Service 엔드포인트 확인
```bash
kubectl get svc softsoul-api-service
```

### Ingress 확인
```bash
kubectl get ingress main-ingress
```

기존 Ingress의 `/softsoul_api` 경로로 서비스가 연결되어 있어야 합니다.

---

## 🌐 접속 테스트

배포가 완료되면 다음 경로로 API에 접근할 수 있습니다:

```bash
# 예시 (실제 도메인은 Ingress 설정에 따라 다름)
curl https://your-domain.com/softsoul_api/api/products
```

### API 엔드포인트 목록
- `/softsoul_api/api/products` - 상품 데이터
- `/softsoul_api/api/shipping` - 배송 데이터
- `/softsoul_api/api/fund` - 입금 데이터
- `/softsoul_api/api/customers` - 구매자 데이터
- `/softsoul_api/api/vendors` - 구매처 데이터
- `/softsoul_api/api/warehouses` - 배송처 데이터
- `/softsoul_api/api/exchange` - 환율 데이터
- `/softsoul_api/api/myanmar-delivery` - 미얀마 배송 데이터
- `/softsoul_api/api/transactions` - 입출금 계좌 데이터
- `/softsoul_api/api/levels` - 상태 데이터
- `/softsoul_api/api/external-ids` - 외부 ID 데이터

---

## 🔧 트러블슈팅

### ImagePullBackOff 오류
```bash
# Docker Hub 인증 정보 확인
kubectl create secret docker-registry docker-hub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<your-username> \
  --docker-password=<your-password> \
  --docker-email=<your-email>

# Deployment에 imagePullSecrets 추가
# k8s/deployment.yaml의 spec.template.spec에 추가:
# imagePullSecrets:
# - name: docker-hub-secret
```

### CrashLoopBackOff 오류
```bash
# Pod 로그 확인
kubectl logs -l app=softsoul-api --tail=100

# Pod 상세 정보 확인
kubectl describe pod <pod-name>

# 환경변수 확인
kubectl exec <pod-name> -- env | grep -E "(NOTION|DATABASE)"

# 실시간 Pod 이벤트 확인
kubectl get events --sort-by='.lastTimestamp' | grep softsoul-api
```

### Deployment Timeout 오류
배포는 성공했지만 Pod가 Ready 상태가 되지 않는 경우:

```bash
# Pod 상태 확인
kubectl get pods -l app=softsoul-api -o wide

# 상태별 확인:
# - ImagePullBackOff: Docker 이미지를 가져오지 못함
# - CrashLoopBackOff: 컨테이너가 시작 후 계속 죽음
# - Pending: 리소스 부족 또는 스케줄링 불가

# Pod 상세 정보로 원인 파악
kubectl describe pod <pod-name>

# Pod 로그로 애플리케이션 오류 확인
kubectl logs <pod-name> --previous  # 이전 컨테이너 로그
kubectl logs <pod-name>              # 현재 컨테이너 로그

# 강제 재시작
kubectl rollout restart deployment/softsoul-api
```

**일반적인 원인:**
1. **환경변수 누락**: GitHub Secrets에 모든 환경변수가 설정되었는지 확인
2. **Notion API 오류**: NOTION_API_KEY가 올바른지 확인
3. **리소스 부족**: 클러스터에 충분한 CPU/메모리가 있는지 확인
4. **이미지 Pull 실패**: Docker Hub에 이미지가 올바르게 푸시되었는지 확인

### Service 연결 안 됨
```bash
# Service 엔드포인트 확인
kubectl get endpoints softsoul-api-service

# Pod 레이블 확인
kubectl get pods -l app=softsoul-api --show-labels

# Service와 Pod 연결 테스트
kubectl run test-pod --rm -i --tty --image=curlimages/curl -- sh
# Pod 내에서:
curl http://softsoul-api-service/api/products
```

### Secrets 확인
```bash
# Secrets 존재 여부 확인
kubectl get secrets softsoul-api-secrets

# Secrets 내용 확인 (디코딩)
kubectl get secret softsoul-api-secrets -o jsonpath='{.data.notion-api-key}' | base64 -d
```

### 배포 롤백
```bash
# 이전 버전으로 롤백
kubectl rollout undo deployment/softsoul-api

# 특정 리비전으로 롤백
kubectl rollout undo deployment/softsoul-api --to-revision=2

# 롤백 히스토리 확인
kubectl rollout history deployment/softsoul-api
```

### 리소스 삭제
```bash
# 모든 리소스 삭제
kubectl delete deployment softsoul-api
kubectl delete service softsoul-api-service
kubectl delete secret softsoul-api-secrets
```

---

## 📊 모니터링

### 리소스 사용량 확인
```bash
# Pod 리소스 사용량
kubectl top pods -l app=softsoul-api

# Node 리소스 사용량
kubectl top nodes
```

### 로그 모니터링
```bash
# 실시간 로그 확인
kubectl logs -f -l app=softsoul-api

# 최근 100줄 로그
kubectl logs -l app=softsoul-api --tail=100

# 특정 시간 이후 로그
kubectl logs -l app=softsoul-api --since=1h
```

### 이벤트 확인
```bash
# 전체 이벤트
kubectl get events --sort-by='.lastTimestamp'

# 특정 Pod 이벤트
kubectl describe pod <pod-name>
```

---

## 🔄 업데이트 전략

### Rolling Update (기본값)
- 무중단 배포
- 한 번에 하나씩 Pod 교체

### 수동 업데이트
```bash
# 이미지 업데이트
kubectl set image deployment/softsoul-api softsoul-api=<your-username>/softsoul-api:v2.0.0

# 배포 상태 확인
kubectl rollout status deployment/softsoul-api
```

---

## 📝 참고 사항

1. **환경변수 변경 시**: Secrets를 업데이트한 후 Pod를 재시작해야 합니다
   ```bash
   kubectl rollout restart deployment/softsoul-api
   ```

2. **이미지 태그 전략**: 
   - `latest` 태그는 개발/테스트용
   - 프로덕션에서는 버전 태그 사용 권장 (예: `v1.0.0`)

3. **리소스 제한**: 
   - CPU: 100m (request) ~ 200m (limit)
   - Memory: 128Mi (request) ~ 256Mi (limit)
   - 필요에 따라 조정 가능

4. **헬스체크**:
   - Liveness Probe: `/api/products` (30초 후 시작)
   - Readiness Probe: `/api/products` (10초 후 시작)

---

## 🆘 추가 도움

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Docker 공식 문서](https://docs.docker.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

**마지막 업데이트**: 2025년 10월 8일


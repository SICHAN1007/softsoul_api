# 🔧 배포 트러블슈팅 가이드

GitHub Actions에서 배포가 실패했을 때 문제를 진단하고 해결하는 방법입니다.

---

## 🚨 현재 문제: Deployment Timeout

### 증상
```
Waiting for deployment "softsoul-api" rollout to finish: 0 of 2 updated replicas are available...
error: timed out waiting for the condition
```

### 진단 방법

#### 1단계: GitHub Actions 로그 확인
최신 워크플로우 실행에서 **"Check Deployment Status"** 단계를 확인하세요.
다음 정보를 찾으세요:
- Pod Status (Running, Pending, CrashLoopBackOff, ImagePullBackOff 등)
- Pod Logs (애플리케이션 오류 메시지)
- Events (Kubernetes 이벤트)

#### 2단계: 직접 클러스터 확인
로컬에서 kubectl로 직접 확인:

```bash
# Pod 상태 확인
kubectl get pods -l app=softsoul-api -o wide

# 출력 예시:
# NAME                            READY   STATUS    RESTARTS   AGE
# softsoul-api-xxx-yyy            0/1     Running   0          2m
# softsoul-api-xxx-zzz            0/1     Pending   0          2m
```

**STATUS 별 의미:**
- `Running` but not READY (0/1): 헬스체크 실패 또는 애플리케이션 오류
- `ImagePullBackOff`: Docker 이미지를 가져올 수 없음
- `CrashLoopBackOff`: 컨테이너가 시작 후 계속 재시작됨
- `Pending`: 리소스 부족 또는 노드 선택 불가
- `ContainerCreating`: 이미지 다운로드 중 (정상)

#### 3단계: 상세 정보 확인

```bash
# Pod 상세 정보 (가장 중요!)
kubectl describe pod <pod-name>

# 맨 아래 Events 섹션에서 오류 원인 확인
```

**주요 확인 사항:**
- `Failed to pull image`: Docker Hub 접근 문제
- `Back-off restarting failed container`: 애플리케이션 크래시
- `Liveness probe failed`: 헬스체크 실패
- `Readiness probe failed`: 애플리케이션이 준비되지 않음
- `Insufficient cpu/memory`: 리소스 부족

#### 4단계: 애플리케이션 로그 확인

```bash
# 현재 로그
kubectl logs <pod-name>

# 이전 컨테이너 로그 (크래시한 경우)
kubectl logs <pod-name> --previous

# 실시간 로그
kubectl logs -f <pod-name>
```

---

## 🔍 문제별 해결 방법

### 문제 1: ImagePullBackOff

**원인:** Docker Hub에서 이미지를 가져올 수 없음

**해결:**
1. Docker Hub에 이미지가 존재하는지 확인
   ```bash
   # 로컬에서 확인
   docker pull <your-username>/softsoul-api:latest
   ```

2. 이미지가 Private이면 imagePullSecrets 설정 필요
   ```bash
   kubectl create secret docker-registry docker-hub-secret \
     --docker-server=https://index.docker.io/v1/ \
     --docker-username=<your-username> \
     --docker-password=<your-password>
   ```

3. Deployment에 추가 (k8s/deployment.yaml)
   ```yaml
   spec:
     template:
       spec:
         imagePullSecrets:
         - name: docker-hub-secret
         containers:
         - name: softsoul-api
           ...
   ```

### 문제 2: CrashLoopBackOff

**원인:** 애플리케이션이 시작 후 계속 종료됨

**해결:**

1. **환경변수 확인**
   ```bash
   # 실행 중인 Pod에서 환경변수 확인
   kubectl exec <pod-name> -- env | grep -E "(NOTION|PORT|NODE_ENV)"
   ```

   GitHub Secrets에서 누락된 환경변수가 있는지 확인:
   - `NOTION_API_KEY`
   - `CUSTOMER_DATA`, `EXCHANGE_DATA`, etc. (총 12개)

2. **로그에서 오류 찾기**
   ```bash
   kubectl logs <pod-name> --previous
   ```

   일반적인 오류:
   - `Cannot find module`: 의존성 설치 문제
   - `NOTION_API_KEY is not defined`: 환경변수 누락
   - `ECONNREFUSED`: Notion API 연결 실패
   - `Port 80 already in use`: 포트 충돌 (거의 없음)

3. **Notion API 키 테스트**
   ```bash
   # Notion API가 작동하는지 테스트
   curl -X GET https://api.notion.com/v1/users/me \
     -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28"
   ```

### 문제 3: Readiness Probe Failed

**원인:** `/api/products` 엔드포인트가 200 응답을 반환하지 않음

**해결:**

1. **Pod 내부에서 테스트**
   ```bash
   kubectl exec <pod-name> -- curl -s http://localhost:80/api/products
   ```

2. **Probe 시간 조정**
   
   현재 설정:
   - `initialDelaySeconds: 30` (30초 후 시작)
   - `periodSeconds: 10` (10초마다 체크)
   - `failureThreshold: 3` (3번 실패하면 재시작)

   더 긴 시작 시간이 필요하면 증가:
   ```yaml
   readinessProbe:
     initialDelaySeconds: 60  # 60초로 증가
   ```

3. **수동으로 재배포**
   ```bash
   kubectl rollout restart deployment/softsoul-api
   ```

### 문제 4: 리소스 부족 (Pending)

**원인:** 클러스터에 CPU/메모리가 부족

**해결:**

1. **노드 리소스 확인**
   ```bash
   kubectl top nodes
   kubectl describe nodes
   ```

2. **리소스 요청량 줄이기**
   ```yaml
   resources:
     requests:
       cpu: "50m"      # 100m → 50m
       memory: "64Mi"  # 128Mi → 64Mi
   ```

3. **Replicas 줄이기**
   ```yaml
   spec:
     replicas: 1  # 2 → 1
   ```

---

## 🎯 빠른 진단 체크리스트

배포 실패 시 다음을 순서대로 확인하세요:

- [ ] **GitHub Secrets 확인**
  - [ ] DOCKER_USERNAME, DOCKER_PASSWORD 설정됨
  - [ ] KUBE_CONFIG 설정됨 (원본 YAML, base64 인코딩 X)
  - [ ] NOTION_API_KEY 설정됨
  - [ ] 12개 데이터베이스 ID 모두 설정됨

- [ ] **Docker 이미지 확인**
  ```bash
  docker pull <your-username>/softsoul-api:latest
  ```

- [ ] **Kubernetes 연결 확인**
  ```bash
  kubectl cluster-info
  kubectl get nodes
  ```

- [ ] **Pod 상태 확인**
  ```bash
  kubectl get pods -l app=softsoul-api
  kubectl describe pod <pod-name>
  kubectl logs <pod-name>
  ```

- [ ] **Service 확인**
  ```bash
  kubectl get svc softsoul-api-service
  kubectl get endpoints softsoul-api-service
  ```

- [ ] **Ingress 확인**
  ```bash
  kubectl get ingress main-ingress
  ```

---

## 🔄 강제 재배포

모든 것을 다시 시작하고 싶을 때:

```bash
# 1. Deployment 삭제
kubectl delete deployment softsoul-api

# 2. Pod가 모두 종료될 때까지 대기
kubectl get pods -l app=softsoul-api

# 3. 재배포
kubectl apply -f k8s/deployment.yaml

# 4. 상태 확인
kubectl rollout status deployment/softsoul-api -w
```

또는 롤링 재시작:
```bash
kubectl rollout restart deployment/softsoul-api
```

---

## 📊 유용한 모니터링 명령어

### 실시간 모니터링
```bash
# Pod 상태 계속 확인
watch kubectl get pods -l app=softsoul-api

# 실시간 로그
kubectl logs -f -l app=softsoul-api

# 이벤트 모니터링
kubectl get events --watch
```

### 리소스 사용량
```bash
# Pod CPU/메모리 사용량
kubectl top pods -l app=softsoul-api

# 노드 리소스
kubectl top nodes
```

### 상세 정보
```bash
# 모든 리소스 한눈에 보기
kubectl get all -l app=softsoul-api

# YAML 형식으로 보기
kubectl get deployment softsoul-api -o yaml
```

---

## 🆘 긴급 롤백

새 버전에 문제가 있어서 이전 버전으로 되돌리려면:

```bash
# 이전 버전으로 롤백
kubectl rollout undo deployment/softsoul-api

# 롤백 히스토리 확인
kubectl rollout history deployment/softsoul-api

# 특정 리비전으로 롤백
kubectl rollout undo deployment/softsoul-api --to-revision=2
```

---

## 📞 추가 도움

위 방법으로 해결되지 않으면:

1. **GitHub Actions 로그 전체 복사**
   - Actions 탭 → 실패한 워크플로우 → "Check Deployment Status" 로그

2. **Pod 상세 정보 복사**
   ```bash
   kubectl describe pod <pod-name> > pod-debug.txt
   kubectl logs <pod-name> > pod-logs.txt
   ```

3. **클러스터 상태 확인**
   ```bash
   kubectl get all -n default > cluster-status.txt
   ```

이 정보들을 가지고 문제를 분석할 수 있습니다.

---

**마지막 업데이트**: 2025년 10월 8일


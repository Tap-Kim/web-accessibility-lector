# 🚀 빠른 시작 가이드

웹 접근성 실습 서버를 빠르게 시작하는 방법을 안내합니다.

## 📋 사전 요구사항

- **Node.js** (v14 이상) - [다운로드](https://nodejs.org)
- **Chrome 브라우저** (Lighthouse 사용)
- **터미널/명령 프롬프트** 액세스

## ⚡ 자동 설정 (권장)

```bash
# 1. 설정 스크립트 실행
./server-setup.sh

# 2. 1단계 서버 시작
npm run step1
```

## 🔧 수동 설정

### 1단계: 필요한 도구 설치

```bash
# http-server 설치 (로컬 서버용)
npm install -g http-server

# lighthouse 설치 (접근성 검사용)
npm install -g lighthouse

# concurrently 설치 (동시 실행용)
npm install -g concurrently
```

### 2단계: 서버 실행

#### 개별 단계 실행

```bash
# 1단계 실행 (포트 3001)
npm run step1

# 2단계 실행 (포트 3002)
npm run step2

# 3단계 실행 (포트 3003)
npm run step3

# 4단계 실행 (포트 3004)
npm run step4
```

#### 모든 단계 동시 실행

```bash
npm run all
```

## 🔍 Lighthouse 사용법

### 방법 1: Chrome DevTools 사용 (권장)

1. **서버 실행**

   ```bash
   npm run step1
   ```

2. **브라우저에서 접속**

   - http://localhost:3001 열기

3. **Lighthouse 실행**

   - F12 (개발자 도구 열기)
   - Lighthouse 탭 선택
   - Categories에서 **Accessibility** 체크
   - **Analyze page load** 클릭

4. **결과 확인**
   - 접근성 점수 확인 (0-100점)
   - 문제점 및 개선 방안 검토

### 방법 2: CLI 사용

```bash
# 개별 단계 검사
npm run lighthouse:step1
npm run lighthouse:step2
npm run lighthouse:step3
npm run lighthouse:step4

# 모든 단계 검사
npm run lighthouse
```

리포트는 `reports/` 폴더에 HTML 파일로 저장됩니다.

## 🌐 접속 URL

| 단계  | URL                   | 설명                  |
| ----- | --------------------- | --------------------- |
| 1단계 | http://localhost:3001 | 접근성 문제 많은 버전 |
| 2단계 | http://localhost:3002 | 기본 개선 버전        |
| 3단계 | http://localhost:3003 | 모범 사례 버전        |
| 4단계 | http://localhost:3004 | 고급 기능 버전        |

## 📊 실습 진행 순서

### 1️⃣ 1단계: 문제 발견

1. **서버 실행**: `npm run step1`
2. **Lighthouse 실행**: 접근성 점수 측정
3. **문제점 파악**: 낮은 점수의 원인 분석
4. **키보드 테스트**: Tab 키로만 내비게이션 시도

### 2️⃣ 2단계: 기본 개선

1. **서버 실행**: `npm run step2`
2. **점수 비교**: 1단계와 비교해 개선도 확인
3. **코드 비교**: 어떤 부분이 개선되었는지 확인

### 3️⃣ 3단계: 모범 사례

1. **서버 실행**: `npm run step3`
2. **고득점 확인**: 90점 이상 달성 확인
3. **WCAG 준수**: 체크리스트로 확인

### 4️⃣ 4단계: 고급 기능

1. **서버 실행**: `npm run step4`
2. **완벽한 점수**: 95점 이상 목표
3. **고급 기능**: 접근성 도구 모음 체험

## 🔧 문제 해결

### 포트 충돌 시

```bash
# 특정 포트로 실행
npx http-server step1-problems -p 8001 -o
```

### 권한 오류 시 (Mac/Linux)

```bash
# sudo 없이 전역 설치
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Node.js 미설치 시

1. [Node.js 공식 사이트](https://nodejs.org) 방문
2. LTS 버전 다운로드 및 설치
3. 터미널 재시작 후 `node --version` 확인

## 🎯 학습 목표별 가이드

### 🔰 초보자

- 1-2단계 중심 실습
- Lighthouse 사용법 숙지
- 기본 접근성 개념 이해

### 🔥 중급자

- 2-3단계 비교 분석
- WCAG 가이드라인 학습
- 스크린 리더 테스트

### 🚀 고급자

- 3-4단계 고급 기능 분석
- 자동화된 접근성 테스트
- 커스텀 접근성 기능 구현

## 📞 도움말

### 키보드 단축키

- **Ctrl+K**: 검색창 열기 (3-4단계)
- **Alt+1,2,3**: 메뉴 바로가기 (4단계)
- **ESC**: 모달/드롭다운 닫기
- **Tab/Shift+Tab**: 포커스 이동

### 주요 테스트 포인트

- ✅ 모든 기능이 키보드로 접근 가능한가?
- ✅ 이미지에 적절한 대체 텍스트가 있는가?
- ✅ 폼 필드에 라벨이 연결되어 있는가?
- ✅ 색상 대비가 충분한가?
- ✅ 스크린 리더로 내용을 이해할 수 있는가?

---

💡 **팁**: 실습 중 문제가 발생하면 `accessibility-checklist.md` 파일을 참고하세요!

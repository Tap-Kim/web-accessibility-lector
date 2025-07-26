# 🌐 웹 접근성 실습 프로젝트

웹 접근성(Web Accessibility) 학습을 위한 단계별 실습 자료입니다.  
각 단계별로 접근성 문제를 발견하고 개선하는 과정을 체험할 수 있습니다.

## 📚 실습 구조

```
lector/
├── README.md                    # 프로젝트 가이드
├── step1-problems/             # 1단계: 접근성 문제 많은 버전
│   ├── index.html
│   ├── style.css
│   └── script.js
├── step2-basic-fix/            # 2단계: 기본적인 개선
│   ├── index.html
│   ├── style.css
│   └── script.js
├── step3-good-practice/        # 3단계: 모범 사례 적용
│   ├── index.html
│   ├── style.css
│   └── script.js
├── step4-advanced/             # 4단계: 고급 접근성 기능
│   ├── index.html
│   ├── style.css
│   └── script.js
└── accessibility-checklist.md  # 접근성 체크리스트
```

## 🎯 학습 목표

1. **웹 접근성의 중요성** 이해하기
2. **WCAG 2.1 가이드라인** 적용하기
3. **Lighthouse 접근성 점수** 개선하기
4. **스크린 리더 호환성** 확보하기
5. **키보드 내비게이션** 지원하기

## 🚀 실습 진행 방법

### 1단계: 문제 발견하기

- `step1-problems/index.html` 파일 열기
- Lighthouse 접근성 검사 실행
- 발견된 문제점들 기록하기

### 2단계: 기본 개선하기

- `step2-basic-fix/index.html` 비교
- 어떤 부분이 개선되었는지 확인
- Lighthouse 점수 변화 측정

### 3단계: 모범 사례 적용하기

- `step3-good-practice/index.html` 분석
- WCAG 가이드라인 적용 사례 학습
- 접근성 점수 90점 이상 달성

### 4단계: 고급 기능 구현하기

- `step4-advanced/index.html` 체험
- ARIA 속성 활용법 학습
- 복잡한 UI 컴포넌트 접근성 구현

## 🔧 도구 및 테스트

### 필수 도구

- **Chrome DevTools Lighthouse**
- **Chrome DevTools Accessibility Tree**
- **axe DevTools** (브라우저 확장)

### 테스트 방법

1. **자동화 테스트**: Lighthouse, axe
2. **키보드 테스트**: Tab, Enter, Space, Arrow keys
3. **스크린 리더 테스트**: NVDA, JAWS, VoiceOver

## 📋 주요 학습 포인트

### WCAG 2.1 원칙

- **Perceivable (인식 가능)**: 대체 텍스트, 색상 대비
- **Operable (조작 가능)**: 키보드 접근성, 시간 제한
- **Understandable (이해 가능)**: 명확한 언어, 예측 가능한 기능
- **Robust (견고함)**: 다양한 보조 기술 호환성

### 실습 중점 영역

- 🏷️ **의미적 HTML** 사용
- 🎨 **색상 대비** 최적화
- ⌨️ **키보드 내비게이션** 지원
- 🔊 **스크린 리더** 호환성
- 📱 **반응형 접근성** 구현

## 🎓 강사용 가이드

### 수업 진행 순서

1. **이론 설명** (20분): 웹 접근성 개요
2. **1단계 실습** (15분): 문제 발견 및 분석
3. **2-3단계 실습** (30분): 단계적 개선
4. **4단계 실습** (20분): 고급 기능 체험
5. **정리 및 Q&A** (15분)

### 평가 기준

- Lighthouse 접근성 점수 개선도
- WCAG 가이드라인 이해도
- 실제 접근성 도구 사용 능력

---

💡 **팁**: 각 단계별로 Lighthouse 점수를 측정하고 비교해보세요!  
📞 **문의**: 실습 중 궁금한 점이 있으면 언제든 질문해주세요.
# web-accessibility-lector

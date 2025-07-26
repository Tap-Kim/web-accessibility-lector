#!/bin/bash

# 웹 접근성 실습 서버 설정 스크립트
echo "🚀 웹 접근성 실습 서버 설정을 시작합니다..."

# Node.js 설치 확인
if command -v node &> /dev/null; then
    echo "✅ Node.js가 설치되어 있습니다. ($(node --version))"
else
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "https://nodejs.org 에서 Node.js를 설치해주세요."
    exit 1
fi

# npm 설치 확인
if command -v npm &> /dev/null; then
    echo "✅ npm이 설치되어 있습니다. ($(npm --version))"
else
    echo "❌ npm이 설치되어 있지 않습니다."
    exit 1
fi

# 필요한 전역 패키지 설치
echo "📦 필요한 도구들을 설치합니다..."

# http-server 설치
if ! command -v http-server &> /dev/null; then
    echo "⬇️ http-server 설치 중..."
    npm install -g http-server
else
    echo "✅ http-server가 이미 설치되어 있습니다."
fi

# lighthouse 설치
if ! command -v lighthouse &> /dev/null; then
    echo "⬇️ lighthouse 설치 중..."
    npm install -g lighthouse
else
    echo "✅ lighthouse가 이미 설치되어 있습니다."
fi

# concurrently 설치
if ! npm list -g concurrently &> /dev/null; then
    echo "⬇️ concurrently 설치 중..."
    npm install -g concurrently
else
    echo "✅ concurrently가 이미 설치되어 있습니다."
fi

# reports 디렉토리 생성
mkdir -p reports
echo "📁 reports 디렉토리를 생성했습니다."

# .gitignore 파일 생성 (필요한 경우)
if [ ! -f .gitignore ]; then
    cat > .gitignore << EOL
# 의존성
node_modules/
npm-debug.log*

# 리포트 파일들
reports/*.html
reports/*.json

# 시스템 파일
.DS_Store
Thumbs.db

# 에디터 설정
.vscode/
.idea/

# 임시 파일
*.tmp
*.temp
EOL
    echo "📝 .gitignore 파일을 생성했습니다."
fi

echo ""
echo "🎉 설정이 완료되었습니다!"
echo ""
echo "📋 사용 가능한 명령어:"
echo "   npm start          - 사용 가능한 명령어 보기"
echo "   npm run step1      - 1단계 서버 실행 (포트 3001)"
echo "   npm run step2      - 2단계 서버 실행 (포트 3002)" 
echo "   npm run step3      - 3단계 서버 실행 (포트 3003)"
echo "   npm run step4      - 4단계 서버 실행 (포트 3004)"
echo "   npm run all        - 모든 단계 동시 실행"
echo "   npm run lighthouse - 모든 단계 Lighthouse 검사"
echo ""
echo "🔍 Lighthouse 사용법:"
echo "   1. 서버 실행: npm run step1"
echo "   2. 브라우저에서 F12 -> Lighthouse 탭"
echo "   3. Accessibility 체크박스 선택 후 분석"
echo ""
echo "🌐 접속 URL:"
echo "   1단계: http://localhost:3001"
echo "   2단계: http://localhost:3002"
echo "   3단계: http://localhost:3003"
echo "   4단계: http://localhost:3004" 
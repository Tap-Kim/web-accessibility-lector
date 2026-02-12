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

# Node.js 버전 확인 (Lighthouse 최신 버전 기준)
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js 18 이상이 필요합니다. 현재 버전: $(node --version)"
    echo "https://nodejs.org 에서 LTS 버전을 설치해주세요."
    exit 1
fi

# 로컬 의존성 설치
echo "📦 로컬 의존성 설치 중 (http-server, lighthouse, concurrently, start-server-and-test)..."
npm install

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
echo "   npm run audit:step1 - 1단계 Lighthouse 자동 검사"
echo "   npm run audit:all  - 모든 단계 Lighthouse 자동 검사"
echo ""
echo "🔍 Lighthouse 자동 검사 사용법:"
echo "   1. 1단계 검사: npm run audit:step1"
echo "   2. 전체 검사: npm run audit:all"
echo "   3. 결과 확인: reports/*.html"
echo ""
echo "🌐 접속 URL:"
echo "   1단계: http://localhost:3001"
echo "   2단계: http://localhost:3002"
echo "   3단계: http://localhost:3003"
echo "   4단계: http://localhost:3004" 

#!/bin/bash

# Ponpoco Game - Clean Script
# 개발 환경 정리를 위한 Bash 스크립트

echo "🧹 Ponpoco Game - Clean Environment"
echo "=================================="

# node_modules 삭제
if [ -d "node_modules" ]; then
    echo "📦 node_modules 삭제 중..."
    rm -rf node_modules
    echo "✅ node_modules 삭제 완료"
else
    echo "ℹ️ node_modules가 이미 없습니다."
fi

# package-lock.json 삭제
if [ -f "package-lock.json" ]; then
    echo "🔒 package-lock.json 삭제 중..."
    rm package-lock.json
    echo "✅ package-lock.json 삭제 완료"
else
    echo "ℹ️ package-lock.json이 이미 없습니다."
fi

# Azure 임시 파일들 삭제
if [ -d ".azure" ]; then
    echo "☁️ Azure 임시 파일 삭제 중..."
    rm -rf .azure
    echo "✅ .azure 디렉토리 삭제 완료"
else
    echo "ℹ️ .azure 디렉토리가 이미 없습니다."
fi

# 로그 파일들 삭제
echo "📄 로그 파일 정리 중..."
find . -name "*.log" -type f -delete 2>/dev/null
find . -name "npm-debug.log*" -type f -delete 2>/dev/null

echo ""
echo "🎮 다시 설정하려면:"
echo "   npm run setup    # 환경 재설정"
echo ""
echo "✨ 정리 완료!"
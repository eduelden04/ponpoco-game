#!/bin/bash

# Ponpoco Game - Setup Script
# 개발 환경 설정을 위한 Bash 스크립트

echo "🦝 Ponpoco Game - Development Setup"
echo "=================================="

# Node.js 버전 확인
echo "📦 Node.js 버전 확인..."
node --version
npm --version

# 의존성 설치
echo "📥 의존성 설치 중..."
npm install

# Azure CLI 로그인 상태 확인
echo "☁️ Azure 로그인 상태 확인..."
if az account show &>/dev/null; then
    echo "✅ Azure CLI에 이미 로그인되어 있습니다."
    az account show --query "name" -o tsv
else
    echo "❌ Azure CLI 로그인이 필요합니다."
    echo "   npm run azure-login 을 실행하세요."
fi

# azd 로그인 상태 확인
echo "🚀 Azure Developer CLI 상태 확인..."
if azd auth login --check-status &>/dev/null; then
    echo "✅ azd에 이미 로그인되어 있습니다."
else
    echo "❌ azd 로그인이 필요합니다."
    echo "   npm run azure-login 을 실행하세요."
fi

# 프로젝트 구조 확인
echo "📁 프로젝트 구조 확인..."
if [ -d "ponpoco-game" ]; then
    echo "✅ ponpoco-game 디렉토리 존재"
else
    echo "❌ ponpoco-game 디렉토리가 없습니다."
fi

if [ -f "azure.yaml" ]; then
    echo "✅ azure.yaml 파일 존재"
else
    echo "❌ azure.yaml 파일이 없습니다."
fi

echo ""
echo "🎮 게임 실행 방법:"
echo "   npm start        # 게임 서버 시작 (포트 3000)"
echo "   npm run deploy   # Azure에 배포"
echo ""
echo "✨ 설정 완료!"
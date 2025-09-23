#!/bin/bash

# Ponpoco Game - Deploy Script
# Azure 배포를 위한 Bash 스크립트

echo "🚀 Ponpoco Game - Azure Deployment"
echo "=================================="

# 로그인 상태 확인
echo "🔐 Azure 로그인 상태 확인..."
if ! azd auth login --check-status &>/dev/null; then
    echo "❌ Azure Developer CLI에 로그인이 필요합니다."
    echo "🔑 디바이스 코드 인증을 시작합니다..."
    azd auth login --use-device-code
    
    if [ $? -ne 0 ]; then
        echo "❌ 로그인에 실패했습니다."
        exit 1
    fi
else
    echo "✅ 이미 로그인되어 있습니다."
fi

echo ""

# 환경 초기화 (처음 배포시)
if [ ! -f ".azure/env/.env" ]; then
    echo "🏗️ 새로운 환경을 초기화합니다..."
    azd init --template minimal
fi

# 배포 실행
echo "📦 Azure에 배포 중..."
echo "⏳ 이 과정은 몇 분이 걸릴 수 있습니다..."

azd up

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 배포 성공!"
    echo "🌐 게임 URL:"
    azd show --output json | grep -o '"endpoint":"[^"]*' | cut -d'"' -f4
    echo ""
    echo "📊 모니터링:"
    echo "   azd monitor     # 모니터링 대시보드 열기"
    echo "   azd logs        # 애플리케이션 로그 보기"
else
    echo ""
    echo "❌ 배포에 실패했습니다."
    echo "🔍 오류 해결을 위해 로그를 확인하세요:"
    echo "   azd logs"
    exit 1
fi
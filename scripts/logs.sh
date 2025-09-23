#!/bin/bash

# Ponpoco Game - Logs Script
# Azure 및 애플리케이션 로그 확인을 위한 Bash 스크립트

echo "📋 Ponpoco Game - Logs Viewer"
echo "============================="

# 현재 Azure 계정 정보
echo "☁️ Azure 계정 정보:"
if az account show &>/dev/null; then
    az account show --query "{name:name, id:id, tenantId:tenantId}" -o table
else
    echo "❌ Azure에 로그인되어 있지 않습니다."
    echo "   npm run azure-login 을 실행하세요."
    exit 1
fi

echo ""

# azd 환경 정보
echo "🚀 Azure Developer CLI 환경:"
if azd env list &>/dev/null; then
    azd env list
else
    echo "❌ azd 환경이 설정되어 있지 않습니다."
    echo "   azd init 을 실행하여 환경을 설정하세요."
fi

echo ""

# 최근 배포 정보 (있다면)
echo "📦 최근 배포 정보:"
if [ -f ".azure/env/.env" ]; then
    echo "✅ 환경 파일이 존재합니다."
    grep -E "AZURE_|APP_" .azure/env/.env 2>/dev/null || echo "환경 변수가 설정되지 않았습니다."
else
    echo "ℹ️ 아직 배포된 환경이 없습니다."
fi

echo ""

# GitHub Actions 로그 (로컬에서는 확인 불가)
echo "🔧 GitHub Actions:"
echo "ℹ️ GitHub Actions 로그는 GitHub 웹사이트에서 확인하세요."
echo "   https://github.com/your-username/ponpoco-game/actions"

echo ""
echo "🎮 유용한 명령어들:"
echo "   azd logs          # Azure 애플리케이션 로그"
echo "   azd monitor       # 모니터링 대시보드 열기"
echo "   az webapp log tail --name <app-name> --resource-group <rg-name>"
echo ""
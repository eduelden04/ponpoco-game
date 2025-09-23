#!/bin/bash

echo "🦝 Ponpoco Game - Azure 배포 설정 스크립트"
echo "============================================="

# azd 설치 확인
echo "🔍 Azure Developer CLI (azd) 설치 확인 중..."
if ! command -v azd &> /dev/null; then
    echo "❌ azd가 설치되어 있지 않습니다."
    echo "📦 Azure Developer CLI 설치 중..."
    
    # Linux/WSL용 azd 설치
    curl -fsSL https://aka.ms/install-azd.sh | bash
    
    # 설치 완료 확인
    if command -v azd &> /dev/null; then
        echo "✅ Azure Developer CLI 설치 완료!"
    else
        echo "❌ 설치 실패. 수동으로 설치해주세요: https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd"
        exit 1
    fi
else
    echo "✅ Azure Developer CLI가 이미 설치되어 있습니다."
    azd version
fi

echo ""
echo "🔐 Azure 로그인"
echo "==============="
echo "다음 명령어로 Azure에 로그인하세요:"
echo ""
echo "azd auth login --use-device-code"
echo ""
echo "📝 로그인 후 다음 명령어로 배포하세요:"
echo "azd up"
echo ""
echo "🎮 로컬 테스트는 다음 명령어로:"
echo "npm start"
echo ""
echo "🌐 게임이 http://localhost:3000 에서 실행됩니다."
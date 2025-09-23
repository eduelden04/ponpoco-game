# 🦝 Ponpoco Game - 빠른 시작 가이드

## 🚀 GitHub Codespaces에서 바로 시작하기

### 1단계: Codespace 생성
- GitHub 리포지토리에서 `Code` → `Codespaces` → `Create codespace on main` 클릭

### 2단계: 게임 실행
```bash
npm start
```

### 3단계: Azure 배포 (선택사항)
```bash
# Azure 로그인 (디바이스 코드 방식)
npm run azure-login

# 배포
npm run deploy
```

## 💡 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm start` | 게임을 로컬에서 실행 (포트 3000) |
| `npm run setup-azure` | Azure CLI 설치 및 설정 |
| `npm run azure-login` | Azure 디바이스 코드 로그인 |
| `npm run deploy` | Azure에 게임 배포 |

## 🎮 게임 조작법

- `←→`: 이동
- `↑`: 점프 (2단 점프 가능)
- `SPACE`: 돌 던지기
- `P`: 일시정지

## 🔗 유용한 링크

- [Azure Portal](https://portal.azure.com)
- [디바이스 로그인](https://microsoft.com/devicelogin)
- [Azure Developer CLI 문서](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/)

---

**🎯 목표: 귀여운 너구리와 함께 스테이지를 클리어하세요!**
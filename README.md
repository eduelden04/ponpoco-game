# 🦝 Ponpoco Game - Retro Platform Adventure

클래식한 8비트 스타일의 2D 플랫폼 게임! 귀여운 너구리 캐릭터로 다양한 장애물을 피하고 아이템을 수집하는 레트로 게임입니다.

[![Deploy to Azure Static Web Apps](https://img.shields.io/badge/Deploy%20to-Azure%20Static%20Web%20Apps-blue)](https://portal.azure.com/#create/Microsoft.StaticApp)
[![GitHub Codespaces](https://img.shields.io/badge/GitHub-Codespaces-181717?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main)

## 🎮 게임 특징

- **귀여운 너구리 캐릭터**: 폰포코 스타일의 사랑스러운 너구리
- **이단 점프**: 공중에서 한 번 더 점프 가능
- **아이템 수집**: 과일과 동전 수집으로 점수 획득
- **레트로 스타일**: 8비트 픽셀 아트와 클래식 게임플레이
- **부드러운 애니메이션**: 걷기, 점프, 꼬리 흔들기 등

## 🕹️ 게임 조작법

| 키 | 동작 |
|---|---|
| `←` `→` | 이동 |
| `↑` | 점프 (이단 점프 지원) |
| `↓` | 플랫폼 아래로 떨어지기 |
| `스페이스` | 돌 던지기 |
| `P` | 일시정지 |

## 🚀 빠른 시작

### GitHub Codespaces에서 실행
1. 이 저장소의 **Code** 버튼 → **Codespaces** → **Create codespace** 클릭
2. Codespace가 준비되면:
   ```bash
   npm start
   ```
3. 포트 3000이 자동으로 포워딩되어 브라우저에서 게임 실행

### 로컬에서 실행
```bash
# 저장소 클론
git clone https://github.com/asomi7007/ponpoco-game.git
cd ponpoco-game

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## ☁️ Azure Static Web Apps 배포

### 방법 1: Azure Portal에서 배포 (추천)

1. **Azure Portal** 접속 → **Static Web Apps** → **만들기**

2. **기본 정보 설정**:
   - 구독: 본인의 Azure 구독 선택
   - 리소스 그룹: 새로 만들거나 기존 그룹 선택
   - 이름: `ponpoco-game` (또는 원하는 이름)
   - 지역: `Korea Central`

3. **배포 세부 정보**:
   - 배포 원본: **GitHub**
   - GitHub 계정 연결
   - 조직: 본인 계정
   - 리포지토리: `ponpoco-game`
   - 분기: `main`

4. **빌드 세부 정보**:
   - 빌드 사전 설정: **사용자 지정**
   - 앱 위치: `/`
   - API 위치: (비워둠)
   - 출력 위치: (비워둠)

5. **검토 + 만들기** → **만들기** 클릭

### 방법 2: GitHub Actions 자동 배포

저장소가 Azure Static Web Apps와 연결되면 GitHub Actions가 자동으로 설정됩니다:

- 코드를 `main` 브랜치에 푸시할 때마다 자동 배포
- Pull Request 생성 시 미리보기 환경 자동 생성
- `.github/workflows/azure-static-web-apps.yml` 워크플로우 사용

## 📁 프로젝트 구조

```
ponpoco-game/
├── index.html                     # 메인 HTML 파일
├── js/
│   └── game.js                   # 게임 로직 (Canvas 2D)
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # 자동 배포 워크플로우
├── staticwebapp.config.json      # Azure Static Web Apps 설정
├── package.json                  # 프로젝트 메타데이터
└── README.md                     # 이 문서
```

## 🎯 게임 목표

- 🍎 빨간 사과 수집 (100점)
- 🍌 바나나 수집 (150점)
- 🥕 당근 수집 (200점)
- 🪙 동전 수집 (50점)
- 💜 보라색 특수 아이템 수집 (500점)

## 🛠️ 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **배포**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **개발환경**: GitHub Codespaces 지원

## 📱 브라우저 호환성

- Chrome/Chromium 기반 브라우저 (추천)
- Firefox
- Safari
- Edge

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새 브랜치를 만드세요: `git checkout -b feature/amazing-feature`
3. 변경사항을 커밋하세요: `git commit -m 'Add amazing feature'`
4. 브랜치에 푸시하세요: `git push origin feature/amazing-feature`
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🎮 게임 플레이 팁

- 이단 점프를 활용해서 높은 플랫폼에 도달하세요
- 돌 던지기로 장애물을 제거할 수 있어요
- 아래 방향키로 플랫폼을 통과할 수 있습니다
- 보라색 아이템은 높은 점수를 제공하니 놓치지 마세요!

---

🦝 **즐거운 게임 되세요!** 🎉
# 🦝 PONPOKO - 너구리 플랫폼 게임

레트로 스타일의 2D 플랫폼 게임으로, 귀여운 너구리 캐릭터를 조작해 스테이지를 클리어하는 게임입니다.

## 🎮 게임 특징

- **클래식 아케이드 스타일**: 8비트 레트로 그래픽과 픽셀 아트
- **너구리 캐릭터**: 폰포코 스타일의 귀여운 너구리 옆모습 스프라이트
- **2단 점프**: 공중에서 한 번 더 점프할 수 있는 고급 액션
- **다양한 플랫폼**: 일반, 부서지는, 움직이는, 스프링 플랫폼
- **적과 아이템**: 다양한 적 타입과 수집 아이템
- **파티클 효과**: 점프, 공격, 아이템 수집 시 화려한 효과

## 🕹️ 조작법

| 키 | 동작 |
|---|---|
| `←` `→` | 이동 |
| `↑` | 점프 (2단 점프 가능) |
| `↓` | 아래 통과 |
| `SPACE` | 돌 던지기 |
| `P` | 일시정지 |

## 🎯 게임 요소

### 플랫폼 타입
- **일반 플랫폼**: 기본 갈색 플랫폼
- **부서지는 플랫폼**: 밟으면 부서지는 플랫폼
- **움직이는 플랫폼**: 좌우로 움직이는 파란색 플랫폼
- **스프링 플랫폼**: 높이 튕겨주는 초록색 플랫폼

### 적 타입
- **워커**: 땅 위를 걸어다니는 보라색 적
- **점퍼**: 가끔 점프하는 주황색 적
- **플라이어**: 공중을 날아다니는 보라색 적

### 아이템
- **과일**: 50점 (빨간 원형)
- **보너스**: 200점 (금색 별)

## 📊 점수 시스템

- 과일 수집: 50점
- 보너스 아이템: 200점
- 적 처치: 100-150점
- 스테이지 클리어 보너스: 남은 시간 × 10점

## 🚀 배포 및 실행

### 🔧 GitHub Codespaces에서 실행 (권장)

1. **Codespace 생성**
   ```bash
   # GitHub에서 "Code" → "Codespaces" → "Create codespace on main" 클릭
   ```

2. **자동 설정 완료 대기**
   - Codespace가 시작되면 자동으로 필요한 도구들이 설치됩니다
   - Azure Developer CLI (azd)가 자동으로 설치됩니다
   - Bash 스크립트 실행 권한이 자동으로 설정됩니다

3. **개발 환경 확인**
   ```bash
   npm run setup
   # 또는 직접 스크립트 실행
   ./scripts/setup.sh
   ```

4. **게임 로컬 실행**
   ```bash
   npm start
   ```

5. **Azure 로그인 (디바이스 코드 방식)**
   ```bash
   npm run azure-login
   # 또는
   azd auth login --use-device-code
   ```
   - 브라우저에서 https://microsoft.com/devicelogin 접속
   - 터미널에 표시된 코드 입력
   - Azure 계정으로 로그인

6. **Azure에 배포**
   ```bash
   npm run deploy
   # 또는 직접 스크립트 실행
   ./scripts/deploy.sh
   ```

### 📜 Bash 스크립트 명령어

```bash
./scripts/setup.sh     # 개발 환경 설정 및 상태 확인
./scripts/clean.sh     # 개발 환경 정리 (node_modules, 캐시 등)
./scripts/logs.sh      # Azure 로그 및 배포 상태 확인
./scripts/deploy.sh    # Azure 자동 배포
```

### 🖥️ 로컬 개발 환경에서 실행

#### Linux/macOS/WSL에서 설치
```bash
# Azure Developer CLI 설치
curl -fsSL https://aka.ms/install-azd.sh | bash

# 프로젝트 설정
npm install
chmod +x scripts/*.sh
./scripts/setup.sh
```

#### Linux/macOS에서 설치
```bash
# 자동 설치 스크립트 실행
chmod +x scripts/setup-azure.sh
./scripts/setup-azure.sh

# 또는 수동 설치
curl -fsSL https://aka.ms/install-azd.sh | bash
```

#### Azure Developer CLI 설치 확인
```bash
azd version
```

#### Azure 로그인
```bash
# 디바이스 코드 방식 (Codespaces/원격 환경에서 권장)
azd auth login --use-device-code

# 또는 브라우저 방식 (로컬 환경)
azd auth login
```

#### 프로젝트 초기화 및 배포
```bash
# 프로젝트 디렉토리로 이동
cd ponpoco-game

# Azure 프로젝트 초기화
azd init

# Azure에 배포
azd up
```

### 🌐 Azure Static Web Apps 수동 배포

1. **Azure Portal 접속**
   - [Azure Portal](https://portal.azure.com) 로그인

2. **Static Web App 리소스 생성**
   - "Create a resource" → "Static Web App" 검색
   - GitHub 리포지토리 연결

3. **배포 설정**
   - **App location**: `/`
   - **Api location**: `` (빈 값)
   - **Output location**: `` (빈 값)

4. **자동 배포 확인**
   - GitHub Actions 워크플로우가 자동 생성됨
   - 코드 푸시 시 자동 배포

### 로컬 실행 (기본)
```bash
# 프로젝트 클론
git clone https://github.com/your-username/ponpoco-game.git
cd ponpoco-game

# 간단한 HTTP 서버 실행
python -m http.server 8000
# 또는
npx serve .

# 브라우저에서 http://localhost:8000 접속
```

### 📱 배포 URL 확인

배포 완료 후 다음 위치에서 URL 확인 가능:
- Azure Portal → Static Web Apps → Overview → URL
- GitHub Actions → 워크플로우 실행 결과
- `azd up` 명령어 실행 후 터미널 출력

## 🛠️ 개발 환경

- **언어**: HTML5, CSS3, JavaScript (ES5)
- **API**: Canvas 2D API
- **호환성**: 모든 모던 브라우저 지원
- **의존성**: 없음 (순수 JavaScript)

## 📁 프로젝트 구조

```
ponpoco-game/
├── index.html              # 메인 HTML 파일
├── js/
│   └── game.js             # 게임 로직
├── .github/
│   └── workflows/          # GitHub Actions 워크플로우
├── staticwebapp.config.json # Azure Static Web Apps 설정
├── azure.yaml              # Azure Developer CLI 설정
└── README.md               # 프로젝트 문서
```

## 🎨 게임 스크린샷

게임은 레트로 아케이드 스타일의 UI를 제공합니다:
- 네온 컬러 UI
- 픽셀 아트 스타일
- 부드러운 애니메이션
- 파티클 효과

## 🔧 기술적 특징

- **반응형 디자인**: 다양한 화면 크기 지원
- **60FPS 게임플레이**: requestAnimationFrame 사용
- **이벤트 기반 키 입력**: 정확한 조작감
- **모듈화된 코드**: 유지보수가 쉬운 구조
- **크로스 브라우저 호환**: 모든 모던 브라우저에서 동작

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/ponpoco-game](https://github.com/your-username/ponpoco-game)

---

**즐거운 게임 플레이 되세요! 🦝🎮**
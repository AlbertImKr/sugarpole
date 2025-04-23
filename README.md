# Stack Viewport Interaction Demo

이 프로젝트는 Cornerstone3D를 사용하여 의료 영상용 스택 뷰포트와 상호작용하는 방법을 보여주는 데모입니다.

## 기술 스택

- React 19.0.0 (함수형 컴포넌트)
- TypeScript
- Tailwind CSS
- Cornerstone.js/Cornerstone3D v1.86
- Vite 6.3.1
- Yarn
- ESLint + Prettier
- GitHub Actions CI

## 주요 기능

이 데모는 다음과 같은 영상 조작 기능을 제공합니다:

### 기본 탐색

- **이전/다음 이미지**: 스택 내에서 이미지 간 이동
- **리셋**: 모든 변경 사항을 기본값으로 복원

### 이미지 조작

- **확대/축소**: 이미지 확대 및 축소 기능
- **회전**: 이미지 회전 기능
- **좌우 반전**: 이미지 수평 반전
- **상하 반전**: 이미지 수직 반전
- **색상 반전**: 이미지 색상 반전
- **컬러맵 적용**: 다양한 컬러맵을 이미지에 적용

## 구현 요구사항

- [x] 기본 UI 레이아웃 구성
- [x] Cornerstone3D 뷰포트 초기화
- [x] 스택 뷰포트 구성 및 이미지 로드
- [x] 확대/축소 기능 구현
- [x] 수평 반전 기능 구현
- [x] 수직 반전 기능 구현
- [x] 회전 기능 구현
- [x] 색상 반전 기능 구현
- [x] 컬러맵 적용 기능 구현
- [x] 리셋 기능 구현
- [x] 이전/다음 이미지 탐색 구현

## 시작하기

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn run dev

# 빌드
yarn run build
```

## 스크립트

- `yarn run dev`: 개발 서버를 시작합니다.
- `yarn run build`: 프로덕션 빌드를 생성합니다.
- `yarn run lint`: ESLint를 사용하여 코드 품질을 검사합니다.
- `yarn run lint:fix`: ESLint를 사용하여 코드 품질을 검사하고 자동으로 수정합니다.
- `yarn run preview`: 빌드된 파일을 로컬 서버에서 미리 봅니다.
- `yarn run format`: Prettier를 사용하여 코드 포맷팅을 수행합니다.
- `yarn run format:check`: Prettier를 사용하여 코드 포맷팅을 검사합니다.
- `yarn run prepare`: Husky를 사용하여 Git 훅을 설정합니다.
- `yarn run typecheck`: TypeScript 타입 검사를 수행합니다.

## 컨벤션

### 커밋 메시지 규칙

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
- `refactor:` 코드 리팩토링
- `test:` 테스트 코드 추가 또는 수정
- `chore:` 빌드 프로세스, 패키지 매니저 설정 등 변경

### 브랜치 전략

- main: 프로덕션 배포용 브랜치
- develop: 개발 중인 기능을 통합하는 브랜치
- feature/\*: 새로운 기능을 개발하는 브랜치
- bugfix/\*: 버그 수정을 위한 브랜치

## 참고 자료

- [Cornerstone3D 공식 문서](https://www.cornerstonejs.org/)
- [Cornerstone3D 예제](https://www.cornerstonejs.org/docs/examples/)
- [Basic Stack](https://www.cornerstonejs.org/live-examples/stackbasic)

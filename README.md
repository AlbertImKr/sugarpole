# Stack Viewport Interaction Demo

이 프로젝트는 Cornerstone3D를 사용하여 의료 영상용 스택 뷰포트와 상호작용하는 방법을 보여주는 데모입니다.

## 기술 스택

- React 19.0.0 (함수형 컴포넌트)
- TypeScript
- Tailwind CSS
- Cornerstone.js/Cornerstone3D v1.86
- Vite 6.3.1
- Yarn

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

- [ ] 기본 UI 레이아웃 구성
- [ ] Cornerstone3D 뷰포트 초기화
- [ ] 스택 뷰포트 구성 및 이미지 로드
- [ ] 확대/축소 기능 구현
- [ ] 수평 반전 기능 구현
- [ ] 수직 반전 기능 구현
- [ ] 회전 기능 구현
- [ ] 색상 반전 기능 구현
- [ ] 컬러맵 적용 기능 구현
- [ ] 리셋 기능 구현
- [ ] 이전/다음 이미지 탐색 구현

## 시작하기

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn run dev
```

## 참고 자료

- [Cornerstone3D 공식 문서](https://www.cornerstonejs.org/)
- [Cornerstone3D 예제](https://www.cornerstonejs.org/docs/examples/)
- [Basic Stack](https://www.cornerstonejs.org/live-examples/stackbasic)
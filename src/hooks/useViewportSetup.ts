import { useCallback, RefObject } from "react";
import {
  Enums,
  getRenderingEngine,
  RenderingEngine,
  StackViewport,
} from "@cornerstonejs/core";
import {
  StackScrollTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} from "@cornerstonejs/tools";

interface ViewportSetupProps {
  id: string;
  viewportId: string;
  renderingEngineId: string;
  toolGroupId: string;
  containerRef: RefObject<HTMLDivElement | null>;
  isInitialized: boolean;
  setViewport: (viewport: StackViewport) => void;
}

export function useViewportSetup({
  viewportId,
  renderingEngineId,
  toolGroupId,
  containerRef,
  isInitialized,
  setViewport,
}: ViewportSetupProps) {
  // DICOM 이미지 경로 배열 생성
  const createImageIds = useCallback(() => {
    return Array.from(
      { length: 41 },
      (_, i) => `wadouri:/dicoms/image-${i.toString().padStart(5, "0")}.dcm`,
    );
  }, []);

  // 도구 그룹 생성 및 설정
  const setupToolGroup = useCallback(
    (viewportId: string, renderingEngineId: string) => {
      try {
        // 새 도구 그룹 생성
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId)!;
        toolGroup.addViewport(viewportId, renderingEngineId);

        // 기본 도구 추가
        toolGroup.addTool(ZoomTool.toolName);
        toolGroup.addTool(WindowLevelTool.toolName);
        toolGroup.addTool(StackScrollTool.toolName);

        console.log("도구 그룹 생성 완료:", toolGroup);
        return toolGroup;
      } catch (error) {
        console.error("도구 그룹 설정 오류:", error);
        return null;
      }
    },
    [toolGroupId],
  );

  // 기존 렌더링 엔진 제거
  const cleanupRenderingEngine = useCallback(() => {
    try {
      // 도구 그룹 제거
      if (ToolGroupManager.getToolGroup(toolGroupId)) {
        ToolGroupManager.destroyToolGroup(toolGroupId);
      }

      // 렌더링 엔진 제거
      try {
        const engine = getRenderingEngine(renderingEngineId);
        if (engine) engine.destroy();
      } catch (e) {
        console.error("렌더링 엔진 제거 오류:", e);
      }
    } catch (e) {
      console.log("정리 중 오류:", e);
    }
  }, [toolGroupId, renderingEngineId]);

  // 뷰포트 설정
  const setupViewport = useCallback(async () => {
    if (!isInitialized || !containerRef.current) return null;

    try {
      // 기존 인스턴스 정리
      cleanupRenderingEngine();

      // 이미지 ID 생성
      const imageIds = createImageIds();

      // 새 렌더링 엔진 생성
      const renderingEngine = new RenderingEngine(renderingEngineId);

      // 뷰포트 활성화
      renderingEngine.enableElement({
        viewportId,
        element: containerRef.current,
        type: Enums.ViewportType.STACK,
      });

      // 뷰포트 설정
      const viewportInstance = renderingEngine.getViewport(viewportId);
      if (viewportInstance instanceof StackViewport) {
        await viewportInstance.setStack(imageIds, 20);
        viewportInstance.resetCamera();
        viewportInstance.render();

        // 도구 그룹 설정
        setupToolGroup(viewportId, renderingEngine.id);

        setViewport(viewportInstance);
        return viewportInstance;
      }
      return null;
    } catch (error) {
      console.error("뷰포트 설정 오류:", error);
      return null;
    }
  }, [
    isInitialized,
    cleanupRenderingEngine,
    createImageIds,
    setupToolGroup,
    viewportId,
    renderingEngineId,
    containerRef,
    setViewport,
  ]);

  return { setupViewport, cleanupRenderingEngine };
}

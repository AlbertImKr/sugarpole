import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Enums,
  getRenderingEngine,
  init as coreInit,
  RenderingEngine,
  StackViewport,
} from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import {
  addTool,
  Enums as ToolEnums,
  init as toolsInit,
  StackScrollTool,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
} from "@cornerstonejs/tools";

interface CornerstoneViewerProps {
  id: string;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  activeViewerId: string;
  setActiveViewerId: (id: string) => void;
}

const CornerstoneViewer: React.FC<CornerstoneViewerProps> = ({
  id,
  activeMode,
  setActiveMode,
  activeViewerId,
  setActiveViewerId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<StackViewport | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const toolGroupId = `toolGroup-${id}`;
  const viewportId = `viewport-${id}`;
  const renderingEngineId = `renderingEngine-${id}`;

  /**
   * Cornerstone 라이브러리 초기화
   */
  const initializeCornerstone = useCallback(async () => {
    if (isInitialized) return;

    try {
      // 라이브러리 초기화
      coreInit();
      dicomImageLoaderInit();
      toolsInit();

      // 필요한 도구 등록
      addTool(ZoomTool);
      addTool(WindowLevelTool);
      addTool(StackScrollTool);

      setIsInitialized(true);
      console.log("Cornerstone 초기화 완료");
    } catch (error) {
      console.error("Cornerstone 초기화 오류:", error);
    }
  }, [isInitialized]);

  /**
   * 기존 렌더링 엔진 제거
   */
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

  /**
   * DICOM 이미지 경로 배열 생성
   */
  const createImageIds = useCallback(() => {
    return Array.from(
      { length: 41 },
      (_, i) => `wadouri:/dicoms/image-${i.toString().padStart(5, "0")}.dcm`,
    );
  }, []);

  /**
   * 도구 그룹 생성 및 설정
   */
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

  /**
   * 뷰포트 설정
   */
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
  ]);

  /**
   * 뷰포트 플립 조작 (수평/수직)
   */
  const handleFlip = useCallback(
    (direction: "horizontal" | "vertical") => {
      if (!viewport || activeViewerId !== id) return;

      try {
        const camera = viewport.getCamera();
        console.log("현재 카메라 상태:", camera);

        // 직접 플립 값 지정
        if (direction === "horizontal") {
          const currentFlip = camera.flipHorizontal || false;
          console.log("수평 플립 변경:", currentFlip, "→", !currentFlip);

          viewport.setCamera({
            flipHorizontal: !currentFlip,
          });
        } else {
          const currentFlip = camera.flipVertical || false;
          console.log("수직 플립 변경:", currentFlip, "→", !currentFlip);

          viewport.setCamera({
            flipVertical: !currentFlip,
          });
        }

        viewport.render();
        console.log("플립 작업 후 카메라 상태:", viewport.getCamera());
      } catch (error) {
        console.error(`${direction} 플립 처리 중 오류:`, error);
      }
    },
    [viewport, activeViewerId, id],
  );

  /**
   * 뷰포트 회전 조작
   */
  const handleRotate = useCallback(
    (degrees: number) => {
      if (!viewport || activeViewerId !== id) return;

      const presentation = viewport.getViewPresentation();
      const currentRotation = presentation.rotation ?? 0;
      viewport.setViewPresentation({
        ...presentation,
        rotation: currentRotation + degrees,
      });
      viewport.render();
    },
    [viewport, activeViewerId, id],
  );

  /**
   * 뷰포트 반전 조작
   */
  const handleInvert = useCallback(() => {
    console.log("<UNK> <UNK> <UNK> <UNK>:", id);
    if (viewport && activeViewerId == id) {
      const invert = viewport.getProperties().invert;
      viewport.setProperties({
        invert: !invert,
      });
      viewport.render();
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 컬러맵 적용
   */
  const handleApplyColormap = useCallback(() => {
    if (viewport && activeViewerId == id) {
      viewport.setProperties({
        colormap: {
          name: "hsv",
        },
      });
      viewport.render();
      viewport.render();
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 리셋
   */
  const handleResetCamera = useCallback(() => {
    if (viewport && activeViewerId == id) {
      viewport.resetCamera();
      viewport.resetProperties();
      viewport.render();
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 이전 DICOM 이미지로 돌아가기
   */
  const handlePreviousImage = useCallback(async () => {
    if (viewport && activeViewerId == id) {
      const currentIndex = viewport.getCurrentImageIdIndex();
      const newIndex = Math.max(currentIndex - 1, 0);
      await viewport.setImageIdIndex(newIndex);
      viewport.render();
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 도구 활성화 관리
   */
  const updateActiveTool = useCallback(() => {
    if (!isInitialized || !activeMode) return;

    const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
    if (!toolGroup) return;
    if (activeViewerId !== id) {
      return;
    }

    try {
      // 활성 도구 설정
      switch (activeMode) {
        case "zoom":
          console.log("Zoom 도구 활성화");
          toolGroup.setToolActive(ZoomTool.toolName, {
            bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
          });
          break;

        case "flipH":
          handleFlip("horizontal");
          setActiveMode("zoom");
          break;

        case "flipV":
          handleFlip("vertical");

          setActiveMode("zoom");
          break;

        case "rotate30":
          handleRotate(30);

          setActiveMode("zoom");
          break;

        case "invert":
          handleInvert();

          setActiveMode("zoom");
          break;

        case "applyColormap":
          handleApplyColormap();

          setActiveMode("zoom");
          break;

        case "reset":
          handleResetCamera();
          setActiveMode("zoom");
          break;

        case "previous":
          await handlePreviousImage();
          setActiveMode("zoom");
          break;

        default:
          // 기본적으로 윈도우 레벨링 활성화
          toolGroup.setToolActive(WindowLevelTool.toolName, {
            bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
          });
          break;
      }

      // 스크롤 기능은 항상 유지
      toolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }],
      });
    } catch (error) {
      console.error("도구 변경 오류:", error);
    }
  }, [
    isInitialized,
    activeMode,
    toolGroupId,
    activeViewerId,
    id,
    handleFlip,
    setActiveMode,
    handleRotate,
    handleInvert,
    handleApplyColormap,
    handleResetCamera,
    handlePreviousImage,
  ]);

  // 코너스톤 초기화
  useEffect(() => {
    (async () => {
      await initializeCornerstone();
    })();
  }, [initializeCornerstone]);

  // 뷰포트 설정
  useEffect(() => {
    if (!isInitialized) return;

    (async () => {
      const newViewport = await setupViewport();
      if (newViewport) {
        setViewport(newViewport);
      }
    })();

    return cleanupRenderingEngine;
  }, [isInitialized, setupViewport, cleanupRenderingEngine]);

  // 도구 상태 업데이트
  useEffect(() => {
    updateActiveTool();
  }, [updateActiveTool]);

  return (
    <button className="w-full h-full" onFocus={() => setActiveViewerId(id)}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        }}
        className={`
          ${activeMode === "zoom" ? "cursor-zoom-in" : "cursor-default"}
          ${activeViewerId === id ? "border-4 border-blue-500" : "border-0"}
        `}
      ></div>
    </button>
  );
};

export default CornerstoneViewer;

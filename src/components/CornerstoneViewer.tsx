import React, { useEffect, useRef, useState } from "react";
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
import IToolGroup from "@cornerstonejs/tools/types/IToolGroup";

interface CornerstoneViewerProps {
  id: string;
  activeMode?: string;
}

const CornerstoneViewer: React.FC<CornerstoneViewerProps> = ({
  id,
  activeMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const toolGroupId = `toolGroup-${id}`;
  const toolGroupRef = useRef<IToolGroup>(null);

  // Cornerstone 라이브러리 초기화
  useEffect(() => {
    if (!isInitialized) {
      try {
        // 라이브러리 초기화
        coreInit();
        dicomImageLoaderInit();
        toolsInit();

        // 필요한 도구만 등록
        addTool(ZoomTool);
        addTool(WindowLevelTool);
        addTool(StackScrollTool);

        setIsInitialized(true);
      } catch (error) {
        console.error("Cornerstone 초기화 오류:", error);
      }
    }
  }, [isInitialized]);

  // 뷰포트 설정
  useEffect(() => {
    // 초기화가 완료되지 않았거나 컨테이너가 없으면 중단
    if (!isInitialized || !containerRef.current) return;

    let renderingEngine: RenderingEngine | null = null;
    const viewportId = `viewport-${id}`;

    const setupViewport = async () => {
      try {
        // 기존 렌더링 엔진 제거
        try {
          const existingEngine = getRenderingEngine(`renderingEngine-${id}`);
          if (existingEngine) {
            existingEngine.destroy();
          }
        } catch (e) {
          console.error("기존 렌더링 엔진 제거 오류:", e);
        }

        // DICOM 이미지 경로 배열 생성
        const imageIds = Array.from(
          { length: 41 },
          (_, i) =>
            `wadouri:/dicoms/image-${i.toString().padStart(5, "0")}.dcm`,
        );

        // 새 렌더링 엔진 생성
        renderingEngine = new RenderingEngine(`renderingEngine-${id}`);

        // 뷰포트 활성화
        renderingEngine.enableElement({
          viewportId,
          element: containerRef.current!,
          type: Enums.ViewportType.STACK,
        });

        // 뷰포트 설정
        const viewport = renderingEngine.getViewport(viewportId);
        if (viewport instanceof StackViewport) {
          await viewport.setStack(imageIds, 20);
          viewport.resetCamera();
          viewport.render();

          // 도구 그룹 설정
          try {
            // 새 도구 그룹 생성
            const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
            toolGroup.addViewport(viewportId, renderingEngine.id);

            // 기본 도구 추가
            toolGroup.addTool(ZoomTool.toolName);
            toolGroup.addTool(WindowLevelTool.toolName);
            toolGroup.addTool(StackScrollTool.toolName);
            console.log("도구 그룹 생성:", toolGroup);

            toolGroupRef.current = toolGroup;
          } catch (error) {
            console.error("도구 그룹 설정 오류:", error);
          }
        }
      } catch (error) {
        console.error("뷰포트 설정 오류:", error);
      }
    };

    (async () => {
      await setupViewport();
    })();

    // 클린업
    return () => {
      try {
        // 도구 그룹 제거
        if (toolGroupRef.current) {
          ToolGroupManager.destroyToolGroup(toolGroupId);
        }

        // 렌더링 엔진 제거
        if (renderingEngine) {
          renderingEngine.destroy();
        } else {
          try {
            const engine = getRenderingEngine(`renderingEngine-${id}`);
            if (engine) engine.destroy();
          } catch (e) {
            console.error("렌더링 엔진 제거 오류:", e);
          }
        }
      } catch (e) {
        console.log("정리 중 오류:", e);
      }
    };
  }, [id, toolGroupId, isInitialized]);

  // 도구 변경 처리
  useEffect(() => {
    if (!isInitialized || !activeMode || !toolGroupRef.current) return;
    console.log("도구 변경:", activeMode);

    try {
      const toolGroup = toolGroupRef.current;
      console.log("<UNK> <UNK>:", toolGroup);
      if (!toolGroup) return;

      // 기본 도구 설정
      if (activeMode === "zoom") {
        console.log("Zoom 도구 활성화");
        // 확대/축소 도구 활성화
        toolGroup.setToolActive(ZoomTool.toolName, {
          bindings: [
            {
              mouseButton: ToolEnums.MouseBindings.Primary,
            },
          ],
        });
      } else {
        // 기본적으로 윈도우 레벨링 활성화
        toolGroup.setToolActive(WindowLevelTool.toolName, {
          bindings: [
            {
              mouseButton: ToolEnums.MouseBindings.Primary,
            },
          ],
        });
      }

      // 스크롤 기능 유지
      toolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: [
          {
            mouseButton: ToolEnums.MouseBindings.Secondary,
          },
        ],
      });
    } catch (error) {
      console.error("도구 변경 오류:", error);
    }
  }, [activeMode, toolGroupId, isInitialized]);

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        }}
        className={activeMode === "zoom" ? "cursor-zoom-in" : "cursor-default"}
      ></div>
    </div>
  );
};

export default CornerstoneViewer;

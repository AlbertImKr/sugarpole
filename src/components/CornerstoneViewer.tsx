import React, { useEffect, useRef, useState } from "react";
import {
  Enums,
  init as coreInit,
  RenderingEngine,
  StackViewport,
  getRenderingEngine,
} from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

interface CornerstoneViewerProps {
  id: string;
  activeMode?: string;
}

const CornerstoneViewer: React.FC<CornerstoneViewerProps> = ({
  id,
  activeMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<StackViewport | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);

  useEffect(() => {
    (async () => {
      if (!containerRef.current) return;

      try {
        // Cornerstone 초기화
        coreInit();
        dicomImageLoaderInit();

        // DICOM 이미지 경로 배열 생성
        const imageIds = Array.from(
          { length: 41 },
          (_, i) =>
            `wadouri:/dicoms/image-${i.toString().padStart(5, "0")}.dcm`,
        );

        // 렌더링 엔진 생성
        const renderingEngine = new RenderingEngine(`renderingEngine-${id}`);
        const viewportId = `viewport-${id}`;

        // 뷰포트 활성화
        renderingEngine.enableElement({
          viewportId,
          element: containerRef.current,
          type: Enums.ViewportType.STACK,
        });

        // 뷰포트 가져오기 및 설정
        const viewport = renderingEngine.getViewport(viewportId);
        if (viewport instanceof StackViewport) {
          await viewport.setStack(imageIds, 20);
          viewport.resetCamera();
          viewport.render();

          // 뷰포트 상태에 저장
          setViewport(viewport);
        } else {
          console.error("Viewport가 StackViewport가 아닙니다.");
        }
      } catch (error) {
        console.error("초기화 중 오류:", error);
      }
    })();

    // 컴포넌트 언마운트 시 정리
    return () => {
      try {
        const renderingEngine = getRenderingEngine(`renderingEngine-${id}`);
        if (renderingEngine) {
          renderingEngine.destroy();
        }
      } catch (e) {
        console.log("정리 중 오류:", e);
      }
    };
  }, [id]);

  // 줌 기능을 위한 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeMode === "zoom") {
      setIsDragging(true);
      setLastMouseY(e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeMode === "zoom" && viewport) {
      const deltaY = e.clientY - lastMouseY;

      // 마우스를 위로 움직이면 확대, 아래로 움직이면 축소
      const zoomFactor = deltaY > 0 ? 0.98 : 1.02;

      const currentZoom = viewport.getZoom();
      viewport.setZoom(currentZoom * zoomFactor);
      viewport.render();

      setLastMouseY(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full"
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        }}
        className={
          activeMode === "zoom" ? "cursor-ns-resize" : "cursor-default"
        }
      ></div>
    </button>
  );
};

export default CornerstoneViewer;

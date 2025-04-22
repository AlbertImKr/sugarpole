import React, { useEffect, useRef } from "react";
import {
  Enums,
  init as coreInit,
  RenderingEngine,
  StackViewport,
} from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

const CornerstoneViewer: React.FC<{ id: string }> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!containerRef.current) return;

      try {
        coreInit();
        dicomImageLoaderInit();

        const imageIds = Array.from(
          { length: 41 },
          (_, i) =>
            `wadouri:/dicoms/image-${i.toString().padStart(5, "0")}.dcm`,
        );

        const renderingEngine = new RenderingEngine(`renderingEngine-${id}`);
        const viewportId = `viewport-${id}`;

        renderingEngine.enableElement({
          viewportId,
          element: containerRef.current,
          type: Enums.ViewportType.STACK,
        });

        const viewport = renderingEngine.getViewport(viewportId);
        if (viewport instanceof StackViewport) {
          await viewport.setStack(imageIds, 20);
          viewport.resetCamera();
          viewport.render();
        } else {
          console.error("Viewport가 StackViewport가 아닙니다.");
        }
      } catch (error) {
        console.error("초기화 중 오류:", error);
      }
    })();
  }, [id]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
    />
  );
};

export default CornerstoneViewer;

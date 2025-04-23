import React, { useRef, useState } from "react";
import { StackViewport } from "@cornerstonejs/core";
import { useCornerstoneInit } from "../hooks/useCornerstoneInit";
import { useViewportSetup } from "../hooks/useViewportSetup";
import { useToolHandlers } from "../hooks/useToolHandlers";
import { useToolActivation } from "../hooks/useToolActivation";

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
  // 기본적인 상태 및 참조
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState<StackViewport | null>(null);

  // 고유 식별자 설정
  const toolGroupId = `toolGroup-${id}`;
  const viewportId = `viewport-${id}`;
  const renderingEngineId = `renderingEngine-${id}`;

  // 코너스톤 초기화 훅
  const { isInitialized } = useCornerstoneInit();

  // 뷰포트 설정 훅
  const { setupViewport, cleanupRenderingEngine } = useViewportSetup({
    id,
    viewportId,
    renderingEngineId,
    toolGroupId,
    containerRef,
    isInitialized,
    setViewport,
  });

  // 도구 핸들러 훅
  const toolHandlers = useToolHandlers({
    viewport,
    activeViewerId,
    id,
  });

  // 도구 활성화 훅
  useToolActivation({
    isInitialized,
    activeMode,
    toolGroupId,
    viewport,
    activeViewerId,
    id,
    setActiveMode,
    ...toolHandlers,
  });

  // 뷰포트 설정 효과
  React.useEffect(() => {
    if (!isInitialized) return;

    (async () => {
      await setupViewport();
    })();

    return cleanupRenderingEngine;
  }, [isInitialized, setupViewport, cleanupRenderingEngine]);

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

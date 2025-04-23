import { useState, useEffect, useCallback } from "react";
import { init as coreInit } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import {
  addTool,
  init as toolsInit,
  StackScrollTool,
  WindowLevelTool,
  ZoomTool,
} from "@cornerstonejs/tools";

export function useCornerstoneInit() {
  const [isInitialized, setIsInitialized] = useState(false);

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

  useEffect(() => {
    initializeCornerstone();
  }, [initializeCornerstone]);

  return { isInitialized };
}

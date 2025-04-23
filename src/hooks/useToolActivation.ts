import { useEffect, useCallback } from "react";
import { StackViewport } from "@cornerstonejs/core";
import {
  ToolGroupManager,
  Enums as ToolEnums,
  ZoomTool,
} from "@cornerstonejs/tools";

interface ToolActivationProps {
  isInitialized: boolean;
  activeMode: string;
  toolGroupId: string;
  viewport: StackViewport | null;
  activeViewerId: string;
  id: string;
  setActiveMode: (mode: string) => void;
  handleFlip: (direction: "horizontal" | "vertical") => void;
  handleRotate: (degrees: number) => void;
  handleInvert: () => void;
  handleApplyColormap: () => void;
  handleResetCamera: () => void;
  handlePreviousImage: () => Promise<void>;
  handleNextImage: () => Promise<void>;
}

export function useToolActivation({
  isInitialized,
  activeMode,
  toolGroupId,
  activeViewerId,
  id,
  setActiveMode,
  handleFlip,
  handleRotate,
  handleInvert,
  handleApplyColormap,
  handleResetCamera,
  handlePreviousImage,
  handleNextImage,
}: ToolActivationProps) {
  // 일회성 작업 수행 함수
  const executeOneTimeAction = useCallback(async () => {
    if (!isInitialized || activeViewerId !== id) return;

    try {
      switch (activeMode) {
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

        case "next":
          await handleNextImage();
          setActiveMode("zoom");
          break;
      }
    } catch (error) {
      console.error("도구 작업 수행 중 오류:", error);
    }
  }, [
    isInitialized,
    activeViewerId,
    id,
    activeMode,
    handleFlip,
    handleRotate,
    handleInvert,
    handleApplyColormap,
    handleResetCamera,
    handlePreviousImage,
    handleNextImage,
    setActiveMode,
  ]);

  // 지속성 도구 활성화 함수
  const activatePersistentTool = useCallback(() => {
    if (!isInitialized || activeViewerId !== id) return;

    const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
    if (!toolGroup) return;

    try {
      // 지속성 도구 설정
      if (activeMode === "zoom") {
        console.log("Zoom 도구 활성화");
        toolGroup.setToolActive(ZoomTool.toolName, {
          bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
        });
      } else if (
        activeMode === "windowLevel" ||
        (activeMode !== "zoom" &&
          ![
            "flipH",
            "flipV",
            "rotate30",
            "invert",
            "applyColormap",
            "reset",
            "previous",
            "next",
          ].includes(activeMode))
      ) {
        toolGroup.setToolActive("WindowLevelTool", {
          bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }],
        });
      }
    } catch (error) {
      console.error("도구 활성화 중 오류:", error);
    }
  }, [isInitialized, activeViewerId, id, activeMode, toolGroupId]);

  // 도구 상태 업데이트
  const updateActiveTool = useCallback(async () => {
    if (!isInitialized || !activeMode) return;

    // 일회성 작업과 지속성 도구 구분 처리
    const oneTimeActions = [
      "flipH",
      "flipV",
      "rotate30",
      "invert",
      "applyColormap",
      "reset",
      "previous",
      "next",
    ];

    if (oneTimeActions.includes(activeMode)) {
      await executeOneTimeAction();
    } else {
      activatePersistentTool();
    }
  }, [isInitialized, activeMode, executeOneTimeAction, activatePersistentTool]);

  useEffect(() => {
    updateActiveTool();
  }, [updateActiveTool]);

  return null;
}

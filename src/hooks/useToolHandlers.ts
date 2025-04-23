import { useCallback } from "react";
import { StackViewport } from "@cornerstonejs/core";

interface ToolHandlersProps {
  viewport: StackViewport | null;
  activeViewerId: string;
  id: string;
}

export function useToolHandlers({
  viewport,
  activeViewerId,
  id,
}: ToolHandlersProps) {
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

      try {
        const presentation = viewport.getViewPresentation();
        const currentRotation = presentation.rotation ?? 0;
        viewport.setViewPresentation({
          ...presentation,
          rotation: currentRotation + degrees,
        });
        viewport.render();
      } catch (error) {
        console.error("회전 처리 중 오류:", error);
      }
    },
    [viewport, activeViewerId, id],
  );

  /**
   * 뷰포트 반전 조작
   */
  const handleInvert = useCallback(() => {
    if (!viewport || activeViewerId !== id) return;

    try {
      const invert = viewport.getProperties().invert;
      viewport.setProperties({
        invert: !invert,
      });
      viewport.render();
    } catch (error) {
      console.error("반전 처리 중 오류:", error);
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 컬러맵 적용
   */
  const handleApplyColormap = useCallback(() => {
    if (!viewport || activeViewerId !== id) return;

    try {
      viewport.setProperties({
        colormap: {
          name: "hsv",
        },
      });
      viewport.render();
    } catch (error) {
      console.error("컬러맵 적용 중 오류:", error);
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 리셋
   */
  const handleResetCamera = useCallback(() => {
    if (!viewport || activeViewerId !== id) return;

    try {
      viewport.resetCamera();
      viewport.resetProperties();
      viewport.render();
    } catch (error) {
      console.error("카메라 초기화 중 오류:", error);
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 이전 DICOM 이미지로 돌아가기
   */
  const handlePreviousImage = useCallback(async () => {
    if (!viewport || activeViewerId !== id) return;

    try {
      const currentIndex = viewport.getCurrentImageIdIndex();
      const newIndex = Math.max(currentIndex - 1, 0);
      await viewport.setImageIdIndex(newIndex);
      viewport.render();
    } catch (error) {
      console.error("이전 이미지 이동 중 오류:", error);
    }
  }, [viewport, activeViewerId, id]);

  /**
   * 다음 DICOM 이미지로 이동
   */
  const handleNextImage = useCallback(async () => {
    if (!viewport || activeViewerId !== id) return;

    try {
      const currentIndex = viewport.getCurrentImageIdIndex();
      const newIndex = Math.min(
        currentIndex + 1,
        viewport.getNumberOfSlices() - 1,
      );
      await viewport.setImageIdIndex(newIndex);
      viewport.render();
    } catch (error) {
      console.error("다음 이미지 이동 중 오류:", error);
    }
  }, [viewport, activeViewerId, id]);

  return {
    handleFlip,
    handleRotate,
    handleInvert,
    handleApplyColormap,
    handleResetCamera,
    handlePreviousImage,
    handleNextImage,
  };
}

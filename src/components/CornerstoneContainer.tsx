import React, { useState } from "react";
import CornerstoneViewer from "./CornerstoneViewer";
import ControlBar from "./ControlBar.tsx";

const CornerstoneContainer: React.FC = () => {
  const [activeMode, setActiveMode] = useState("");

  return (
    <>
      <ControlBar activeMode={activeMode} setActiveMode={setActiveMode} />
      <div className="w-[1440px] h-[903px] flex justify-between mx-auto">
        <div className="w-[720px] h-[903px]">
          <CornerstoneViewer id="viewerLeft" activeMode={activeMode} />
        </div>
        <div className="w-[715px] h-[903px]">
          <CornerstoneViewer id="viewerRight" activeMode={activeMode} />
        </div>
      </div>
    </>
  );
};

export default CornerstoneContainer;

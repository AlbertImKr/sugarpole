import React from "react";
import CornerstoneViewer from "./CornerstoneViewer";

const CornerstoneContainer: React.FC = () => {
  return (
    <div className="w-[1440px] h-[903px] flex justify-between mx-auto">
      <div className="w-[720px] h-[903px] ">
        <CornerstoneViewer id="viewerLeft" />
      </div>
      <div className="w-[715px] h-[903px] ">
        <CornerstoneViewer id="viewerRight" />
      </div>
    </div>
  );
};

export default CornerstoneContainer;

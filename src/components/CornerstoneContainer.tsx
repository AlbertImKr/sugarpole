import React from "react";
import CornerstoneViewer from "./CornerstoneViewer";

const CornerstoneContainer: React.FC = () => {
  return (
    <div className="w-[1440px] h-[903px] mx-auto pt-4 pr-10 pb-4 pl-[30px] flex justify-between">
      <div className="w-auto max-w-[720px] h-[903px] ">
        <CornerstoneViewer />
      </div>
      <div className="w-auto max-w-[715px] h-[903px] ">
        <CornerstoneViewer />
      </div>
    </div>
  );
};

export default CornerstoneContainer;

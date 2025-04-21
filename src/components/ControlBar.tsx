import React from "react";

const MenuItem: React.FC<{ text: string }> = ({ text }) => {
  return (
    <button className="flex items-center justify-center px-2 py-3 bg-transparent border-none cursor-pointer font-roboto font-medium text-base leading-[100%] text-[#21272A]">
      {text}
    </button>
  );
};

const ControlBar: React.FC = () => {
  return (
    <div className="w-[1440px] h-[116px] mx-auto pt-4 pr-10 pb-4 pl-[30px] flex items-center gap-12 bg-white">
      <div
        id="Header-Logo"
        className="w-auto max-w-[314px] h-auto max-h-[22px] flex items-center gap-1 self-center"
      >
        <div className="font-roboto font-bold leading-[110%] text-[#697077]  flex items-center justify-center">
          Dicom Viewer(with Cornerstone.js)
        </div>
      </div>

      <div className="w-[1014px] h-auto max-h-[48px] flex items-center gap-6 self-center justify-between">
        <div className="flex items-center w=[649px] gap-4">
          <button className="flex items-center justify-center px-2 py-3 bg-transparent border-none cursor-pointer font-roboto font-medium text-base leading-[100%] text-[#21272A] ml-[7px]">
            Zoom
          </button>
          <MenuItem text="Flip H" />
          <MenuItem text="Flip V" />
          <MenuItem text="Rotate Delta 30" />
          <MenuItem text="Invert" />
          <MenuItem text="Apply Colormap" />
          <MenuItem text="Reset" />
        </div>
        <button className="bg-[#0F62FE] border-[#0F62FE] border-2 w-auto max-w-[174px] h-[48px] pt-4 pr-3 pb-4 pl-3 cursor-pointer hover:bg-blue-800 flex items-center justify-center">
          <span className="font-roboto font-medium text-base leading-[100%] text-white text-center flex items-center justify-center w-[118px] h-[16px]">
            Previous Image
          </span>
        </button>
        <button className="flex items-center justify-center bg-[#0F62FE] border-2 border-[#0F62FE] rounded cursor-pointer hover:bg-blue-800 h-[48px] w-auto max-w-[143px]">
          <span className="font-roboto font-medium text-base leading-[100%] text-white text-center flex items-center justify-center w-[118px] h-[16px]">
            Next Image
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;

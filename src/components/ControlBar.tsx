import React from "react";

interface MenuItemProps {
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ text, active, onClick }) => {
  return (
    <button
      className={`flex items-center justify-center px-2 py-3 bg-transparent border-none cursor-pointer font-roboto font-medium text-base leading-[100%] ${active ? "text-[#0F62FE] font-bold" : "text-[#21272A]"}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

interface ControlBarProps {
  activeMode: string;
  setActiveMode: (mode: string) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  activeMode,
  setActiveMode,
}) => {
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
          <MenuItem
            text="Zoom"
            active={activeMode === "zoom"}
            onClick={() => setActiveMode(activeMode === "zoom" ? "" : "zoom")}
          />
          <MenuItem
            text="Flip H"
            onClick={() => setActiveMode(activeMode === "flipH" ? "" : "flipH")}
          />
          <MenuItem
            text="Flip V"
            onClick={() => setActiveMode(activeMode === "flipV" ? "" : "flipV")}
          />
          <MenuItem
            text="Rotate Delta 30"
            onClick={() =>
              setActiveMode(activeMode === "rotate30" ? "" : "rotate30")
            }
          />
          <MenuItem
            text="Invert"
            onClick={() =>
              setActiveMode(activeMode === "invert" ? "" : "invert")
            }
          />
          <MenuItem
            text="Apply Colormap"
            onClick={() =>
              setActiveMode(
                activeMode === "applyColormap" ? "" : "applyColormap",
              )
            }
          />
          <MenuItem
            text="Reset"
            onClick={() => setActiveMode(activeMode === "reset" ? "" : "reset")}
          />
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

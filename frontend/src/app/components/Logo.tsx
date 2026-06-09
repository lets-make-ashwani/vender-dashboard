import React from "react";
import { Link } from "react-router";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-[14px] no-underline ${className}`}>
      <img
        src="/TKS.png"
        alt="Topper Siksha Kendra"
        className="w-[50px] h-[50px] md:w-[64px] md:h-[64px] object-contain shrink-0"
      />

      <div className="flex flex-col leading-none text-left">
        <div className="text-[16px] md:text-[20px] font-[800] text-[#071b4d]">
          Topper'<span className="text-primary">s</span>
        </div>

        <div className="text-[22px] md:text-[28px] font-[900] text-[#071b4d] mt-[2px]">
          Siksha <span className="text-[#ff6b1a]">Kendra</span>
        </div>
      </div>
    </Link>
  );
};
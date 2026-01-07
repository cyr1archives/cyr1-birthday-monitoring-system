import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";

export default function LoadingScreen({ visible }) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) setShow(true);
    else {
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100]
                  flex items-center justify-center
                  bg-[#0A0D12]
                  transition-all duration-500
                  ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* LOGO */}
        <img
          src={logo}
          alt="Loading"
          className="w-14 h-14 opacity-90"
        />

        {/* DIGITAL LINE */}
        <div className="relative w-32 h-[2px] bg-white/10 overflow-hidden">
          <div className="absolute inset-0 loading-scan" />
        </div>

        {/* TEXT */}
        <span className="text-xs tracking-widest text-white/40">
          INITIALIZING
        </span>
      </div>
    </div>
  );
}

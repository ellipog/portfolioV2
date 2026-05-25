import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import { playSound } from "utils/playSound";

export default function Window({
  children,
  title,
  className,
  icon,
  width,
  setActiveWindows,
  pos,
  windowOrder,
  bringToFront,
  bodyClassName,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  icon: string;
  width?: number;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  pos: { x: number; y: number };
  windowOrder: string[];
  bringToFront: () => void;
  bodyClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(0);

  // Responsive positions and sizes computed on mount
  const [adjustedPos, setAdjustedPos] = useState(pos);
  const [adjustedWidth, setAdjustedWidth] = useState(width);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const taskbarHeight = 56;
      
      const windowWidth = width || 400;
      const estimatedHeight = 400; // Average window height fallback

      // 1. Calculate adjusted width to prevent screen overflow
      let finalWidth = windowWidth;
      if (screenWidth < windowWidth + 20) {
        finalWidth = screenWidth - 20;
        setAdjustedWidth(finalWidth);
      } else {
        setAdjustedWidth(windowWidth);
      }

      // 2. Calculate adjusted position with viewport boundary clamping
      const maxX = Math.max(10, screenWidth - finalWidth - 10);
      const maxY = Math.max(10, screenHeight - taskbarHeight - estimatedHeight - 10);

      // Mobile auto-centering layout
      if (screenWidth < finalWidth + 40) {
        setAdjustedPos({
          x: Math.max(10, Math.floor((screenWidth - finalWidth) / 2)),
          y: Math.max(10, Math.floor((screenHeight - taskbarHeight - estimatedHeight) / 2)),
        });
      } else {
        setAdjustedPos({
          x: Math.max(10, Math.min(pos.x, maxX)),
          y: Math.max(10, Math.min(pos.y, maxY)),
        });
      }
    }
    setKey((prev) => prev + 1);
  }, [pos, width]);

  const zIndex = mounted ? windowOrder.indexOf(title.replace(" ", "_")) + 3 : 3;

  const handleInteraction = () => {
    bringToFront();
    const formattedTitle = title.replace(" ", "_");
    window.handleClippyWindowClick?.(formattedTitle);
  };

  return (
    <Draggable
      key={key}
      handle=".title-bar"
      defaultPosition={adjustedPos}
      onStart={handleInteraction}
      onMouseDown={handleInteraction}
      bounds="parent"
    >
      <motion.div
        className={`window fixed hover:cursor-default shadow-xl ${className} flex flex-col`}
        style={{
          zIndex,
          width: adjustedWidth ? `${adjustedWidth}px` : "auto",
          maxWidth: "calc(100vw - 20px)",
          maxHeight: "calc(100vh - 76px)", // Clamp total window height (taskbar = 56px + padding)
        }}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className="title-bar select-none">
          <div className="title-bar-text flex items-center gap-1.5">
            <img
              src={icon}
              alt=""
              className="w-4 h-4 select-none pointer-events-none"
              draggable="false"
            />
            <span className="font-bold tracking-wide text-shadow-sm">{title.replace("_", " ")}</span>
          </div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
                setActiveWindows((prev) => ({
                  ...prev,
                  [title.replace(" ", "_")]: false,
                }));
              }}
            />
            <button
              aria-label="Maximize"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
              }}
            />
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
                setActiveWindows((prev) => ({
                  ...prev,
                  [title.replace(" ", "_")]: false,
                }));
              }}
            />
          </div>
        </div>
        <div 
          className={
            bodyClassName ??
            "window-body m-0 p-4 bg-white text-black overflow-auto flex-1 winxp-scrollbar"
          }
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
}

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
  const [isMaximized, setIsMaximized] = useState(false);
  const prevBoundsRef = useRef({ x: 0, y: 0, width: 0 });

  const [adjustedPos, setAdjustedPos] = useState(pos);
  const [adjustedWidth, setAdjustedWidth] = useState(width);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const taskbarHeight = 56;

      const windowWidth = width || 400;
      const estimatedHeight = 400;

      let finalWidth = windowWidth;
      if (screenWidth < windowWidth + 20) {
        finalWidth = screenWidth - 20;
        setAdjustedWidth(finalWidth);
      } else {
        setAdjustedWidth(windowWidth);
      }

      const maxX = Math.max(10, screenWidth - finalWidth - 10);
      const maxY = Math.max(10, screenHeight - taskbarHeight - estimatedHeight - 10);

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

  const handleMaximize = () => {
    playSound("click");
    if (!isMaximized) {
      prevBoundsRef.current = {
        x: adjustedPos.x,
        y: adjustedPos.y,
        width: adjustedWidth || 400,
      };
    }
    setIsMaximized((prev) => !prev);
  };

  const taskbarHeight = 56;
  const maximizedWidth = typeof window !== "undefined" ? window.innerWidth - 4 : 0;
  const maximizedHeight = typeof window !== "undefined" ? window.innerHeight - taskbarHeight - 4 : 0;

  return (
    <Draggable
      key={key}
      handle=".title-bar"
      defaultPosition={adjustedPos}
      position={isMaximized ? { x: 2, y: 2 } : undefined}
      onStart={handleInteraction}
      onMouseDown={handleInteraction}
      bounds="parent"
      disabled={isMaximized}
    >
      <motion.div
        className={`window fixed hover:cursor-default shadow-xl ${className} flex flex-col`}
        style={{
          zIndex,
          width: isMaximized ? `${maximizedWidth}px` : adjustedWidth ? `${adjustedWidth}px` : "auto",
          height: isMaximized ? `${maximizedHeight}px` : "auto",
          maxWidth: isMaximized ? `${maximizedWidth}px` : "calc(100vw - 20px)",
          maxHeight: isMaximized ? `${maximizedHeight}px` : "calc(100vh - 76px)",
          transition: isMaximized ? "width 0.15s ease, height 0.15s ease" : undefined,
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
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            />
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
                setIsMaximized(false);
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
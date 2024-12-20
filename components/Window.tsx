import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";

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
}) {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    setKey((prev) => prev + 1);
  }, []);

  const zIndex = mounted ? windowOrder.indexOf(title.replace(" ", "_")) + 3 : 3;

  const handleInteraction = () => {
    bringToFront();
    const formattedTitle = title.replace(" ", "_");
    window.handleClippyWindowClick?.(formattedTitle);
  };

  return (
    <Draggable
      key={key}
      handle=".window-title-bar"
      defaultPosition={pos}
      onStart={handleInteraction}
      onMouseDown={handleInteraction}
      bounds="parent"
    >
      <motion.div
        className={`absolute hover:cursor-default shadow-xl ${className} flex flex-col`}
        style={{ zIndex }}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div
          className="window-title-bar flex justify-between items-center bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-t-lg hover:cursor-grab active:cursor-grabbing border-t-4 border-x-4 border-blue-600"
          style={{ width: `${width}px` }}
        >
          <div className="flex gap-1.5 justify-start items-center ml-2 my-1">
            <img src={icon} alt="icon" className="w-5 h-5" />
            <div className="text-md">{title}</div>
          </div>
          <button
            className="window-button bg-red-600 hover:bg-red-700 active:bg-red-800 rounded text-lg mr-1 my-1 border border-white"
            onClick={(e) => {
              e.stopPropagation();
              setActiveWindows((prev) => ({
                ...prev,
                [title.replace(" ", "_")]: false,
              }));
            }}
          >
            <X />
          </button>
        </div>
        <button
          className="bg-blue-50 border-4 border-blue-600"
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
          <div className="p-4">{children}</div>
        </button>
      </motion.div>
    </Draggable>
  );
}

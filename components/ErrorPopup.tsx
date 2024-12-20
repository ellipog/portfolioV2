import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";

interface ErrorPopupProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "error" | "warning" | "info";
}

export default function ErrorPopup({
  title,
  message,
  isOpen,
  onClose,
  type = "error",
}: ErrorPopupProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const popupWidth = 500;
      const popupHeight = 200;

      // Generate random position within screen bounds
      const randomX = Math.random() * (screenWidth - popupWidth);
      const randomY = Math.random() * (screenHeight - popupHeight);

      setPosition({
        x: randomX,
        y: randomY,
      });
    }
  }, [isOpen]);

  const icons = Object.freeze({
    error: "error.png",
    warning: "warning.png",
    info: "info.png",
  });

  console.log(position);

  return position.x !== 0 && position.y !== 0 ? (
    <AnimatePresence>
      {isOpen && (
        <Draggable handle=".window-title-bar" defaultPosition={position}>
          <motion.div className="z-50 flex flex-col shadow-xl absolute">
            <div
              className="window-title-bar flex justify-between items-center bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-t-lg border-t-4 border-x-4 border-blue-600 hover:cursor-grab active:cursor-grabbing overflow-x-hidden"
              style={{ width: "500px" }}
            >
              <div className="flex gap-1.5 justify-start items-center ml-2 my-1">
                <img src={icons[type]} alt={type} className="w-6 h-6" />
                <div className="text-md">{title || "Windows"}</div>
              </div>
              <button
                className="window-button bg-red-600 hover:bg-red-700 active:bg-red-800 rounded text-lg mr-1 my-1 border border-white flex items-center justify-center"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-blue-50 border-4 border-blue-600">
              <div className="p-4 flex gap-4 items-center">
                <img src={icons[type]} alt={type} className="w-12 h-12" />
                <p className="text-sm text-black max-w-[390px] overflow-x-hidden">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  ) : null;
}

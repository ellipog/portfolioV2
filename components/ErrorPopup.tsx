import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import { playSound } from "utils/playSound";

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
      const popupWidth = 420;
      const popupHeight = 180;

      // Generate random position within screen bounds
      const randomX = Math.random() * Math.max(0, screenWidth - popupWidth);
      const randomY = Math.random() * Math.max(0, screenHeight - popupHeight);

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

  useEffect(() => {
    if (isOpen) {
      playSound("error");
    }
  }, [isOpen]);

  return position.x !== 0 && position.y !== 0 ? (
    <AnimatePresence>
      {isOpen && (
        <Draggable handle=".title-bar" defaultPosition={position}>
          <motion.div
            className="window z-50 flex flex-col absolute"
            style={{ width: "420px" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            {/* Authentic xp.css title bar */}
            <div className="title-bar select-none">
              <div className="title-bar-text flex items-center gap-1.5">
                <img
                  src={icons[type]}
                  alt={type}
                  className="w-4 h-4 pointer-events-none"
                  draggable={false}
                />
                <span className="font-bold">
                  {title || "System Error"}
                </span>
              </div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={onClose} />
              </div>
            </div>

            {/* Body — tan XP face, error icon + message, centered OK */}
            <div
              className="window-body flex flex-col gap-3"
              style={{ background: "var(--xp-face)" }}
            >
              <div className="flex gap-4 items-start p-2">
                <img
                  src={icons[type]}
                  alt={type}
                  className="shrink-0"
                  style={{ width: "32px", height: "32px" }}
                  draggable={false}
                />
                <p
                  className="text-black flex-1"
                  style={{
                      fontFamily: "Tahoma, Verdana, sans-serif",
                    fontSize: "13px",
                    lineHeight: "17px",
                  }}
                >
                  {message}
                </p>
              </div>
              <div className="flex justify-center pb-2">
                <button
                  onClick={onClose}
                  style={{ minWidth: "75px" }}
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  ) : null;
}

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import StartMenu from "./StartMenu";
import { windows } from "data/windows";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({
  activeWindows,
  setActiveWindows,
  bringWindowToFront,
  windowOrder,
}: {
  activeWindows: Record<string, boolean>;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  bringWindowToFront: (windowTitle: string) => void;
  windowOrder: string[];
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString("no"));
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [startMenuClippy, setStartMenuClippy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("no"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isStartMenuOpen) {
      setStartMenuClippy(2);
    }
  }, [isStartMenuOpen]);

  useEffect(() => {
    if (startMenuClippy === 0) {
      const timer = setTimeout(() => {
        setStartMenuClippy(1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [startMenuClippy]);

  const frontmostWindow = windowOrder[windowOrder.length - 1];

  const handleTaskButton = (windowTitle: string) => {
    const isActive = activeWindows[windowTitle];
    const isFrontmost = windowTitle === frontmostWindow;

    if (isActive && isFrontmost) {
      setActiveWindows((prev) => ({ ...prev, [windowTitle]: false }));
    } else {
      setActiveWindows((prev) => ({ ...prev, [windowTitle]: true }));
      bringWindowToFront(windowTitle);
    }
  };

  return (
    <>
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        setActiveWindows={setActiveWindows}
        bringWindowToFront={bringWindowToFront}
      />
      <div className="navbar fixed w-full h-14 bottom-0 flex justify-between items-center bg-gradient-to-b from-blue-400 to-blue-700 z-50">
        {/* START BAR */}
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className="flex w-[164px] gap-2 pl-4 pr-6 bg-gradient-to-b from-green-400 to-green-700 hover:from-green-500 hover:to-green-800 active:from-green-600 active:to-green-900 h-14 justify-center items-center rounded-r-xl text-white text-shadow cursor-pointer transition-colors ease-in-out shrink-0"
        >
          <img src="start_logo.png" alt="start" className="w-9 h-8" />
          <span className="transform -skew-x-[20deg] text-xl select-none">
            start
          </span>
        </button>

        <AnimatePresence>
          {startMenuClippy === 1 && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed bottom-16 left-2 z-50 flex flex-col items-start"
            >
              <img
                src="clippy.png"
                alt="Clippy"
                className="relative w-20 h-20 top-5 scale-x-[-1]"
              />
              <div className="p-4 bg-white border-2 border-gray-400 rounded-lg shadow-lg">
                <p className="text-sm text-black -my-2">
                  ↓ Click the start button
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TASKBAR BUTTONS */}
        <div className="flex w-full gap-0.5 h-full ml-1 items-center overflow-x-auto overflow-y-hidden winxp-scrollbar">
          {windows
            .filter((w) => !w.isClippyExe)
            .map((win) => {
              const isActive = activeWindows[win.title];
              const isFrontmost = win.title === frontmostWindow;
              const label = win.title.replace(/_/g, " ");
              return (
                <button
                  key={win.title}
                  onClick={() => handleTaskButton(win.title)}
                  className={`flex items-center gap-1.5 h-10 px-2 my-1 rounded-sm border border-transparent min-w-0 max-w-[180px] shrink-0 transition-all duration-75 ${
                    isActive
                      ? isFrontmost
                        ? "bg-gradient-to-b from-[#d4d9e4] to-[#b5bfd4] border-[#8b96ad] shadow-inner"
                        : "bg-gradient-to-b from-[#dee3ed] to-[#c6cfdf] border-[#9aa4bb]"
                      : "bg-gradient-to-b from-[#4f87d4] to-[#3a6fc9] hover:from-[#5c92df] hover:to-[#4679d4]"
                  }`}
                >
                  <img
                    src={win.icon}
                    alt=""
                    className="w-5 h-5 shrink-0 select-none pointer-events-none"
                    draggable={false}
                  />
                  <span
                    className={`text-xs truncate select-none ${
                      isActive ? "text-black" : "text-white text-shadow"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
        </div>

        {/* SYSTEM TRAY */}
        <div className="flex gap-2 pr-4 pl-6 bg-gradient-to-b from-cyan-400 to-cyan-700 h-14 justify-center items-center rounded-l-xl text-white text-shadow shrink-0">
          <span className="text-xl select-none">{time}</span>
        </div>
      </div>
    </>
  );
}
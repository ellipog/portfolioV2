import { Dispatch, SetStateAction, useEffect, useState } from "react";
import StartMenu from "./StartMenu";
import { windows } from "data/windows";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({
  activeWindows,
  setActiveWindows,
}: {
  activeWindows: Record<string, boolean>;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
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

      return () => {
        clearTimeout(timer);
      };
    }
  }, [startMenuClippy]);

  return (
    <>
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        setActiveWindows={setActiveWindows}
      />
      <div className="navbar fixed w-full h-14 bottom-0 flex justify-between items-center bg-gradient-to-b from-blue-400 to-blue-700 z-50">
        {/* START BAR */}
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className="flex w-[164px] gap-2 pl-4 pr-6 bg-gradient-to-b from-green-400 to-green-700 hover:from-green-500 hover:to-green-800 active:from-green-600 active:to-green-900 h-14 justify-center items-center rounded-r-xl text-white text-shadow cursor-pointer transition-colors ease-in-out"
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
        {/* ICON BAR */}
        <div className="flex w-full gap-2 h-12 ml-4 justify-start items-center rounded-l-xl text-white font-bold text-shadow">
          {windows.map((window) => (
            <button
              key={window.title}
              className={`app-icon flex flex-col items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 ease-in-out ${
                activeWindows[window.title] ? "bg-white/50" : "bg-white/10"
              }`}
              onClick={() => {
                setActiveWindows((prev) => ({
                  ...prev,
                  [window.title]: !prev[window.title],
                }));
              }}
            >
              <img src={window.icon} alt={window.title} className="w-7 h-7" />
            </button>
          ))}
        </div>
        {/* END BAR */}
        <div className="flex gap-2 pr-4 pl-6 bg-gradient-to-b from-cyan-400 to-cyan-700 h-14 justify-center items-center rounded-l-xl text-white text-shadow">
          <span className="text-xl">{time}</span>
        </div>
      </div>
    </>
  );
}

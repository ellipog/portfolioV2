import { Dispatch, SetStateAction, useEffect, useState } from "react";
import StartMenu from "./StartMenu";
import { windows } from "data/windows";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, Wifi, Usb } from "lucide-react";

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
  const [muted, setMuted] = useState(false);

  const handleVolumeClick = () => {
    // Delegate to the existing window-global mute toggle ("all" system sounds).
    (window as any).toggleMute?.("all");
    setMuted(!!(window as any).muteSystemSounds);
  };
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [startMenuClippy, setStartMenuClippy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
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
      <div
        className="navbar fixed w-full bottom-0 flex justify-between items-stretch z-50"
        style={{
          height: "var(--taskbar-height)",
          background:
            "linear-gradient(to bottom, #2a77d6 0%, #2a77d6 8%, #2870cc 40%, #245edb 88%, #245edb 93%, #2150b8 95%, #2150b8 100%)",
          borderTop: "1px solid #1e3f8a",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        {/* START BUTTON — green pill, right-rounded */}
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className="relative flex items-center justify-start gap-1.5 pl-2.5 pr-5 text-white cursor-pointer transition-colors ease-in-out shrink-0 overflow-hidden"
          style={{
            width: "110px",
            background:
              "linear-gradient(to bottom, #5eac56 0%, #4f9a48 40%, #3d8b34 55%, #2d7d28 100%)",
            borderRadius: "0 12px 12px 0",
            textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
          }}
        >
          {/* glossy highlight overlay on top ~40% */}
          <span
            className="pointer-events-none absolute left-0 right-0 top-0"
            style={{
              height: "40%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0))",
              borderRadius: "0 12px 0 0",
            }}
          />
          <img
            src="start_logo.png"
            alt="start"
            className="relative w-5 h-5 shrink-0"
              style={{ width: "24px", height: "24px" }}
          />
          <span
            className="relative font-bold italic lowercase select-none"
            style={{
              fontSize: "15px",
              transform: "skewX(-8deg)",
              transformOrigin: "center",
            }}
          >
            start
          </span>
        </button>

        {/* left grip line */}
        <div
          className="self-center ml-1 mr-0.5 shrink-0"
          style={{
            width: "2px",
            height: "60%",
            background: "rgba(255,255,255,0.25)",
            boxShadow: "-1px 0 0 rgba(0,0,0,0.2)",
          }}
        />

        <AnimatePresence>
          {startMenuClippy === 1 && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed z-50 flex flex-col items-start"
              style={{ bottom: "calc(var(--taskbar-height) + 8px)", left: "8px" }}
            >
              <img
                src="clippy.png"
                alt="Clippy"
                className="relative w-20 h-20 top-5 scale-x-[-1]"
              />
              <div
                className="p-4 border-[var(--xp-shadow)]"
                style={{
                  background: "var(--xp-face)",
                  boxShadow:
                    "inset 1px 1px 0 var(--xp-3dlight), inset -1px -1px 0 var(--xp-shadow), 2px 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <p className="text-sm text-black -my-2">
                  ↓ Click the start button
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TASKBAR BUTTONS */}
        <div className="flex w-full gap-0.5 items-center overflow-x-auto overflow-y-hidden winxp-scrollbar px-0.5">
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
                  className={`flex items-center gap-1.5 px-2 rounded-sm min-w-0 max-w-[220px] shrink-0 transition-all duration-75 ${
                    isActive
                      ? isFrontmost
                        ? "task-btn-pressed"
                        : "task-btn-inactive"
                      : "task-btn-closed"
                  }`}
                  style={{ height: "28px" }}
                >
                  <img
                    src={win.icon}
                    alt=""
                    className="w-5 h-5 shrink-0 select-none pointer-events-none"
                    style={{ width: "20px", height: "20px" }}
                    draggable={false}
                  />
                  <span
                    className={`text-[13px] truncate select-none leading-none ${
                      isActive && isFrontmost
                        ? "text-black"
                        : "text-white"
                    }`}
                    style={
                      isActive && isFrontmost
                        ? undefined
                        : { textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }
                    }
                  >
                    {label}
                  </span>
                </button>
              );
            })}
        </div>

        {/* SYSTEM TRAY — recessed area with inset divider */}
        <div className="flex items-stretch shrink-0">
          <div
            className="flex items-center gap-1.5 px-2"
            style={{
              borderLeft: "2px solid #245edb",
              boxShadow:
                "inset 1px 1px 0 #808080, inset 1px -1px 0 #fff",
              background:
                "linear-gradient(to bottom, #2a77d6 0%, #245edb 90%, #2150b8 100%)",
            }}
          >
            <button
              onClick={handleVolumeClick}
              title={muted ? "Unmute" : "Mute"}
              className="text-white hover:bg-white/20 rounded-sm p-0.5 cursor-pointer"
              style={{ lineHeight: 0 }}
            >
              {muted ? (
                <VolumeX size={16} strokeWidth={2.5} />
              ) : (
                <Volume2 size={16} strokeWidth={2.5} />
              )}
            </button>
            <Wifi size={16} strokeWidth={2.5} className="text-white" />
            <Usb size={16} strokeWidth={2.5} className="text-white" />
            <span
              className="text-white select-none ml-1"
              style={{
                fontSize: "13px",
                textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
              }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

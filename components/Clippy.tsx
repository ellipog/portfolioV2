import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  angryMessages,
  angryResponses,
  defaultTips,
  windowMessages,
  windowResponseActions,
  type ClippyAction,
  type ClippyResponse,
  type PortfolioWindowKey,
} from "data/clippyMessages";
import { playSound } from "utils/playSound";

const WALLPAPER_MAP: Record<string, { url: string; color: string }> = {
  bliss: { url: "/desktop_bg.png", color: "#245EDC" },
  autumn: { url: "/autumn.jpg", color: "#5c3317" },
  red_moon: { url: "/red_moon_desert.jpg", color: "#a52a2a" },
  follow: { url: "/follow.jpg", color: "#4a6741" },
  classic_blue: { url: "", color: "#3b6ea5" },
};

declare global {
  interface Window {
    handleClippyWindowClick?: (windowTitle: string) => void;
    openPortfolioWindow?: (key: string) => void;
    closePortfolioWindow?: (key: string) => void;
    closeAllPortfolioWindows?: () => void;
    navigateIE?: (url: string) => void;
    changeWallpaper?: (id: string, url?: string, color?: string) => void;
    setSoundVolume?: (level: number) => void;
    killExplorer?: () => void;
    restoreExplorer?: () => void;
    triggerClippyDefense?: () => void;
    spawnErrorPopup?: (message?: string) => void;
    spawnErrorBatch?: (count: number) => void;
    muteSystemSounds?: boolean;
    startupSoundsEnabled?: boolean;
    systemAlertsEnabled?: boolean;
    toggleMute?: (target: "alerts" | "startup" | "all") => void;
    setWallpaperDirect?: (id: string) => void;
  }
}

interface ClippyProps {
  isAngry?: boolean;
}

function executeClippyAction(action: ClippyAction) {
  if (typeof window === "undefined") return;

  switch (action.type) {
    case "openWindow":
      window.openPortfolioWindow?.(action.window);
      break;
    case "openWindows":
      action.windows.forEach((w) => window.openPortfolioWindow?.(w));
      if (action.windows.length > 0) {
        window.openPortfolioWindow?.(action.windows[action.windows.length - 1]);
      }
      break;
    case "openAllWindows":
      const allKeys = ["Skills", "Projects", "Work_Experience", "Minesweeper", "Education", "Paint", "Internet_Explorer", "Control_Panel", "Winamp", "Task_Manager"];
      allKeys.forEach((k) => window.openPortfolioWindow?.(k));
      break;
    case "closeWindow":
      window.closePortfolioWindow?.(action.window);
      break;
    case "closeAllWindows":
      window.closeAllPortfolioWindows?.();
      break;
    case "openIE":
      window.openPortfolioWindow?.("Internet_Explorer");
      window.navigateIE?.(action.url);
      break;
    case "changeWallpaper": {
      const wp = WALLPAPER_MAP[action.id];
      if (wp) {
        window.changeWallpaper?.(action.id, wp.url, wp.color);
      } else {
        window.changeWallpaper?.(action.id);
      }
      if (action.openControlPanel !== false) {
        window.openPortfolioWindow?.("Control_Panel");
      }
      break;
    }
    case "setWallpaperDirect": {
      const wp = WALLPAPER_MAP[action.id];
      if (wp) {
        window.changeWallpaper?.(action.id, wp.url, wp.color);
      } else {
        window.changeWallpaper?.(action.id);
      }
      break;
    }
    case "playSound":
      playSound(action.sound);
      break;
    case "setVolume":
      window.setSoundVolume?.(action.level);
      break;
    case "spawnError":
      window.spawnErrorPopup?.(action.message);
      break;
    case "spawnErrorBatch":
      window.spawnErrorBatch?.(action.count);
      break;
    case "killExplorer":
      window.killExplorer?.();
      break;
    case "restoreExplorer":
      window.restoreExplorer?.();
      break;
    case "triggerClippyDefense":
      window.triggerClippyDefense?.();
      break;
    case "toggleMute":
      window.toggleMute?.(action.target);
      break;
    case "tourPortfolio":
      window.openPortfolioWindow?.("Internet_Explorer");
      window.navigateIE?.("http://www.msn.elliot");
      window.openPortfolioWindow?.("Projects");
      window.openPortfolioWindow?.("Skills");
      break;
    case "dismiss":
      break;
  }
}

export default function Clippy({ isAngry = false }: ClippyProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const clickedWindows = useRef<Set<string>>(new Set());
  const [currentResponses, setCurrentResponses] = useState<ClippyResponse[]>([]);
  const [mounted, setMounted] = useState(false);

  const pickRandomTip = useCallback(() => {
    const tip = defaultTips[Math.floor(Math.random() * defaultTips.length)];
    setMessage(tip.message);
    setCurrentResponses(tip.responses);
  }, []);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      window.handleClippyWindowClick = (windowTitle: string) => {
        handleWindowClick(windowTitle);
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.handleClippyWindowClick;
      }
    };
  }, []);

  useEffect(() => {
    if (isAngry) {
      const randomIndex = Math.floor(Math.random() * angryMessages.length);
      setMessage(angryMessages[randomIndex]);
      setCurrentResponses([...angryResponses]);
      return;
    }

    pickRandomTip();
  }, [isAngry, pickRandomTip]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isVisible && !isAngry) {
      const delay = Math.floor(Math.random() * (900000 - 120000) + 120000);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
        pickRandomTip();
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, isAngry, pickRandomTip]);

  useEffect(() => {
    if (isAngry) {
      playSound("angry");
    } else if (isVisible) {
      playSound("notify");
    }
  }, [isVisible, isAngry]);

  const handleWindowClick = (windowTitle: string) => {
    if (!clickedWindows.current.has(windowTitle)) {
      setIsVisible(false);
      setTimeout(() => {
        const key = windowTitle as PortfolioWindowKey;
        const messages = windowMessages[key];
        const responses = windowResponseActions[key];

        if (!messages || !responses) return;

        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        const shuffledResponses = [...responses].sort(
          () => Math.random() - 0.5
        );
        const selectedResponses = shuffledResponses.slice(0, 3);

        setMessage(randomMessage);
        setCurrentResponses(selectedResponses);
        clickedWindows.current.add(windowTitle);

        setTimeout(() => {
          setIsVisible(true);
        }, 300);
      }, 100);
    }
  };

  const handleResponseClick = (action: ClippyAction) => {
    if (!isAngry) {
      playSound("click");
      executeClippyAction(action);
      setIsVisible(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className={`fixed right-2 z-50 flex flex-col items-end max-w-xs ${
            !isAngry ? "clippy-normal" : ""
          }`}
          style={{ bottom: "calc(var(--taskbar-height) + 8px)" }}
        >
          <img
            src={"clippy.png"}
            alt="Clippy"
            className={`relative w-60 h-60 top-14 left-94 ${
              isAngry ? "animate-shake" : ""
            }`}
            style={
              isAngry
                ? {
                    filter: "hue-rotate(320deg) brightness(1.2) saturate(1.5)",
                  }
                : undefined
            }
          />
          <div
            className={`p-4 max-w-xs ${
              isAngry
                ? "border-2 border-red-600 animate-pulse"
                : "border-[var(--xp-shadow)]"
            }`}
            style={{
              background: "var(--xp-face)",
              fontFamily: "Tahoma, Verdana, sans-serif",
              fontSize: "13px",
              boxShadow: isAngry
                ? "2px 2px 4px rgba(0,0,0,0.3)"
                : "inset 1px 1px 0 var(--xp-3dlight), inset -1px -1px 0 var(--xp-shadow), 2px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <p
              className={`text-sm mb-4 ${
                isAngry ? "text-red-600 font-bold" : "text-black"
              }`}
            >
              {message}
            </p>
            <div className="flex flex-col gap-2">
              {currentResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() =>
                    isAngry
                      ? setIsVisible(false)
                      : handleResponseClick(response.action)
                  }
                  className={`text-left text-sm ${
                    isAngry
                      ? "text-red-600 hover:text-red-800"
                      : "text-[var(--xp-select)] hover:underline"
                  }`}
                >
                  {response.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

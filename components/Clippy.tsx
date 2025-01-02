import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  angryMessages,
  angryResponses,
  defaultQuestions,
  windowMessages,
  windowResponses,
} from "data/clippyMessages";

// Declare global window interface
declare global {
  interface Window {
    handleClippyWindowClick?: (windowTitle: string) => void;
  }
}

type WindowTitles =
  | "Skills"
  | "Projects"
  | "Work_Experience"
  | "Minesweeper"
  | "Education";

interface ClippyProps {
  isAngry?: boolean;
}

export default function Clippy({ isAngry = false }: ClippyProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const clickedWindows = useRef<Set<string>>(new Set());
  const [currentResponseSet, setCurrentResponseSet] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

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
      setCurrentResponseSet([...angryResponses]);
      return;
    }

    const randomIndex = Math.floor(Math.random() * defaultQuestions.length);
    setMessage(defaultQuestions[randomIndex]);
    setCurrentResponseSet(["I'm good, thanks", "Please leave me alone"]);
  }, [defaultQuestions, isAngry]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isVisible && !isAngry) {
      const delay = Math.floor(Math.random() * (900000 - 120000) + 120000);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
        const randomIndex = Math.floor(Math.random() * defaultQuestions.length);
        setMessage(defaultQuestions[randomIndex]);
        setCurrentResponseSet(["I'm good, thanks", "Please leave me alone"]);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, defaultQuestions, isAngry]);

  const handleWindowClick = (windowTitle: string) => {
    if (!clickedWindows.current.has(windowTitle)) {
      setIsVisible(false);
      setTimeout(() => {
        const messages =
          windowMessages[windowTitle as keyof typeof windowMessages];
        const responses =
          windowResponses[windowTitle as keyof typeof windowResponses];

        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        const shuffledResponses = [...responses].sort(
          () => Math.random() - 0.5
        );
        const selectedResponses = shuffledResponses.slice(0, 2);

        setMessage(randomMessage);
        setCurrentResponseSet(selectedResponses);
        clickedWindows.current.add(windowTitle);

        setTimeout(() => {
          setIsVisible(true);
        }, 300);
      }, 100);
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
          className={`fixed bottom-16 right-2 z-50 flex flex-col items-end ${
            !isAngry ? "clippy-normal" : ""
          }`}
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
            className={`p-4 bg-white border-2 rounded-lg shadow-lg ${
              isAngry ? "border-red-600 animate-pulse" : "border-gray-400"
            }`}
          >
            <p
              className={`text-sm mb-4 ${
                isAngry ? "text-red-600 font-bold" : "text-black"
              }`}
            >
              {message}
            </p>
            <div className="flex flex-col gap-2">
              {currentResponseSet.map((response, index) => (
                <button
                  key={index}
                  onClick={() => !isAngry && setIsVisible(false)}
                  className={`text-left text-sm ${
                    isAngry
                      ? "text-red-600 hover:text-red-800"
                      : "text-blue-600 hover:text-blue-800"
                  } hover:underline`}
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

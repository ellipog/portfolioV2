import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";

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

export default function Clippy() {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const clickedWindows = useRef<Set<string>>(new Set());
  const [currentResponseSet, setCurrentResponseSet] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const windowMessages: Record<WindowTitles, string[]> = useMemo(
    () => ({
      Skills: [
        "Want to know what technologies I'm proficient in?",
        "Looking for details about my technical expertise?",
        "Curious about my tech stack and tools?",
        "Let me show you my development skills!",
      ],
      Projects: [
        "Interested in seeing what I've built?",
        "Want to explore my portfolio of projects?",
        "Check out some of my coolest developments!",
        "Let me show you what I've been working on!",
      ],
      Work_Experience: [
        "Curious about my professional background?",
        "Want to know where I've worked?",
        "Interested in my career journey?",
        "Let me tell you about my industry experience!",
      ],
      Minesweeper: [
        "Need a break? Try finding all the mines!",
        "Up for a quick game of Minesweeper?",
        "Want to test your mine-detecting skills?",
        "Care for some classic Windows entertainment?",
      ],
      Education: [
        "Looking to learn about my educational journey?",
        "Want to know about my academic background?",
        "Curious about where I studied?",
        "Let me share my educational experience!",
      ],
    }),
    []
  );

  const windowResponses: Record<WindowTitles, string[]> = useMemo(
    () => ({
      Skills: [
        "Whatever, show me what you know",
        "I'll figure it out myself",
        "Fine, impress me",
        "This better be good...",
        "Let's see what you've got",
      ],
      Projects: [
        "Fine, show me what you've done",
        "I don't need your help",
        "Alright, what have you built?",
        "This should be interesting...",
        "Go on then, surprise me",
      ],
      Work_Experience: [
        "Yeah yeah, tell me about your jobs",
        "I can read, you know",
        "Let's hear your work story",
        "This better be worth my time",
        "Fine, what's your experience?",
      ],
      Minesweeper: [
        "This better be good",
        "Not interested",
        "I'm terrible at this game",
        "Let's see if I remember how to play",
        "Hope it's better than Windows 95",
      ],
      Education: [
        "Did you even go to school?",
        "I'll find out myself",
        "What makes you qualified?",
        "Show me your credentials",
        "Alright, enlighten me",
      ],
    }),
    []
  );

  const defaultQuestions = useMemo(
    () => [
      "It looks like you're viewing a portfolio! Would you like help with that?",
      "Hey there! Want to learn more about Elliot's skills?",
      "Looking for a skilled developer? I can help you navigate!",
      "Need information about work experience? Let me assist you!",
      "Interested in seeing some projects? I can point you in the right direction!",
    ],
    []
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * defaultQuestions.length);
    setMessage(defaultQuestions[randomIndex]);
    setCurrentResponseSet(["I'm good, thanks", "Please leave me alone"]);
  }, [defaultQuestions]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isVisible) {
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
  }, [isVisible, defaultQuestions]);

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
          className="fixed bottom-16 right-2 z-50 flex flex-col items-end"
        >
          <img
            src="clippy.png"
            alt="Clippy"
            className="relative w-60 h-60 top-14 left-94"
          />
          <div className="p-4 bg-white border-2 border-gray-400 rounded-lg shadow-lg">
            <p className="text-sm text-black mb-4">{message}</p>
            <div className="flex flex-col gap-2">
              {currentResponseSet.map((response, index) => (
                <button
                  key={index}
                  onClick={() => setIsVisible(false)}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
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

import { motion, AnimatePresence } from "framer-motion";
import { personal, windows } from "data/windows";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Clipboard, LogOut, Power } from "lucide-react";
import { playSound } from "utils/playSound";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  bringWindowToFront: (windowTitle: string) => void;
}

export default function StartMenu({
  isOpen,
  onClose,
  setActiveWindows,
  bringWindowToFront,
}: StartMenuProps) {
  const [showShutDownDialog, setShowShutDownDialog] = useState(false);

  const handleShutDown = () => {
    setShowShutDownDialog(true);
  };

  const handleShutDownAction = (action: "shutdown" | "restart" | "cancel") => {
    setShowShutDownDialog(false);
    onClose();
    if (action === "cancel") return;

    setActiveWindows({});

    if (action === "restart" && (window as any).restartPC) {
      playSound("shutdown");
      setTimeout(() => (window as any).restartPC(), 500);
      return;
    }

    if (action === "shutdown") {
      playSound("shutdown");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <button className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="start-menu fixed bottom-12 left-0 w-80 bg-blue-100 border-2 border-blue-800 rounded-tr-xl z-50 shadow-xl"
          >
            {/* User Info Section */}
            <div className="flex items-center gap-3 p-2 bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-tr-lg">
              <img
                src="elliot.jpg"
                alt="User"
                className="w-12 h-12 border-2 rounded-[4px] border-white"
              />
              <div>
                <div className="font-bold">{personal.name}</div>
                <div className="text-sm">{personal.profession}</div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1 text-black max-h-[50vh] overflow-y-auto winxp-scrollbar">
              {windows
                .filter((window) => !window.isClippyExe)
                .map((window) => (
                  <MenuItem
                    key={window.title}
                    icon={window.icon}
                    text={window.title.replace("_", " ")}
                    copy={false}
                    type="app"
                    setActiveWindows={setActiveWindows}
                    bringWindowToFront={bringWindowToFront}
                  />
                ))}
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-300 p-2 mb-2 bg-blue-50 text-black">
              <MenuItem
                icon="email.png"
                text={personal.email}
                copy={true}
                type="text"
                bringWindowToFront={bringWindowToFront}
              />
              <MenuItem
                icon="phone.png"
                text={personal.phone}
                copy={true}
                type="text"
                bringWindowToFront={bringWindowToFront}
              />
              <MenuItem
                icon="age.png"
                text={personal.age}
                copy={false}
                type="text"
                bringWindowToFront={bringWindowToFront}
              />
              <MenuItem
                icon="linkedin.png"
                text={personal.linkedin}
                copy={true}
                type="link"
                bringWindowToFront={bringWindowToFront}
              />
            </div>

            {/* Shut Down / Log Off */}
            <div className="border-t border-gray-300 p-2 bg-blue-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShutDown();
                }}
                className="flex items-center gap-2 p-1 w-full hover:bg-blue-600 hover:text-white active:bg-blue-700 transition-colors ease-in-out rounded-sm text-black"
              >
                <Power className="w-5 h-5" />
                <span className="text-sm">Shut Down...</span>
              </button>
            </div>
          </motion.div>

          {/* Shut Down Dialog */}
          {showShutDownDialog && (
            <ShutDownDialog
              onAction={handleShutDownAction}
              onClose={() => setShowShutDownDialog(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

function ShutDownDialog({
  onAction,
  onClose,
}: {
  onAction: (action: "shutdown" | "restart" | "cancel") => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#ece9d8] border-2 border-[#0a246a] shadow-2xl w-[360px]"
      >
        <div className="bg-gradient-to-b from-[#0a246a] to-[#3a6ea5] text-white px-2 py-1 flex items-center gap-2 text-sm font-bold">
          <Power className="w-4 h-4" />
          Shut Down Windows
        </div>
        <div className="p-6">
          <p className="text-sm text-black mb-6 text-center">
            Are you sure you want to shut down your computer?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onAction("shutdown")}
              className="px-4 py-1.5 bg-[#ece9d8] border border-[#0a246a] text-black text-sm hover:bg-[#d4d0c8] active:bg-[#c4c0b8] min-w-[80px]"
            >
              Shut Down
            </button>
            <button
              onClick={() => onAction("restart")}
              className="px-4 py-1.5 bg-[#ece9d8] border border-[#0a246a] text-black text-sm hover:bg-[#d4d0c8] active:bg-[#c4c0b8] min-w-[80px]"
            >
              Restart
            </button>
            <button
              onClick={() => onAction("cancel")}
              className="px-4 py-1.5 bg-[#ece9d8] border border-[#0a246a] text-black text-sm hover:bg-[#d4d0c8] active:bg-[#c4c0b8] min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface MenuItemProps {
  icon: string;
  text: string;
  copy: boolean;
  type: "app" | "text" | "link";
  setActiveWindows?: Dispatch<SetStateAction<Record<string, boolean>>>;
  bringWindowToFront?: (windowTitle: string) => void;
}

function MenuItem({
  icon,
  text,
  copy,
  type,
  setActiveWindows,
  bringWindowToFront,
}: MenuItemProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (type === "link") {
      window.open(text, "_blank");
      return;
    }

    if (copy) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      playSound("click");
      setTimeout(() => setIsCopied(false), 2000);
      return;
    }

    const windowTitle = text.replace(" ", "_");
    setActiveWindows?.((prev) => ({
      ...prev,
      [windowTitle]: true,
    }));
    bringWindowToFront?.(windowTitle);
  };

  return (
    <button
      className={`flex items-center gap-2 p-1 hover:text-white cursor-pointer relative w-full hover:bg-blue-600 active:bg-blue-700 transition-colors ease-in-out group ${
        type === "app" && "app-icon"
      }`}
      onClick={handleClick}
    >
      <img src={icon} alt={text} className="w-6 h-6" />
      <span className="flex-1 text-left">
        {type === "link" ? "LinkedIn" : text}
      </span>
      {type === "link" && (
        <span className="text-blue-500 group-hover:text-white transition-colors ease-in-out">
          →
        </span>
      )}
      <span
        className={`absolute right-2 text-sm text-green-600 group-hover:text-green-300 transition-all duration-50 ${
          isCopied ? "opacity-100" : "opacity-0"
        }`}
      >
        Copied!
      </span>
      <span
        className={`absolute right-[0.25rem] text-sm flex justify-end text-blue-500 group-hover:text-white transition-all ease-in-out ${
          copy && !isCopied ? "opacity-100" : "opacity-0"
        }`}
      >
        <Clipboard className="w-3 h-3" />
      </span>
    </button>
  );
}
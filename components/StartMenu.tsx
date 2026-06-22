import { motion, AnimatePresence } from "framer-motion";
import { personal, windows } from "data/windows";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Clipboard,
  LogOut,
  Power,
  HelpCircle,
  Search,
  Terminal,
  Folder,
  MonitorCog,
  SlidersHorizontal,
  MoonStar,
  RotateCcw,
} from "lucide-react";
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

  const openWindow = (windowTitle: string) => {
    setActiveWindows((prev) => ({ ...prev, [windowTitle]: true }));
    bringWindowToFront(windowTitle);
    onClose();
  };

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

  // Pinned programs for the left column (exclude clippy + control panel/task
  // manager which live on the right column as "places").
  const pinnedPrograms = windows.filter(
    (w) => !w.isClippyExe && w.title !== "Control_Panel"
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <button className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.12 }}
            className="start-menu fixed left-0 z-50 flex flex-col"
            style={{
              bottom: "var(--taskbar-height)",
              width: "420px",
              background: "var(--xp-face)",
              border: "1px solid #0a246a",
              borderRadius: "0 8px 0 0",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
              fontFamily: "Tahoma, Verdana, sans-serif",
            }}
          >
            {/* HEADER — blue gradient, user photo + name */}
            <div
              className="flex items-center gap-3 px-2 py-1.5"
              style={{
                background:
                  "linear-gradient(to bottom, #1c6ee8 0%, #1654c4 100%)",
                borderRadius: "0 8px 0 0",
              }}
            >
              <div
                className="bg-white flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  border: "2px solid #78aef0",
                }}
              >
                <img
                  src="elliot.jpg"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="text-white font-bold"
                style={{
                  fontSize: "16px",
                  textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
                }}
              >
                {personal.name}
              </span>
            </div>

            {/* TWO-COLUMN BODY */}
            <div className="flex flex-1 min-h-0">
              {/* LEFT COLUMN — pinned programs + contacts */}
              <div
                className="flex flex-col"
                style={{
                  width: "50%",
                  background: "#fff",
                  borderRight: "1px solid #c5d9f1",
                }}
              >
                <div
                  className="flex-1 overflow-y-auto winxp-scrollbar py-1"
                  style={{ maxHeight: "50vh" }}
                >
                  {pinnedPrograms.map((win) => (
                    <StartItem
                      key={win.title}
                      icon={<img src={win.icon} alt="" className="w-[28px] h-[28px]" draggable={false} />}
                      label={win.title.replace(/_/g, " ")}
                      onClick={() => openWindow(win.title)}
                    />
                  ))}

                  {/* contacts folded in as pinned items */}
                  <div
                    className="my-1 mx-2"
                    style={{ borderTop: "1px solid #c5d9f1" }}
                  />
                  <ContactItem icon="email.png" text={personal.email} type="text" />
                  <ContactItem icon="phone.png" text={personal.phone} type="text" />
                  <ContactItem icon="age.png" text={personal.age} type="text" />
                  <ContactItem icon="linkedin.png" text="LinkedIn" type="link" />
                </div>

                {/* All Programs */}
                <div
                  className="px-2 py-1 flex items-center gap-2 cursor-default"
                  style={{ borderTop: "1px solid #c5d9f1", color: "#000" }}
                  title="All Programs"
                >
                  <Folder size={24} className="text-[#ffcb00]" />
                  <span className="text-[13px]">All Programs</span>
                  <span className="ml-auto text-[12px]">►</span>
                </div>
              </div>

              {/* RIGHT COLUMN — places (XP blue tint) */}
              <div
                className="flex flex-col py-1"
                style={{ width: "50%", background: "#d3e5fa" }}
              >
                <StartItem
                  icon={<Folder size={28} className="text-[#ffcb00]" />}
                  label="My Documents"
                  onClick={() => openWindow("Projects")}
                />
                <PlaceSeparator />
                <StartItem
                  icon={<MonitorCog size={28} className="text-[#3b6ea5]" />}
                  label="My Computer"
                  onClick={() => openWindow("Task_Manager")}
                />
                <PlaceSeparator />
                <StartItem
                  icon={<SlidersHorizontal size={26} className="text-[#666]" />}
                  label="Control Panel"
                  onClick={() => openWindow("Control_Panel")}
                />
                <PlaceSeparator />
                <StartItem
                  icon={<HelpCircle size={28} className="text-[#1a5fb4]" />}
                  label="Help and Support"
                  onClick={() => openWindow("clippy.exe")}
                />
                <StartItem
                  icon={<Search size={26} className="text-[#1a5fb4]" />}
                  label="Search"
                  onClick={() => openWindow("Internet_Explorer")}
                />
                <StartItem
                  icon={<Terminal size={26} className="text-[#000]" />}
                  label="Run..."
                  onClick={() => openWindow("clippy.exe")}
                />
              </div>
            </div>

            {/* FOOTER — blue gradient, Log Off + Turn Off */}
            <div
              className="flex items-center justify-between px-2 py-1.5"
              style={{
                background:
                  "linear-gradient(to bottom, #1c6ee8 0%, #1654c4 100%)",
                borderTop: "1px solid #0a246a",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Log Off = restart boot sequence (same feel as XP logoff)
                  handleShutDownAction("restart");
                }}
                className="flex items-center gap-1.5 text-white cursor-pointer hover:underline"
                style={{ fontSize: "13px", textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}
                title="Log Off"
              >
                <LogOut size={18} className="text-[#d8e4f8]" />
                <span>Log Off</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShutDown();
                }}
                className="flex items-center gap-1.5 text-white cursor-pointer hover:underline"
                style={{ fontSize: "13px", textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}
                title="Turn Off Computer"
              >
                <Power size={18} className="text-[#ff4444]" />
                <span>Turn Off Computer</span>
              </button>
            </div>
          </motion.div>

          {/* Turn off computer dialog */}
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

/** A generic left/right start menu item with the authentic XP hover. */
function StartItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 w-full text-left cursor-pointer"
      style={{
        padding: "3px 8px",
        minHeight: "32px",
        fontSize: "13px",
        color: "#000",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#2f71cd";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#000";
      }}
    >
      <span className="shrink-0 flex items-center justify-center" style={{ width: "28px" }}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function PlaceSeparator() {
  return (
    <div
      className="my-1 mx-2"
      style={{ borderTop: "1px solid #a8c4e8" }}
    />
  );
}

/** Contact item — copyable text / external link, XP-styled. */
function ContactItem({
  icon,
  text,
  type,
}: {
  icon: string;
  text: string;
  type: "text" | "link";
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (type === "link") {
      window.open(text, "_blank");
      return;
    }
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    playSound("click");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-2 w-full text-left relative cursor-pointer"
      style={{
        padding: "3px 8px",
        minHeight: "32px",
        fontSize: "13px",
        color: "#000",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#2f71cd";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#000";
      }}
    >
      <span className="shrink-0 flex items-center justify-center" style={{ width: "28px" }}>
        <img src={icon} alt="" className="w-[24px] h-[24px]" draggable={false} />
      </span>
      <span className="flex-1 truncate">{text}</span>
      {type === "text" && (
        <Clipboard
          className="w-3 h-3 opacity-0 group-hover:opacity-60"
          style={{ transition: "opacity 0.1s" }}
        />
      )}
      {isCopied && (
        <span
          className="absolute right-2 text-[11px] text-green-600"
          style={{ color: "#2d7d28" }}
        >
          Copied!
        </span>
      )}
    </button>
  );
}

/** Authentic XP "Turn off computer" dialog. */
function ShutDownDialog({
  onAction,
  onClose,
}: {
  onAction: (action: "shutdown" | "restart" | "cancel") => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={(e) => e.stopPropagation()}
        className="flex overflow-hidden"
        style={{
          width: "480px",
          height: "270px",
          borderRadius: "8px",
          border: "3px solid #0a246a",
          background:
            "linear-gradient(to bottom, #1c6ee8 0%, #0a3a8c 100%)",
          boxShadow: "4px 4px 12px rgba(0,0,0,0.5)",
          fontFamily: "Tahoma, Verdana, sans-serif",
        }}
      >
        {/* LEFT — gradient strip with message */}
        <div
          className="flex flex-col justify-center px-4 text-white"
          style={{
            width: "160px",
            background:
              "linear-gradient(to bottom, #2a7fe0 0%, #0d4aaa 100%)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src="start_logo.png" alt="" className="w-6 h-6" />
            <span className="font-bold text-[13px]">Windows</span>
          </div>
          <p className="text-[12px] leading-snug" style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}>
            What do you want the computer to do?
          </p>
        </div>

        {/* RIGHT — three action buttons */}
        <div className="flex flex-col justify-center gap-2 p-4 flex-1">
          <ShutdownButton
            icon={<MoonStar size={20} className="text-[#ffcc00]" />}
            barColor="#ff9900"
            label="Stand By"
            onClick={() => onAction("cancel")}
          />
          <ShutdownButton
            icon={<Power size={20} className="text-[#cc0000]" />}
            barColor="#cc0000"
            label="Turn Off"
            primary
            onClick={() => onAction("shutdown")}
          />
          <ShutdownButton
            icon={<RotateCcw size={20} className="text-[#339933]" />}
            barColor="#339933"
            label="Restart"
            onClick={() => onAction("restart")}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ShutdownButton({
  icon,
  barColor,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode;
  barColor: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-left cursor-pointer"
      style={{
        padding: "5px 10px 5px 5px",
        borderRadius: "3px",
        color: "#000",
        fontSize: "13px",
        background: primary
          ? "linear-gradient(to bottom, #ffffff 0%, #e8eef8 100%)"
          : "linear-gradient(to bottom, #ffffff 0%, #f0f4fa 100%)",
        border: "1px solid #99b4d8",
        boxShadow: primary
          ? "0 0 0 2px #ffcc00, 1px 1px 2px rgba(0,0,0,0.3)"
          : "1px 1px 2px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#2f71cd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#99b4d8";
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "4px",
          alignSelf: "stretch",
          background: barColor,
          margin: "-4px 4px -4px -4px",
          borderRadius: "3px 0 0 3px",
        }}
      />
      <span className="shrink-0">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

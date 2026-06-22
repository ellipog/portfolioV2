import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import { playSound } from "utils/playSound";
import { TASKBAR_HEIGHT } from "utils/taskbarHeight";

/** Classic XP menu-bar items rendered when no explicit `menuBar` is supplied. */
const DEFAULT_MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

export default function Window({
  children,
  title,
  className,
  icon,
  width,
  setActiveWindows,
  pos,
  windowOrder,
  bringToFront,
  bodyClassName,
  menuBar,
  statusBar,
  showMenuBar = false,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  icon: string;
  width?: number;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  pos: { x: number; y: number };
  windowOrder: string[];
  bringToFront: () => void;
  bodyClassName?: string;
  /** Custom menu-bar node rendered below the title bar. Falls back to the
   *  classic File/Edit/View/... set when `showMenuBar` is on and no node given. */
  menuBar?: React.ReactNode;
  /** Optional sunken status bar rendered at the bottom of the window. */
  statusBar?: React.ReactNode;
  /** Show the default XP menu bar even without a custom `menuBar` node. */
  showMenuBar?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const prevBoundsRef = useRef({ x: 0, y: 0, width: 0 });

  const [adjustedPos, setAdjustedPos] = useState(pos);
  const [adjustedWidth, setAdjustedWidth] = useState(width);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const taskbarHeight = TASKBAR_HEIGHT;

      const windowWidth = width || 400;
      const estimatedHeight = 400;

      let finalWidth = windowWidth;
      if (screenWidth < windowWidth + 20) {
        finalWidth = screenWidth - 20;
        setAdjustedWidth(finalWidth);
      } else {
        setAdjustedWidth(windowWidth);
      }

      const maxX = Math.max(10, screenWidth - finalWidth - 10);
      const maxY = Math.max(10, screenHeight - taskbarHeight - estimatedHeight - 10);

      if (screenWidth < finalWidth + 40) {
        setAdjustedPos({
          x: Math.max(10, Math.floor((screenWidth - finalWidth) / 2)),
          y: Math.max(10, Math.floor((screenHeight - taskbarHeight - estimatedHeight) / 2)),
        });
      } else {
        setAdjustedPos({
          x: Math.max(10, Math.min(pos.x, maxX)),
          y: Math.max(10, Math.min(pos.y, maxY)),
        });
      }
    }
    setKey((prev) => prev + 1);
  }, [pos, width]);

  const zIndex = mounted ? windowOrder.indexOf(title.replace(" ", "_")) + 3 : 3;

  const handleInteraction = () => {
    bringToFront();
    const formattedTitle = title.replace(" ", "_");
    window.handleClippyWindowClick?.(formattedTitle);
  };

  const handleMaximize = () => {
    playSound("click");
    if (!isMaximized) {
      prevBoundsRef.current = {
        x: adjustedPos.x,
        y: adjustedPos.y,
        width: adjustedWidth || 400,
      };
    }
    setIsMaximized((prev) => !prev);
  };

  const maximizedWidth = typeof window !== "undefined" ? window.innerWidth - 4 : 0;
  const maximizedHeight =
    typeof window !== "undefined" ? window.innerHeight - TASKBAR_HEIGHT - 4 : 0;

  return (
    <Draggable
      key={key}
      handle=".title-bar"
      defaultPosition={adjustedPos}
      position={isMaximized ? { x: 2, y: 2 } : undefined}
      onStart={handleInteraction}
      onMouseDown={handleInteraction}
      bounds="parent"
      disabled={isMaximized}
    >
      <motion.div
        className={`window fixed hover:cursor-default shadow-xl ${className} flex flex-col`}
        style={{
          zIndex,
          width: isMaximized ? `${maximizedWidth}px` : adjustedWidth ? `${adjustedWidth}px` : "auto",
          height: isMaximized ? `${maximizedHeight}px` : "auto",
          maxWidth: isMaximized ? `${maximizedWidth}px` : "calc(100vw - 20px)",
          maxHeight: isMaximized ? `${maximizedHeight}px` : "calc(100vh - 86px)",
          transition: isMaximized ? "width 0.15s ease, height 0.15s ease" : undefined,
        }}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className="title-bar select-none">
          <div className="title-bar-text flex items-center gap-1.5">
            <img
              src={icon}
              alt=""
              className="w-4 h-4 select-none pointer-events-none"
              draggable="false"
            />
            <span className="font-bold tracking-wide text-shadow-sm">{title.replace("_", " ")}</span>
          </div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
                setActiveWindows((prev) => ({
                  ...prev,
                  [title.replace(" ", "_")]: false,
                }));
              }}
            />
            <button
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            />
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                playSound("click");
                setIsMaximized(false);
                setActiveWindows((prev) => ({
                  ...prev,
                  [title.replace(" ", "_")]: false,
                }));
              }}
            />
          </div>
        </div>
        {(menuBar || showMenuBar) && (
          <MenuBar>{menuBar ?? <DefaultMenuBar />}</MenuBar>
        )}
        <div
          className={
            bodyClassName ??
            "window-body m-0 p-5 bg-[var(--xp-face)] text-black overflow-auto flex-1 winxp-scrollbar"
          }
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
          {children}
        </div>
        {statusBar && <StatusBar>{statusBar}</StatusBar>}
      </motion.div>
    </Draggable>
  );
}

/** Classic XP menu bar: tan face, Tahoma 13px, blue hover w/ white text,
 *  underlined accelerator letters. Decorative (no dropdowns). */
function MenuBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-0 select-none"
      style={{
        background: "var(--xp-face)",
        padding: "2px 3px",
        borderBottom: "1px solid var(--xp-shadow)",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: "13px",
        color: "#000",
      }}
    >
      {children}
    </div>
  );
}

function DefaultMenuBar() {
  return (
    <>
      {DEFAULT_MENU_ITEMS.map((item) => (
        <MenuLabel key={item} label={item} accelerator={0} />
      ))}
    </>
  );
}

/** A single menu label. `accelerator` is the index of the underlined letter. */
function MenuLabel({
  label,
  accelerator = -1,
}: {
  label: string;
  accelerator?: number;
}) {
  return (
    <span
      className="px-2 py-0.5 cursor-default"
      style={{ lineHeight: "20px" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#316ac5";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#000";
      }}
    >
      {accelerator >= 0 && accelerator < label.length ? (
        <>
          {label.slice(0, accelerator)}
          <u>{label[accelerator]}</u>
          {label.slice(accelerator + 1)}
        </>
      ) : (
        label
      )}
    </span>
  );
}

/** Authentic XP sunken status bar with a size-grip in the bottom-right. */
function StatusBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-stretch select-none"
      style={{
        height: "24px",
        background: "var(--xp-face)",
        borderTop: "1px solid var(--xp-3dlight)",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: "13px",
        color: "#000",
      }}
    >
      <div
        className="flex-1 px-2 flex items-center"
        style={{
          margin: "1px",
          padding: "1px 4px",
          boxShadow:
            "inset 1px 1px 0 var(--xp-shadow), inset -1px -1px 0 var(--xp-3dlight)",
        }}
      >
        {children}
      </div>
      {/* size grip */}
      <div
        aria-hidden
        style={{
          width: "18px",
          alignSelf: "stretch",
          margin: "1px",
          boxShadow:
            "inset 1px 1px 0 var(--xp-shadow), inset -1px -1px 0 var(--xp-3dlight)",
          background:
            "linear-gradient(135deg, transparent 0%, transparent 45%, var(--xp-shadow) 45%, var(--xp-shadow) 55%, transparent 55%, transparent 70%, var(--xp-shadow) 70%, var(--xp-shadow) 80%, transparent 80%)",
        }}
      />
    </div>
  );
}
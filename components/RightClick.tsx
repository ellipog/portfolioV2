import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

interface ChildProps {
  isEditing?: boolean;
  onRename?: (newTitle: string) => void;
}

interface RightClickProps {
  children: React.ReactElement<ChildProps>;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  onDelete: (title: string | undefined) => void;
  setFolders: Dispatch<
    SetStateAction<
      {
        title: string;
        pos: { x: number; y: number };
        icon: string;
        id: number;
      }[]
    >
  >;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

interface MenuPosition {
  x: number;
  y: number;
  context: "desktop" | "icon";
  data?: {
    title?: string;
    icon?: string;
    isEditing?: boolean;
    id?: number;
  };
}

export default function RightClick({
  children,
  setActiveWindows,
  onDelete,
  setFolders,
  setIsEditing,
}: RightClickProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({
    x: 0,
    y: 0,
    context: "desktop",
    data: { isEditing: false },
  });

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    const handleGlobalContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if we're inside a window by looking for window-specific elements
      const isWindow =
        target.closest('[role="window"]') ||
        target.closest('[role="dialog"]') ||
        target.closest('[role="window"]') ||
        target.closest(".window-title-bar");

      // Check for start menu and navbar
      const isStartMenu = target.closest('[data-component="start-menu"]');
      const isNavbar = target.closest('[data-component="navbar"]');

      if (isWindow || isStartMenu || isNavbar) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleGlobalContextMenu, true);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("contextmenu", handleGlobalContextMenu, true);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    e.preventDefault();
    const desktopIcon = target.closest(".app-icon");
    const x = e.clientX;
    const y = e.clientY;

    const menuWidth = 200;
    const menuHeight = 200;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const adjustedX = x + menuWidth > screenWidth ? screenWidth - menuWidth : x;
    const adjustedY =
      y + menuHeight > screenHeight ? screenHeight - menuHeight : y;

    if (desktopIcon) {
      const title = desktopIcon.querySelector("span")?.textContent || "";
      const icon = desktopIcon.querySelector("img")?.getAttribute("src") || "";

      setPosition({
        x: adjustedX,
        y: adjustedY,
        context: "icon",
        data: { title, icon },
      });
    } else {
      setPosition({
        x: adjustedX,
        y: adjustedY,
        context: "desktop",
      });
    }

    const windowPresent = target.closest(".window");
    const startMenuPresent = target.closest(".start-menu");
    const navbarPresent = target.closest(".navbar");

    if (windowPresent || startMenuPresent || navbarPresent) {
      setShowMenu(false);
      return;
    }

    setShowMenu(true);
  };

  const getMenuItems = () => {
    if (position.context === "icon" && position.data) {
      const isFolder = position.data.icon?.includes("folder.png");
      return (
        <>
          <MenuItem
            text="Open"
            onClick={() => {
              setActiveWindows((prev) => ({
                ...prev,
                [position.data?.title?.replace(" ", "_") || ""]: true,
              }));
              setShowMenu(false);
            }}
          />
          <div className="h-[1px] bg-gray-200 mx-1" />
          <MenuItem text="Create Shortcut" disabled />
          <MenuItem text="Delete" onClick={handleDelete} />
          <div className="h-[1px] bg-gray-200 mx-1" />
          <MenuItem
            text="Rename"
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            disabled={!isFolder}
          />
        </>
      );
    }

    return (
      <>
        <MenuItem text="View" disabled />
        <MenuItem text="Sort by" disabled />
        <div className="h-[1px] bg-gray-200 mx-1" />
        <MenuItem text="Refresh" onClick={() => window.location.reload()} />
        <div className="h-[1px] bg-gray-200 mx-1" />
        <MenuItem
          text="New Folder"
          onClick={() => {
            setFolders((prev) => [
              ...prev,
              {
                title: "New Folder",
                pos: {
                  x: Math.round((position.x - 30) / 10) * 10,
                  y: Math.round((position.y - 30) / 10) * 10,
                },
                icon: "folder.png",
                id: position.data?.id || 0,
              },
            ]);
            setShowMenu(false);
          }}
        />
        <div className="h-[1px] bg-gray-200 mx-1" />
        <MenuItem text="Properties" disabled />
      </>
    );
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(position.data?.title);
  };

  return (
    <div onContextMenu={handleContextMenu} className="h-full w-full">
      {children}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50"
            style={{ left: position.x, top: position.y }}
          >
            <div className="bg-white border-2 border-blue-900 shadow-lg overflow-hidden w-48">
              {getMenuItems()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

function MenuItem({ text, onClick, disabled = false }: MenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      className={`w-full text-left px-4 py-1.5 text-sm ${
        disabled
          ? "text-gray-400 cursor-default"
          : "text-black hover:bg-blue-100 cursor-pointer"
      }`}
    >
      {text}
    </button>
  );
}

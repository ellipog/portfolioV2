import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

interface ChildProps {
  isEditing?: boolean;
  onRename?: (newTitle: string) => void;
}

interface RightClickProps {
  children: React.ReactElement<ChildProps>;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  onDelete: (title: string | undefined, icon?: string | undefined) => void;
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
      const isWindow =
        target.closest('[role="window"]') ||
        target.closest('[role="dialog"]') ||
        target.closest(".window-title-bar");
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
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const desktopIcon = target.closest(".app-icon");

    // Reset menu state first
    setShowMenu(false);

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
      const titleElement = desktopIcon.querySelector("span");
      const title = titleElement?.textContent?.trim();
      const icon = desktopIcon.querySelector("img")?.getAttribute("src");
      const isFolder = icon?.includes("folder.png");

      setPosition({
        x: adjustedX,
        y: adjustedY,
        context: "icon",
        data: {
          title: title || undefined,
          icon: icon || undefined,
          isEditing: isFolder,
        },
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
      return;
    }

    requestAnimationFrame(() => {
      setShowMenu(true);
    });
  };

  const handleDelete = () => {
    console.log("RightClick - Delete clicked", {
      context: position.context,
      title: position.data?.title,
      icon: position.data?.icon,
    });

    if (position.context === "icon" && position.data?.title) {
      console.log(
        "RightClick - Calling onDelete with:",
        position.data.title,
        position.data.icon
      );
      onDelete(position.data.title, position.data.icon);
      setShowMenu(false);
    }
  };

  const getMenuItems = () => {
    if (position.context === "icon" && position.data) {
      const isFolder = position.data.icon?.includes("folder.png");
      const isClippy = position.data.title === "Clippy.exe";
      return (
        <>
          <MenuItem
            text="Open"
            onClick={() => {
              const windowTitle = position.data?.title?.replace(" ", "_") || "";
              setActiveWindows((prev) => ({
                ...prev,
                [windowTitle]: true,
              }));
              setShowMenu(false);
            }}
          />
          <div className="h-[1px] bg-gray-200 mx-1" />
          <MenuItem text="Create Shortcut" disabled />
          <MenuItem
            text="Delete"
            onClick={handleDelete}
            className={isClippy ? "text-red-600 hover:text-red-800" : ""}
          />
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
  className?: string;
}

function MenuItem({
  text,
  onClick,
  disabled = false,
  className = "",
}: MenuItemProps) {
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
          : `text-black hover:bg-blue-100 cursor-pointer ${className}`
      }`}
    >
      {text}
    </button>
  );
}

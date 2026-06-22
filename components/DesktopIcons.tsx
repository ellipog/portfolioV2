import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { windows } from "data/windows";
import ErrorPopup from "./ErrorPopup";
import Clippy from "./Clippy";
import BlueScreen from "./BlueScreen";

const ICON_WIDTH = 100;
const ICON_HEIGHT = 120;
const GRID_START_X = 25;
const GRID_START_Y = 25;
const ICONS_PER_COLUMN = 5;

interface DesktopIconsProps {
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  folders: {
    title: string;
    pos: { x: number; y: number };
    icon: string;
    id: number;
  }[];
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
  isEditing?: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  bringWindowToFront: (windowTitle: string) => void;
  showAngryClippy: boolean;
  setShowAngryClippy: Dispatch<SetStateAction<boolean>>;
}

export default function DesktopIcons({
  setActiveWindows,
  folders,
  setFolders,
  isEditing,
  setIsEditing,
  bringWindowToFront,
  showAngryClippy,
  setShowAngryClippy,
}: DesktopIconsProps) {
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const [errorPopups, setErrorPopups] = useState<
    Array<{ id: number; message: string }>
  >([]);

  const handleRestart = () => {
    setActiveWindows({});
    setErrorPopups([]);
    setShowBlueScreen(false);
    setShowAngryClippy(false);

    const clippyElement = document.querySelector(".clippy-normal");
    if (clippyElement) {
      clippyElement.remove();
    }
  };

  const getIconPosition = (index: number) => {
    const column = Math.floor(index / ICONS_PER_COLUMN);
    const row = index % ICONS_PER_COLUMN;

    return {
      x: GRID_START_X + column * ICON_WIDTH,
      y: GRID_START_Y + row * ICON_HEIGHT,
    };
  };

  const handleWindowOpen = (windowTitle: string) => {
    const formattedTitle = windowTitle.replace(" ", "_");
    setActiveWindows((prev) => ({
      ...prev,
      [formattedTitle]: true,
    }));
    bringWindowToFront(formattedTitle);
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 w-screen h-screen">
        {windows.map((window, index) => (
          <DesktopIcon
            key={window.title}
            setActiveWindows={setActiveWindows}
            title={window.title}
            icon={window.icon}
            defaultPosition={getIconPosition(index)}
            isEditing={false}
            setIsEditing={setIsEditing}
            setFolders={setFolders}
            onWindowOpen={handleWindowOpen}
          />
        ))}
        {folders.map((folder, index) => (
          <DesktopIcon
            key={folder.title}
            setActiveWindows={setActiveWindows}
            title={folder.title}
            icon={folder.icon}
            id={folder.id}
            defaultPosition={folder.pos}
            isEditing={isEditing || false}
            setIsEditing={setIsEditing}
            setFolders={setFolders}
            onWindowOpen={handleWindowOpen}
            onDragStop={(e, data) => {
              setFolders((prev) => {
                const newFolders = [...prev];
                newFolders[index] = {
                  ...folder,
                  pos: { x: data.x, y: data.y },
                };
                return newFolders;
              });
            }}
          />
        ))}
      </div>
      {showAngryClippy && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <Clippy isAngry={true} />
        </div>
      )}
      {errorPopups.map((error) => (
        <ErrorPopup
          key={error.id}
          message={error.message}
          isOpen={true}
          onClose={() => {
            setErrorPopups((prev) =>
              prev.filter((popup) => popup.id !== error.id)
            );
          }}
          type="error"
        />
      ))}
      {showBlueScreen && <BlueScreen onRestart={handleRestart} />}
    </>
  );
}

interface DesktopIconProps {
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  title: string;
  icon: string;
  id?: number;
  defaultPosition: { x: number; y: number };
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
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
  onWindowOpen: (title: string) => void;
  onDragStop?: (e: DraggableEvent, data: DraggableData) => void;
}

function DesktopIcon({
  title,
  icon,
  defaultPosition,
  isEditing,
  setIsEditing,
  setFolders,
  id,
  onWindowOpen,
}: DesktopIconProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Deselect on any click outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".app-icon")) {
        setIsSelected(false);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleDoubleClick = () => {
    if (!isEditing) {
      onWindowOpen(title);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editedTitle.trim()) {
        setIsEditing(false);
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === id ? { ...folder, title: editedTitle } : folder
          )
        );
      }
    } else if (e.key === "Escape") {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds="parent"
      disabled={isEditing}
      grid={[10, 10]}
    >
      <div
        className={`app-icon z-[2] absolute flex flex-col items-center justify-center w-24 h-[7.5rem] rounded transition-colors select-none ${
          isSelected
            ? "bg-blue-500/30 ring-1 ring-blue-400/60"
            : "hover:bg-blue-500/20"
        } ${isEditing ? "pointer-events-none" : "cursor-pointer"}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={icon}
          alt={title}
          className="w-12 h-12 select-none pointer-events-none"
          draggable="false"
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setIsEditing(false);
            }}
            className="w-24 text-center bg-white/30 text-black text-sm mt-1 px-1 
              outline-none border border-blue-500 pointer-events-auto"
          />
        ) : (
          <span className="absolute top-[5rem] text-sm w-28 text-white text-center mt-1 px-1 text-shadow select-none break-words whitespace-normal overflow-wrap-anywhere">
            {title.replace("_", " ")}
          </span>
        )}
      </div>
    </Draggable>
  );
}

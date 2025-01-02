import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { windows } from "data/windows";

const ICON_WIDTH = 80;
const ICON_HEIGHT = 100;
const GRID_START_X = 20;
const GRID_START_Y = 20;
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
}

export default function DesktopIcons({
  setActiveWindows,
  folders,
  setFolders,
  isEditing,
  setIsEditing,
  bringWindowToFront,
}: DesktopIconsProps) {
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
          isEditing={isEditing}
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
  );
}

interface DesktopIconProps {
  title: string;
  icon: string;
  defaultPosition: { x: number; y: number };
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  onDragStop?: (e: DraggableEvent, data: DraggableData) => void;
  isEditing?: boolean;
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
  id?: number;
  onWindowOpen: (title: string) => void;
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

  const handleDoubleClick = () => {
    if (!isEditing) {
      onWindowOpen(title);
    }
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
        className={`app-icon z-[2] absolute flex flex-col items-center justify-center w-20 h-24 hover:bg-blue-500/20 active:bg-blue-500/40 rounded transition-colors hover:cursor-pointer ${
          isEditing ? "pointer-events-none" : ""
        }`}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={icon}
          alt={title}
          className="w-10 h-10 select-none pointer-events-none"
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
            className="w-20 text-center bg-white/30 text-black text-sm mt-1 px-1 
              outline-none border border-blue-500 pointer-events-auto"
          />
        ) : (
          <span className="absolute top-[4.5rem] text-xs w-24 text-white text-center mt-1 px-1 text-shadow select-none break-words whitespace-normal overflow-wrap-anywhere">
            {title.replace("_", " ")}
          </span>
        )}
      </div>
    </Draggable>
  );
}

import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { LoadingState, windows } from "data/windows";
import { errorMessages } from "data/clippyMessages";
import ErrorPopup from "./ErrorPopup";
import Clippy from "./Clippy";
import BlueScreen from "./BlueScreen";
import RightClick from "./RightClick";

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
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  onDelete: (title: string | undefined, icon?: string | undefined) => void;
}

export default function DesktopIcons({
  setActiveWindows,
  folders,
  setFolders,
  isEditing,
  setIsEditing,
  bringWindowToFront,
  setLoading,
  onDelete,
}: DesktopIconsProps) {
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const [showAngryClippy, setShowAngryClippy] = useState(false);
  const [errorPopups, setErrorPopups] = useState<
    Array<{ id: number; message: string }>
  >([]);

  const spawnErrorPopups = () => {
    let count = 0;
    const maxErrors = 100;

    const spawnError = () => {
      if (count >= maxErrors) {
        setTimeout(() => setShowBlueScreen(true), 1000);
        return;
      }

      setErrorPopups((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          message:
            errorMessages[Math.floor(Math.random() * errorMessages.length)],
        },
      ]);

      count++;

      let nextDelay;
      if (count <= 3) {
        nextDelay = 800 - count * 200;
      } else {
        nextDelay = Math.max(25, 200 * Math.pow(0.8, count - 3));
      }

      setTimeout(spawnError, nextDelay);
    };

    spawnError();
  };

  const handleRestart = () => {
    setActiveWindows({});
    setErrorPopups([]);
    setShowBlueScreen(false);
    setShowAngryClippy(false);

    const clippyElement = document.querySelector(".clippy-normal");
    if (clippyElement) {
      clippyElement.remove();
    }

    setLoading(LoadingState.Initial);
    setTimeout(() => setLoading(LoadingState.BIOS), 500);
    setTimeout(() => setLoading(LoadingState.Boot1), 2000);
    setTimeout(() => setLoading(LoadingState.Boot2), 3000);
    setTimeout(() => setLoading(LoadingState.Black), 3600);
    setTimeout(() => setLoading(LoadingState.Desktop), 3900);
  };

  const handleDelete = (title: string | undefined) => {
    console.log("DesktopIcons - handleDelete called with:", title);

    if (title === "Clippy.exe") {
      console.log("DesktopIcons - Clippy.exe delete triggered");
      const clippyElement = document.querySelector(".clippy-normal");
      if (clippyElement) {
        clippyElement.remove();
      }
      setShowAngryClippy(true);
      spawnErrorPopups();
    } else {
      const isWindow = windows.some((window) => window.title === title);
      console.log("DesktopIcons - Is window?", isWindow);

      if (isWindow) {
        console.log("DesktopIcons - Deleting window:", title);
        setActiveWindows((prev) => {
          const newState = { ...prev };
          delete newState[title?.replace(" ", "_") || ""];
          console.log("DesktopIcons - New active windows state:", newState);
          return newState;
        });
      } else {
        console.log("DesktopIcons - Deleting folder:", title);
        setFolders((prev) => {
          const newFolders = prev.filter((folder) => folder.title !== title);
          console.log("DesktopIcons - New folders state:", newFolders);
          return newFolders;
        });
      }
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
    <RightClick
      setActiveWindows={setActiveWindows}
      onDelete={handleDelete}
      setFolders={setFolders}
      setIsEditing={setIsEditing}
    >
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
              onDelete={onDelete}
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
              onDelete={onDelete}
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
    </RightClick>
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
        pos: {
          x: number;
          y: number;
        };
        icon: string;
        id: number;
      }[]
    >
  >;
  onWindowOpen: (title: string) => void;
  onDelete: (title: string | undefined, icon?: string | undefined) => void;
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
  onDelete,
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

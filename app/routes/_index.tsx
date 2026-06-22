import { useEffect, useRef, useState } from "react";
import { MetaFunction } from "@remix-run/react";
import { LoadingState, windows } from "data/windows";

import Navbar from "components/Navbar";
import Skills from "components/windows/Skills";
import Projects from "components/windows/Projects";
import WorkExperience from "components/windows/WorkExperience";
import Clippy from "components/Clippy";
import Minesweeper from "components/windows/Minesweeper";
import Education from "components/windows/Education";
import Paint from "components/windows/Paint";
import TaskManager from "components/windows/TaskManager";
import Winamp from "components/windows/Winamp";
import IEBrowser from "components/windows/IEBrowser";
import ControlPanel from "components/windows/ControlPanel";
import BIOS from "components/BIOS";
import DesktopIcons from "components/DesktopIcons";
import RightClick from "components/RightClick";
import ErrorPopup from "components/ErrorPopup";
import BlueMarker from "components/BlueMarker";
import BlueScreen from "components/BlueScreen";
import { playSound } from "utils/playSound";
import { useIsMobile } from "utils/isMobile";
import { errorMessages } from "data/clippyMessages";

export const meta: MetaFunction = () => {
  return [
    { title: "Elliot's Windows XP Portfolio" },
    {
      name: "description",
      content: "Windows XP style portfolio. ",
    },
    { name: "theme-color", content: "#245EDC" }, // Windows XP blue
    { property: "og:title", content: "Elliot's Windows XP Portfolio" },
    {
      property: "og:description",
      content: "Windows XP style portfolio. ",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/desktop_bg.png" }, // Make sure this is a full URL in production
    { property: "og:url", content: "https://your-domain.com" }, // Replace with your actual domain
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Elliot's Windows XP Portfolio" },
    {
      name: "twitter:description",
      content: "Windows XP style portfolio. ",
    },
    { name: "twitter:image", content: "/desktop_bg.png" }, // Make sure this is a full URL in production
  ];
};

export default function Index() {
  const [activeWindows, setActiveWindows] = useState<Record<string, boolean>>({
    Skills: false,
    Projects: false,
    Work_Experience: false,
    Minesweeper: false,
    Education: false,
    Paint: false,
    Task_Manager: false,
    Winamp: false,
    Internet_Explorer: false,
    Control_Panel: false,
  });

  const [windowOrder, setWindowOrder] = useState<string[]>([
    "Skills",
    "Projects",
    "Work_Experience",
    "Minesweeper",
    "Education",
    "Paint",
    "Task_Manager",
    "Winamp",
    "Internet_Explorer",
    "Control_Panel",
  ]);

  const [folders, setFolders] = useState<
    {
      title: string;
      pos: { x: number; y: number };
      icon: string;
      id: number;
    }[]
  >([]);

  const bringWindowToFront = (windowTitle: string) => {
    setWindowOrder((prev) => {
      const newOrder = prev.filter((title) => title !== windowTitle);
      return [...newOrder, windowTitle];
    });
  };

  const [loading, setLoading] = useState<LoadingState>(LoadingState.Initial);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [errors, setErrors] = useState<
    Array<{ id: number; title?: string; isOpen: boolean; message?: string }>
  >([]);
  const [nextErrorId, setNextErrorId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showAngryClippy, setShowAngryClippy] = useState(false);
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const isMobile = useIsMobile();
  const [proceedAnyway, setProceedAnyway] = useState(false);
  
  const [isExplorerKilled, setIsExplorerKilled] = useState(false);
  const [wallpaper, setWallpaper] = useState("/desktop_bg.png");
  const [desktopBgColor, setDesktopBgColor] = useState("#245EDC");

  // Command prompt terminal states
  const [terminalLines, setTerminalLines] = useState<Array<{ text: string; type: "input" | "output" | "error" }>>([
    { text: "Microsoft Windows XP [Version 5.1.2600]", type: "output" },
    { text: "(C) Copyright 1985-2001 Microsoft Corp.", type: "output" },
    { text: "", type: "output" },
    { text: "explorer.exe has been terminated. Desktop GUI is offline.", type: "error" },
    { text: "Type 'explorer' or 'explorer.exe' to restart the GUI shell.", type: "output" },
    { text: "Type 'help' to see other available commands.", type: "output" },
    { text: "", type: "output" },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  // Set up global handlers
  useEffect(() => {
    (window as any).killExplorer = () => {
      setIsExplorerKilled(true);
      playSound("shutdown");
    };
    (window as any).restoreExplorer = () => {
      setIsExplorerKilled(false);
      playSound("logon");
    };
    (window as any).triggerClippyDefense = () => {
      setShowAngryClippy(true);
      const clippyElement = document.querySelector(".clippy-normal");
      if (clippyElement) {
        clippyElement.remove();
      }
      spawnErrorPopups();
    };
    (window as any).restoreClippy = () => {
      setShowAngryClippy(false);
    };
    (window as any).changeWallpaper = (id: string, url?: string, color?: string) => {
      if (url !== undefined) {
        setWallpaper(url);
        if (color) setDesktopBgColor(color);
        return;
      }
      const name = id.toLowerCase();
      if (name === "bliss" || name === "bliss (default)") {
        setWallpaper("/desktop_bg.png");
        setDesktopBgColor("#245EDC");
      } else if (name === "autumn") {
        setWallpaper("/autumn.jpg");
        setDesktopBgColor("#5c3317");
      } else if (name === "red moon desert" || name === "red_moon" || name === "red moon desert (default)") {
        setWallpaper("/red_moon_desert.jpg");
        setDesktopBgColor("#a52a2a");
      } else if (name === "follow") {
        setWallpaper("/follow.jpg");
        setDesktopBgColor("#4a6741");
      } else if (name === "classic_blue" || name === "classic blue" || name === "windows classic blue") {
        setWallpaper("");
        setDesktopBgColor("#3b6ea5");
      }
    };
    (window as any).openPortfolioWindow = (key: string) => {
      setActiveWindows((prev) => ({ ...prev, [key]: true }));
      bringWindowToFront(key);
    };
    (window as any).closePortfolioWindow = (key: string) => {
      setActiveWindows((prev) => ({ ...prev, [key]: false }));
    };
    (window as any).closeAllPortfolioWindows = () => {
      setActiveWindows((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          next[k] = false;
        }
        return next;
      });
    };
    (window as any).setSoundVolume = (level: number) => {
      (window as any).soundVolume = level;
    };
    (window as any).spawnErrorPopup = (message?: string) => {
      const msg = message || errorMessages[Math.floor(Math.random() * errorMessages.length)];
      setErrors((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          title: "Windows",
          isOpen: true,
          message: msg,
        },
      ]);
    };
    (window as any).spawnErrorBatch = (count: number) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          setErrors((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              title: "Windows",
              isOpen: true,
              message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
            },
          ]);
        }, i * 50);
      }
    };
    (window as any).toggleMute = (target: "alerts" | "startup" | "all") => {
      if (target === "all") {
        (window as any).muteSystemSounds = !(window as any).muteSystemSounds;
      } else if (target === "alerts") {
        (window as any).systemAlertsEnabled = (window as any).systemAlertsEnabled === false ? true : false;
      } else if (target === "startup") {
        (window as any).startupSoundsEnabled = (window as any).startupSoundsEnabled === false ? true : false;
      }
      const status = (window as any).muteSystemSounds ? "muted" : "unmuted";
      setErrors((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          title: "Audio",
          isOpen: true,
          message: `System sounds ${status}`,
        },
      ]);
    };
    (window as any).restartPC = () => {
      setLoading(LoadingState.Initial);
      setTimeout(() => {
        setLoading(LoadingState.BIOS);
        playSound("startup");
      }, 500);
      setTimeout(() => {
        setLoading(LoadingState.Boot1);
      }, 2000);
      setTimeout(() => {
        setLoading(LoadingState.Boot2);
      }, 3000);
      setTimeout(() => {
        setLoading(LoadingState.Black);
      }, 4600);
      setTimeout(() => {
        setLoading(LoadingState.Desktop);
        playSound("logon");
      }, 4900);
    };
    (window as any).isExplorerKilled = isExplorerKilled;
    (window as any).showAngryClippy = showAngryClippy;
    (window as any).bringWindowToFront = bringWindowToFront;

    return () => {
      delete (window as any).killExplorer;
      delete (window as any).restoreExplorer;
      delete (window as any).triggerClippyDefense;
      delete (window as any).restoreClippy;
      delete (window as any).changeWallpaper;
      delete (window as any).openPortfolioWindow;
      delete (window as any).closePortfolioWindow;
      delete (window as any).closeAllPortfolioWindows;
      delete (window as any).setSoundVolume;
      delete (window as any).spawnErrorPopup;
      delete (window as any).spawnErrorBatch;
      delete (window as any).toggleMute;
      delete (window as any).restartPC;
      delete (window as any).setWallpaperDirect;
      delete (window as any).navigateIE;
      delete (window as any).isExplorerKilled;
      delete (window as any).showAngryClippy;
      delete (window as any).bringWindowToFront;
    };
  }, [isExplorerKilled, showAngryClippy]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const newLines = [...terminalLines, { text: `C:\\Documents and Settings\\ELLIOT>${cmd}`, type: "input" as const }];
    const parts = cmd.toLowerCase().split(" ");
    const baseCmd = parts[0];

    let output: Array<{ text: string; type: "input" | "output" | "error" }> = [];
    if (baseCmd === "explorer" || baseCmd === "explorer.exe") {
      output = [{ text: "Restarting Windows Explorer shell...", type: "output" }];
      setTimeout(() => {
        (window as any).restoreExplorer?.();
      }, 1000);
    } else if (baseCmd === "help") {
      output = [
        { text: "Available Commands:", type: "output" },
        { text: "  explorer    - Restores Windows XP GUI and Taskbar", type: "output" },
        { text: "  taskmgr     - Launches Windows XP Task Manager", type: "output" },
        { text: "  clippy      - Spawns Clippy on the screen", type: "output" },
        { text: "  cls         - Clears the console window screen", type: "output" },
        { text: "  dir         - Lists directory contents", type: "output" },
        { text: "  ver         - Displays Windows XP version information", type: "output" },
        { text: "  exit        - Exits the command prompt (will auto-restart explorer)", type: "output" },
      ];
    } else if (baseCmd === "cls") {
      setTerminalLines([]);
      setTerminalInput("");
      return;
    } else if (baseCmd === "taskmgr" || baseCmd === "taskmgr.exe") {
      output = [{ text: "Launching Task Manager...", type: "output" }];
      setActiveWindows((prev) => ({ ...prev, Task_Manager: true }));
    } else if (baseCmd === "clippy") {
      output = [{ text: "Clippy is watching you. Always.", type: "output" }];
      setShowAngryClippy(true);
    } else if (baseCmd === "dir") {
      output = [
        { text: " Volume in drive C has no label.", type: "output" },
        { text: " Volume Serial Number is F86B-5A89", type: "output" },
        { text: "", type: "output" },
        { text: " Directory of C:\\Documents and Settings\\ELLIOT", type: "output" },
        { text: "", type: "output" },
        { text: "05/19/2026  08:24 PM    <DIR>          .", type: "output" },
        { text: "05/19/2026  08:24 PM    <DIR>          ..", type: "output" },
        { text: "05/19/2026  08:24 PM    <DIR>          Desktop", type: "output" },
        { text: "05/19/2026  08:24 PM    <DIR>          My Documents", type: "output" },
        { text: "05/19/2026  08:24 PM               142 bio.txt", type: "output" },
        { text: "05/19/2026  08:24 PM             8,940 clippy.exe", type: "output" },
        { text: "05/19/2026  08:24 PM            22,816 explorer.exe", type: "output" },
        { text: "               3 File(s)         31,898 bytes", type: "output" },
        { text: "               4 Dir(s)    142,814,204 bytes free", type: "output" },
      ];
    } else if (baseCmd === "ver") {
      output = [{ text: "Microsoft Windows XP [Version 5.1.2600]", type: "output" }];
    } else if (baseCmd === "exit") {
      output = [{ text: "Exiting... Restarting GUI...", type: "output" }];
      setTimeout(() => {
        (window as any).restoreExplorer?.();
      }, 1000);
    } else {
      output = [{ text: `'${baseCmd}' is not recognized as an internal or external command,`, type: "error" },
                { text: "operable program or batch file.", type: "error" }];
    }

    setTerminalLines([...newLines, ...output]);
    setTerminalInput("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(LoadingState.BIOS);
    }, 500); // Show BIOS for 2 seconds
    const timer2 = setTimeout(() => {
      setLoading(LoadingState.Boot1);
      playSound("startup");
    }, 2000);
    const timer3 = setTimeout(() => {
      setLoading(LoadingState.Boot2);
    }, 3000);
    const timer4 = setTimeout(() => {
      setLoading(LoadingState.Black);
    }, 4600);
    const timer5 = setTimeout(() => {
      setLoading(LoadingState.Desktop);
      playSound("logon");
    }, 4900);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (loading === LoadingState.Desktop && !showBlueScreen) {
        playSound("click");
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [loading, showBlueScreen]);

  const handleDelete = (title: string | undefined) => {
    if (title?.toLowerCase() === "clippy.exe") {
      setShowAngryClippy(true);
      const clippyElement = document.querySelector(".clippy-normal");
      if (clippyElement) {
        clippyElement.remove();
      }
      spawnErrorPopups();
      return;
    }

    const isProtectedWindow = windows.some(
      (window) =>
        window.title.replace(" ", "_").toLowerCase() ===
        title?.replace(" ", "_").toLowerCase()
    );

    if (isProtectedWindow) {
      setErrors((prev) => [
        ...prev,
        {
          id: nextErrorId,
          title: title,
          isOpen: true,
        },
      ]);
      setNextErrorId((prev) => prev + 1);
      return;
    }

    playSound("recycle");
    setFolders((prev) =>
      prev.filter(
        (folder) =>
          folder.title.replace(" ", "_").toLowerCase() !==
          title?.replace(" ", "_").toLowerCase()
      )
    );
  };

  const spawnErrorPopups = () => {
    let count = 0;
    const maxErrors = 120;

    const spawnError = () => {
      if (count >= maxErrors) {
        setTimeout(() => setShowBlueScreen(true), 1000);
        return;
      }

      setErrors((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          title: "Critical Error",
          isOpen: true,
        },
      ]);

      count++;

      if (count <= 3) {
        setTimeout(spawnError, 700 - count * 100);
      } else {
        const nextDelay = Math.max(25, 200 * Math.pow(0.8, count - 3));
        setTimeout(spawnError, nextDelay);
      }
    };

    spawnError();
  };

  if (isMobile && !proceedAnyway) {
    return (
      <div className="flex flex-col items-center justify-center h-screen mx-8">
        <h1 className="text-2xl font-bold text-center mb-4 font-mono text-white">
          This site is viewed best on desktop.
        </h1>
        <p className="text-sm text-center mb-4 font-mono text-white">
          Please view this site on a desktop computer to get the full
          experience.
        </p>

        <button
          className="text-sm text-center mb-4 font-mono text-white"
          onClick={() => {
            setProceedAnyway(true);
          }}
        >
          view anyways
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Content - Always rendered but hidden during loading */}
      <RightClick
        setActiveWindows={setActiveWindows}
        onDelete={handleDelete}
        setFolders={setFolders}
        setIsEditing={setIsEditing}
      >
        <div
          className={
            loading !== LoadingState.Desktop
              ? "hidden"
              : `flex p-0 m-0 w-full transition-all duration-300 ${
                  isExplorerKilled
                    ? "h-screen bg-black"
                    : "h-[calc(100vh-var(--taskbar-height))]"
                }`
          }
          style={!isExplorerKilled ? { backgroundColor: desktopBgColor } : undefined}
        >
          {!isExplorerKilled && wallpaper && (
            <img
              src={wallpaper}
              alt="bg"
              className="absolute w-full h-screen object-cover select-none pointer-events-none"
              style={{ zIndex: 0 }}
            />
          )}
          {!isExplorerKilled && (
            <DesktopIcons
              setActiveWindows={setActiveWindows}
              folders={folders}
              setFolders={setFolders}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              bringWindowToFront={bringWindowToFront}
              showAngryClippy={showAngryClippy}
              setShowAngryClippy={setShowAngryClippy}
            />
          )}
          <Skills
            show={activeWindows.Skills}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Skills")}
          />
          <Projects
            show={activeWindows.Projects}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Projects")}
          />
          <WorkExperience
            show={activeWindows.Work_Experience}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Work_Experience")}
          />
          <Minesweeper
            show={activeWindows.Minesweeper}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Minesweeper")}
          />
          <Education
            show={activeWindows.Education}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Education")}
          />
          <Paint
            show={activeWindows.Paint}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Paint")}
          />
          <IEBrowser
            show={activeWindows.Internet_Explorer}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Internet_Explorer")}
          />
          <TaskManager
            show={activeWindows.Task_Manager}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Task_Manager")}
            isExplorerKilled={isExplorerKilled}
            setIsExplorerKilled={setIsExplorerKilled}
          />
          <Winamp
            show={activeWindows.Winamp}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Winamp")}
          />
          <ControlPanel
            show={activeWindows.Control_Panel}
            setActiveWindows={setActiveWindows}
            windowOrder={windowOrder}
            bringToFront={() => bringWindowToFront("Control_Panel")}
          />
          {!isExplorerKilled && (
            <Navbar
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              bringWindowToFront={bringWindowToFront}
              windowOrder={windowOrder}
            />
          )}
          {isExplorerKilled && (
            <div 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-black text-gray-200 border-2 border-gray-400 p-2 flex flex-col font-mono text-xs z-[49] shadow-2xl rounded-t-md overflow-hidden"
              style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center bg-gray-300 text-black px-2 py-0.5 font-sans font-semibold mb-2 select-none">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-bold">C:\WINDOWS\system32\cmd.exe</span>
                </span>
                <button
                  onClick={() => {
                    playSound("click");
                    (window as any).restoreExplorer?.();
                  }}
                  className="bg-gray-200 text-black px-1.5 border border-gray-400 hover:bg-red-600 hover:text-white font-bold rounded-sm active:bg-gray-300 cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </div>

              {/* Console Content */}
              <div className="flex-1 overflow-y-auto p-1 winxp-scrollbar select-text text-left">
                {terminalLines.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={
                      line.type === "error" 
                        ? "text-red-500" 
                        : line.type === "input" 
                          ? "text-white font-bold" 
                          : "text-gray-300"
                    }
                  >
                    {line.text}
                  </div>
                ))}
                
                {/* Input Line */}
                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 mt-1">
                  <span className="text-white">C:\Documents and Settings\ELLIOT&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-black text-white border-none outline-none focus:ring-0 p-0 font-mono text-xs focus:outline-none"
                    autoFocus
                  />
                </form>
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}
          <Clippy />
          <BlueMarker />
          {errors.map((error) => (
            <ErrorPopup
              key={error.id}
              isOpen={error.isOpen}
              onClose={() => {
                setErrors((prev) => prev.filter((e) => e.id !== error.id));
              }}
              title={error.title || "Windows"}
              message={error.message || `Cannot delete '${error.title}'. This action is not allowed in the portfolio demo.`}
              type="error"
            />
          ))}
        </div>
      </RightClick>

      {/* Loading Screens */}
      {loading === LoadingState.BIOS && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen text-white font-mono">
          <BIOS />
        </div>
      )}
      {loading === LoadingState.Initial && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen" />
      )}
      {loading === LoadingState.Boot1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <img
            src="boot.gif"
            alt="loading"
            className={`${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          />
        </div>
      )}
      {loading === LoadingState.Boot2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <img
            src="boot.gif"
            alt="loading"
            className={`${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          />
        </div>
      )}
      {loading === LoadingState.Black && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen" />
      )}
      {showBlueScreen && (
        <BlueScreen
          onRestart={() => {
            setShowBlueScreen(false);
            setShowAngryClippy(false);
            setErrors([]);
            setActiveWindows({});

            setLoading(LoadingState.Initial);

            setTimeout(() => {
              setLoading(LoadingState.BIOS);
              playSound("startup");
            }, 500);
            setTimeout(() => {
              setLoading(LoadingState.Boot1);
            }, 2000);
            setTimeout(() => {
              setLoading(LoadingState.Boot2);
            }, 3000);
            setTimeout(() => {
              setLoading(LoadingState.Black);
            }, 4600);
            setTimeout(() => {
              setLoading(LoadingState.Desktop);
              playSound("logon");
            }, 4900);

            const clippyElement = document.querySelector(".clippy-normal");
            if (clippyElement) {
              clippyElement.remove();
            }
          }}
        />
      )}
    </>
  );
}

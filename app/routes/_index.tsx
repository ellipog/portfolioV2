import { useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/react";
import { LoadingState, windows } from "data/windows";

import Navbar from "components/Navbar";
import Skills from "components/windows/Skills";
import Projects from "components/windows/Projects";
import WorkExperience from "components/windows/WorkExperience";
import Clippy from "components/Clippy";
import Minesweeper from "components/windows/Minesweeper";
import Education from "components/windows/Education";
import BIOS from "components/BIOS";
import DesktopIcons from "components/DesktopIcons";
import RightClick from "components/RightClick";
import ErrorPopup from "components/ErrorPopup";
import BlueMarker from "components/BlueMarker";
import BlueScreen from "components/BlueScreen";
import { playSound } from "utils/playSound";
import { useIsMobile } from "utils/isMobile";

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
  });

  const [windowOrder, setWindowOrder] = useState<string[]>([
    "Skills",
    "Projects",
    "Work_Experience",
    "Minesweeper",
    "Education",
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
    Array<{ id: number; title?: string; isOpen: boolean }>
  >([]);
  const [nextErrorId, setNextErrorId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showAngryClippy, setShowAngryClippy] = useState(false);
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const isMobile = useIsMobile();
  const [proceedAnyway, setProceedAnyway] = useState(false);

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
              : "flex p-0 m-0 h-[calc(100vh-56px)] w-full"
          }
        >
          <img
            src="desktop_bg.png"
            alt="bg"
            className="absolute w-full h-screen object-cover"
          />
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
          <Navbar
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            bringWindowToFront={bringWindowToFront}
          />
          <Clippy />
          <BlueMarker />
          {errors.map((error) => (
            <ErrorPopup
              key={error.id}
              isOpen={error.isOpen}
              onClose={() => {
                setErrors((prev) => prev.filter((e) => e.id !== error.id));
              }}
              title="Windows"
              message={`Cannot delete '${error.title}'. This action is not allowed in the portfolio demo.`}
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

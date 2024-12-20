import { useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/react";

import Navbar from "components/Navbar";
import Skills from "components/windows/Skills";
import Projects from "components/windows/Projects";
import WorkExperience from "components/windows/WorkExperience";
import Clippy from "components/Clippy";
import Minesweeper from "components/windows/Minesweeper";
import Education from "components/windows/Education";

export const meta: MetaFunction = () => {
  return [
    { title: "Elliot - Portfolio" },
    { name: "description", content: "Elliot's portfolio" },
  ];
};

enum LoadingState {
  Initial = 0,
  Boot1 = 1,
  Boot2 = 2,
  Black = 3,
  Desktop = 4,
}

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

  const bringWindowToFront = (windowTitle: string) => {
    setWindowOrder((prev) => {
      const newOrder = prev.filter((title) => title !== windowTitle);
      return [...newOrder, windowTitle];
    });
  };

  const [loading, setLoading] = useState<LoadingState>(LoadingState.Initial);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(LoadingState.Boot1);
    }, 500);
    const timer2 = setTimeout(() => {
      setLoading(LoadingState.Boot2);
    }, 1500);
    const timer3 = setTimeout(() => {
      setLoading(LoadingState.Black);
    }, 2100);
    const timer4 = setTimeout(() => {
      setLoading(LoadingState.Desktop);
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <>
      {/* Desktop Content - Always rendered but hidden during loading */}
      <div
        className={loading !== LoadingState.Desktop ? "hidden" : "flex p-0 m-0"}
      >
        <img
          src="desktop_bg.png"
          alt="bg"
          className="absolute w-full h-screen object-cover"
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
        />
        <Clippy />
      </div>

      {/* Loading Screens */}
      {loading === LoadingState.Initial && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen" />
      )}
      {loading === LoadingState.Boot1 && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen">
          <img
            src="boot.gif"
            alt="loading"
            className={`w-full h-screen ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          />
        </div>
      )}
      {loading === LoadingState.Boot2 && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen">
          <img
            src="boot.gif"
            alt="loading"
            className={`w-full h-screen ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            style={{ transition: "opacity 0.2s ease-in-out" }}
          />
        </div>
      )}
      {loading === LoadingState.Black && (
        <div className="fixed inset-0 z-50 flex p-0 m-0 bg-black h-screen" />
      )}
    </>
  );
}

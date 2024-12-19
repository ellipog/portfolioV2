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

export default function Index() {
  const [activeWindows, setActiveWindows] = useState<Record<string, boolean>>({
    Skills: true,
    Projects: true,
    Work_Experience: true,
    Minesweeper: true,
    Education: true,
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

  const [loading, setLoading] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(1);
    }, 500);
    const timer2 = setTimeout(() => {
      setLoading(2);
    }, 1500);
    const timer3 = setTimeout(() => {
      setLoading(3);
    }, 2100);
    const timer4 = setTimeout(() => {
      setLoading(4);
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return loading === 1 ? (
    <div className="flex p-0 m-0 bg-black h-screen">
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
  ) : loading === 2 ? (
    <div className="flex p-0 m-0 bg-black h-screen">
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
  ) : loading === 3 ? (
    <div className="flex p-0 m-0 bg-black h-screen"></div>
  ) : loading === 4 ? (
    <div className="flex p-0 m-0">
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
  ) : null;
}

import { useState, useEffect } from "react";
import { LoadingState } from "../../data/windows";
import DesktopIcons from "../../components/DesktopIcons";
import RightClick from "../../components/RightClick";
import Skills from "../../components/windows/Skills";
import Projects from "../../components/windows/Projects";
import WorkExperience from "../../components/windows/WorkExperience";
import Education from "../../components/windows/Education";
import Minesweeper from "../../components/windows/Minesweeper";
import Navbar from "../../components/Navbar";
import Clippy from "../../components/Clippy";
import BIOS from "../../components/BIOS";

export default function Index() {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.Initial);
  const [activeWindows, setActiveWindows] = useState<Record<string, boolean>>(
    {}
  );
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const [folders, setFolders] = useState<
    {
      title: string;
      pos: { x: number; y: number };
      icon: string;
      id: number;
    }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(LoadingState.BIOS), 500);
    setTimeout(() => setLoading(LoadingState.Boot1), 2000);
    setTimeout(() => setLoading(LoadingState.Boot2), 3000);
    setTimeout(() => setLoading(LoadingState.Black), 3600);
    setTimeout(() => setLoading(LoadingState.Desktop), 3900);
  }, []);

  const bringWindowToFront = (windowTitle: string) => {
    setWindowOrder((prev) => {
      const newOrder = prev.filter((title) => title !== windowTitle);
      return [...newOrder, windowTitle];
    });
  };

  const handleDelete = (title: string | undefined) => {
    // Handle delete logic here
  };

  return (
    <>
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
      {loading === LoadingState.Desktop && (
        <>
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
                bringWindowToFront={bringWindowToFront}
                folders={folders}
                setFolders={setFolders}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setLoading={setLoading}
                onDelete={handleDelete}
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
              <Education
                show={activeWindows.Education}
                setActiveWindows={setActiveWindows}
                windowOrder={windowOrder}
                bringToFront={() => bringWindowToFront("Education")}
              />
              <Minesweeper
                show={activeWindows.Minesweeper}
                setActiveWindows={setActiveWindows}
                windowOrder={windowOrder}
                bringToFront={() => bringWindowToFront("Minesweeper")}
              />
            </div>
          </RightClick>
          <Navbar
            showStartMenu={showStartMenu}
            setShowStartMenu={setShowStartMenu}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            bringWindowToFront={bringWindowToFront}
          />
          <Clippy />
        </>
      )}
    </>
  );
}

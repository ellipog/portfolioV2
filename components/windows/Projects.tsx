import { SetStateAction, Dispatch } from "react";
import Window from "components/Window";
import { projects } from "data/windows";

export default function Projects({
  setActiveWindows,
  show,
  windowOrder,
  bringToFront,
}: {
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  show: boolean;
  windowOrder: string[];
  bringToFront: () => void;
}) {
  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={projects.title}
      icon={projects.icon}
      width={600}
      setActiveWindows={setActiveWindows}
      pos={{ x: 30, y: 190 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="text-black flex flex-col gap-1.5">
        {projects.projects.map((project) => (
          <a
            key={project.name}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col group transition-colors ease-in-out p-2 rounded-lg"
          >
            <div className="flex justify-between w-full -mt-2">
              <div className="text-lg flex gap-2">
                <span className="group-hover:underline">{project.name}</span>
                <span className="text-xs text-gray-500 h-6 flex items-end">
                  {project.year}
                </span>
              </div>
              <div className="text-blue-500 group-hover:text-blue-600 group-active:text-blue-700 transition-colors ease-in-out flex items-center gap-2">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-4 h-4"
                />
                →
              </div>
            </div>
            <div className="w-[540px] text-xs text-start whitespace-pre-line overflow-x-hidden">
              {project.description}
            </div>
            <div className="flex">
              {project.languages.map((language) => (
                <div
                  key={language}
                  className="text-xs text-gray-500 bg-white/10 pr-1 py-1 rounded-lg"
                >
                  {language}
                  {project.languages.indexOf(language) !==
                  project.languages.length - 1
                    ? ", "
                    : ""}
                </div>
              ))}
            </div>
          </a>
        ))}
        <a
          href="https://github.com/Ellipog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 bg-white/10 px-2 my-1 rounded-lg flex justify-between"
        >
          More on github
          <div className="text-blue-500 group-hover:text-blue-600 group-active:text-blue-700 transition-colors ease-in-out flex items-center gap-2 pr-1">
            <img src="github.png" alt="github" className="w-4 h-4" />→
          </div>
        </a>
      </div>
    </Window>
  );
}

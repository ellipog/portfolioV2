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
      pos={{ x: 30, y: 290 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="relative">
        <div
          className="text-black flex flex-col gap-4 max-w-[560px] max-h-[500px] overflow-y-scroll p-2 winxp-scrollbar"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const isAtBottom =
              Math.abs(
                target.scrollHeight - target.scrollTop - target.clientHeight
              ) < 35;
            const isAtTop = target.scrollTop < 35;
            const fadeBottomElement = target.parentElement?.querySelector(
              ".fade-effect-bottom"
            );
            const fadeTopElement =
              target.parentElement?.querySelector(".fade-effect-top");
            if (fadeBottomElement) {
              fadeBottomElement.classList.toggle("opacity-0", isAtBottom);
            }
            if (fadeTopElement) {
              fadeTopElement.classList.toggle("opacity-0", isAtTop);
            }
          }}
        >
          <div className="fade-effect-top opacity-0 absolute top-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-transparent via-blue-50/50 to-blue-50 transition-opacity duration-200" />
          {projects.projects.map((project) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-white p-4 border border-gray-200 hover:border-blue-400 transition-all duration-200"
            >
              <div className="flex justify-between w-full">
                <div className="flex gap-2 items-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-6 h-6"
                  />
                  <span className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {project.year}
                  </span>
                </div>
                <div className="text-blue-500 hover:text-blue-600 transition-colors">
                  →
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600 whitespace-pre-line text-start">
                {project.description}
              </div>

              <div className="flex gap-2 mt-3 overflow-x-hidden">
                {project.languages.map((language) => (
                  <span
                    key={language}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </a>
          ))}

          <a
            href="https://github.com/Ellipog"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-sm text-gray-600">More on GitHub</span>
            <div className="flex items-center gap-2 text-blue-500">
              <img src="github.png" alt="github" className="w-5 h-5" />→
            </div>
          </a>
        </div>
        <div className="fade-effect-bottom absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-blue-50 via-blue-50/50 to-transparent transition-opacity duration-200" />
      </div>
    </Window>
  );
}

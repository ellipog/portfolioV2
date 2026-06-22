import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { projects, windows } from "data/windows";

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
  const windowConfig = windows.find((w) => w.title === "Projects");

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={projects.title}
      icon={projects.icon}
      width={600}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 100, y: 100 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      showMenuBar
      statusBar={<span>{projects.projects.length} objects</span>}
    >
      <div className="relative">
        <div
          className="text-black flex flex-col gap-4 max-w-[650px] max-h-[750px] overflow-y-scroll p-2 winxp-scrollbar"
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
          <div className="fade-effect-top opacity-0 absolute top-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-transparent via-[var(--xp-face)]/50 to-[var(--xp-face)] transition-opacity duration-200" />
          {projects.projects.map((project) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-white p-4 border border-[var(--xp-shadow)] hover:border-[var(--xp-select)] rounded-sm transition-all duration-200"
            >
              <div className="flex justify-between w-full">
                <div className="flex gap-2 items-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-7 h-7"
                  />
                  <span className="text-xl font-semibold group-hover:text-[var(--xp-select)] transition-colors">
                    {project.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[var(--xp-face-dark)] text-black border border-[var(--xp-shadow)] rounded-sm">
                    {project.year}
                  </span>
                </div>
                <div className="text-[var(--xp-select)] hover:text-blue-700 transition-colors">
                  →
                </div>
              </div>

              <div className="mt-2 text-base text-gray-700 whitespace-pre-line text-start">
                {project.description}
              </div>

              <div className="flex gap-2 mt-3 overflow-x-hidden">
                {project.languages.map((language) => (
                  <span
                    key={language}
                    className="text-xs px-2 py-1 bg-[var(--xp-face-dark)] text-[var(--xp-darkshadow)] border border-[var(--xp-shadow)] rounded-sm"
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
            className="mt-2 flex items-center justify-between p-3 bg-[var(--xp-face-dark)] hover:bg-[var(--xp-face)] border border-[var(--xp-shadow)] rounded-sm transition-colors"
          >
            <span className="text-sm text-gray-700">More on GitHub</span>
            <div className="flex items-center gap-2 text-[var(--xp-select)]">
              <img src="github.png" alt="github" className="w-5 h-5" />→
            </div>
          </a>
        </div>
        <div className="fade-effect-bottom absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-[var(--xp-face)] via-[var(--xp-face)]/50 to-transparent transition-opacity duration-200" />
      </div>
    </Window>
  );
}

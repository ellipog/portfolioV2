import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { skills, windows } from "data/windows";

export default function Skills({
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
  const windowConfig = windows.find((w) => w.title === "Skills");

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={skills.title}
      icon={skills.icon}
      width={300}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 50, y: 50 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      showMenuBar
      statusBar={<span>{skills.skills.length} objects</span>}
    >
      <div className="text-black flex flex-col -m-2 p-1 border border-[var(--xp-shadow)]">
        {skills.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex gap-3 items-center hover:bg-[var(--xp-select)] active:bg-[var(--xp-select)] hover:text-white p-1.5 px-2 transition-colors ease-in-out group "
          >
            <img
              src={`/skills/${skill.icon}`}
              alt={skill.name}
              className="w-6 h-6"
            />
            <a
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-between text-sm"
            >
              {skill.name}
              <span className="text-[var(--xp-select)] group-hover:text-white transition-colors ease-in-out">
                →
              </span>
            </a>
          </div>
        ))}
      </div>
    </Window>
  );
}

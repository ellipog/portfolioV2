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
    >
      <div className="text-black flex flex-col -m-1">
        {skills.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex gap-3 items-center hover:bg-blue-600 active:bg-blue-700 hover:text-white p-1 px-1.5 transition-colors ease-in-out group "
          >
            <img
              src={`/skills/${skill.icon}`}
              alt={skill.name}
              className="w-5 h-5"
            />
            <a
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-between"
            >
              {skill.name}
              <span className="text-blue-500 group-hover:text-white transition-colors ease-in-out">
                →
              </span>
            </a>
          </div>
        ))}
      </div>
    </Window>
  );
}

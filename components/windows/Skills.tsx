import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { skills } from "data/windows";

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
  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={skills.title}
      icon={skills.icon}
      width={300}
      setActiveWindows={setActiveWindows}
      pos={{ x: 1600, y: 20 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="text-black flex flex-col gap-1.5">
        {skills.skills.map((skill) => (
          <div key={skill.name} className="flex gap-3 items-center">
            <img
              src={`/skills/${skill.icon}`}
              alt={skill.name}
              className="w-5 h-5"
            />
            <a
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 active:text-blue-600 transition-colors ease-in-out w-full flex justify-between group"
            >
              {skill.name}
              <span className="text-blue-500 group-hover:text-blue-600 group-active:text-blue-700 transition-colors ease-in-out">
                →
              </span>
            </a>
          </div>
        ))}
      </div>
    </Window>
  );
}

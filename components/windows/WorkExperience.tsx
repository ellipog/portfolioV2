import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { workExperience } from "data/windows";

export default function WorkExperience({
  show,
  setActiveWindows,
  windowOrder,
  bringToFront,
}: {
  show: boolean;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  windowOrder: string[];
  bringToFront: () => void;
}) {
  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={workExperience.title.replace("_", " ")}
      icon={workExperience.icon}
      width={600}
      setActiveWindows={setActiveWindows}
      pos={{ x: 770, y: 440 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="text-black flex flex-col gap-4">
        {workExperience.workExperience.map((work) => (
          <div key={work.name}>
            <span className="text-xs text-gray-500 h-6 -mt-2 flex items-end">
              {work.year}
            </span>
            <div className="text-lg flex gap-2">
              {work.name}
              <span className="text-gray-500">- {work.role}</span>
            </div>
            <div className="w-[540px] text-xs text-start whitespace-pre-line overflow-x-hidden">
              {work.description}
            </div>
          </div>
        ))}
      </div>
    </Window>
  );
}

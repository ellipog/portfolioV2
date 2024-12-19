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
      pos={{ x: 770, y: 400 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="text-black relative max-w-[560px]">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-800" />

        <div className="flex flex-col gap-8">
          {workExperience.workExperience.map((work) => (
            <div key={work.name} className="flex items-start relative">
              <div className="absolute left-2 top-3 w-8 h-0.5 bg-blue-800" />
              <div className="pl-12 text-start">
                <span className="text-xs font-bold text-blue-800">
                  {work.year}
                </span>
                <div className="text-md font-bold">
                  {work.name}
                  <span className="text-gray-600 font-normal">
                    {" "}
                    - {work.role}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line text-start">
                  {work.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

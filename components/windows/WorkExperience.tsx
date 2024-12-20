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
          {workExperience.workExperience.map((work, i) => (
            <div
              key={i}
              className={`flex items-start relative ${
                work.isMinor ? "mt-[-1rem]" : ""
              }`}
            >
              <div
                className={`absolute left-2 top-3 bg-blue-800 ${
                  work.isMinor ? "w-4 h-0.5" : "w-8 h-0.5"
                }`}
              />
              <div
                className={`pl-12 text-start ${
                  work.isMinor
                    ? `pl-8 flex flex-row gap-3 items-center h-7 ${
                        i !== workExperience.workExperience.length - 1
                          ? "mb-[-1.2rem]"
                          : ""
                      }`
                    : "pl-12"
                }`}
              >
                <span
                  className={`text-xs font-bold text-blue-800 ${
                    work.isMinor ? "opacity-80" : ""
                  }`}
                >
                  {work.year}
                </span>
                <div
                  className={`${
                    work.isMinor ? "text-sm text-gray-500" : "text-md font-bold"
                  }`}
                >
                  {work.name}
                  {work.role && (
                    <span
                      className={`${
                        work.isMinor ? "text-gray-400" : "text-gray-600"
                      } font-normal`}
                    >
                      {" "}
                      - {work.role}
                    </span>
                  )}
                </div>
                {work.description && !work.isMinor && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line text-start">
                    {work.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

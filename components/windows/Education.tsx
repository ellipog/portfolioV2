import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { education, windows } from "data/windows";

export default function Education({
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
  const windowConfig = windows.find((w) => w.title === "Education");

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={education.title}
      icon={education.icon}
      width={600}
      setActiveWindows={setActiveWindows}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      pos={windowConfig?.defaultPosition || { x: 200, y: 200 }}
    >
      <div className="text-black relative max-w-[560px]">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-800" />

        <div className="flex flex-col gap-8">
          {education.education.map((edu, i) => (
            <div key={i} className="flex items-start relative">
              <div className="absolute left-2 top-3 w-8 h-0.5 bg-blue-800" />
              <div className="pl-12 text-start">
                <span className="text-xs font-bold text-blue-800">
                  {edu.year}
                </span>
                <div className="text-md font-bold">
                  {edu.name}
                  <span className="text-gray-600 font-normal">
                    {" "}
                    - {edu.school}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line text-start">
                  {edu.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

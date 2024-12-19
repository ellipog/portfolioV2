import { Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { education } from "data/windows";

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
  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title={education.title}
      icon={education.icon}
      width={750}
      setActiveWindows={setActiveWindows}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      pos={{ x: 230, y: 50 }}
    >
      <div className="text-black grid grid-cols-2 gap-3">
        {education.education.map((edu) => (
          <div
            key={edu.name}
            className="bg-white p-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-base font-bold">{edu.name}</h3>
              <span className="text-xs text-gray-600 border border-gray-300 px-2 py-0.5 rounded">
                {edu.year}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {edu.school}
            </div>
            <p className="text-xs text-gray-600">{edu.description}</p>
          </div>
        ))}
      </div>
    </Window>
  );
}

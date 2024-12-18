import { useEffect, useState } from "react";

export default function Navbar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString("no"));

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString("no"));
    }, 1000);
  }, []);

  return (
    <div className="fixed w-full h-12 bottom-0 flex justify-between items-center bg-gradient-to-b from-blue-400 to-blue-700">
      {/* START BAR */}
      <div className="flex gap-2 pl-4 pr-6 bg-gradient-to-b from-green-400 to-green-700 h-12 justify-center items-center rounded-r-xl text-white">
        <img src="start_logo.png" alt="start" className="w-9 h-8" />
        <span className="transform -skew-x-[20deg] text-xl">start</span>
      </div>
      {/* ICON BAR */}
      <div className="flex w-full gap-2 h-12 justify-center items-center rounded-l-xl text-white font-bold"></div>
      {/* END BAR */}
      <div className="flex gap-2 pr-4 pl-6 bg-gradient-to-b from-cyan-400 to-cyan-700 h-12 justify-center items-center rounded-l-xl text-white">
        <span className="text-xl">{time}</span>
      </div>
    </div>
  );
}

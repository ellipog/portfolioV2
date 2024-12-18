import Navbar from "components/Navbar";
import Window from "components/Window";
import { useState } from "react";

export default function Index() {
  const [show, setShow] = useState(true);

  return (
    <div className="flex p-0 m-0">
      <img
        src="desktop_bg.png"
        alt="bg"
        className="absolute w-full min-h-screen"
      />
      <Window show={show} />
      <Navbar />
    </div>
  );
}

import { personal } from "data/windows";
import { motion } from "framer-motion";

export default function BIOS() {
  return (
    <div className="bg-black text-white font-mono p-8 h-screen w-screen flex flex-col gap-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl mb-4">Award Modular BIOS v4.51PG</h1>
        <p>Copyright (C) 2025, Aaen Software Inc.*</p>
        <p className="mb-4">Portfolio BIOS Version 1.0</p>

        <div className="text-gray-400">
          <p>
            CPU: {personal.name} @ {personal.profession}
          </p>
          <p>Memory Test: {personal.age}</p>
          <p>
            Skills Cache: {personal.email}, {personal.phone}
          </p>
        </div>

        <div className="mt-8 text-yellow-500">
          <p>Press DEL to enter SETUP</p>
          <p>Press F8 to view Skills</p>
          <p>Press F12 to view Projects</p>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Warning: Clippy.exe has been detected in system memory</p>
          <p>Minesweeper performance may vary based on luck</p>
        </div>
      </motion.div>
    </div>
  );
}

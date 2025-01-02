import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BlueScreenProps {
  onRestart: () => void;
}

export default function BlueScreen({ onRestart }: BlueScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      onRestart();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onRestart]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-16 z-[9999] flex flex-col items-center justify-center">
      <div className="max-w-3xl">
        <h1 className="text-3xl mb-8">
          A problem has been detected and Windows has been shut down to prevent
          damage to your computer.
        </h1>
        <p className="mb-4">CLIPPY_DEFENSE_MECHANISM</p>
        <p className="mb-8">
          If this is the first time you've seen this stop error screen, you
          probably shouldn't have tried to delete Clippy.exe. If this screen
          appears again, follow these steps:
        </p>
        <p className="mb-4">
          * Never attempt to delete Clippy.exe again. He is watching.
        </p>
        <p className="mb-4">
          * Check to make sure any new software is properly installed.
        </p>
        <p className="mb-4">
          * If problems continue, enable boot logging and check for viruses.
        </p>
        <p className="mb-8">
          Technical information for support personnel:
          <br />
          *** STOP: 0x000000D1 (0x0000000C,0x00000002,0x00000000,0xF86B5A89)
          <br />
          ***&nbsp;&nbsp;clippy.sys - Address F86B5A89 base at F86B5000,
          DateStamp 3d6dd67c
        </p>
        <motion.p
          animate={{ opacity: [1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-xl"
        >
          The system will restart in {secondsLeft} seconds...
        </motion.p>
      </div>
    </div>
  );
}

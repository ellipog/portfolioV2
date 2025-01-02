import { motion } from "framer-motion";

interface ErrorPopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type: "error" | "warning" | "info";
}

export default function ErrorPopup({
  message,
  isOpen,
  onClose,
  type,
}: ErrorPopupProps) {
  const randomX = Math.random() * (window.innerWidth - 300);
  const randomY = Math.random() * (window.innerHeight - 200);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-[9997]"
      style={{ left: randomX, top: randomY }}
    >
      <div className="bg-white border-2 border-gray-300 shadow-lg w-[300px] overflow-hidden">
        <div className="bg-[#000082] text-white px-2 py-1 flex justify-between items-center">
          <span>Windows</span>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-500 px-2 py-0.5"
          >
            ×
          </button>
        </div>
        <div className="p-4 flex gap-4">
          <img
            src={
              type === "error"
                ? "error.png"
                : type === "warning"
                ? "warning.png"
                : "info.png"
            }
            alt={type}
            className="w-10 h-10"
          />
          <p className="text-sm">{message}</p>
        </div>
        <div className="bg-gray-100 p-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#000082] text-white hover:bg-[#0000a8] active:bg-[#00006f]"
          >
            OK
          </button>
        </div>
      </div>
    </motion.div>
  );
}

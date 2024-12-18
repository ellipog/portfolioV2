import Draggable from "react-draggable";
import { motion } from "framer-motion";

export default function Window({ show }: { show: boolean }) {
  return (
    <Draggable>
      <motion.div
        className={`relative hover:cursor-grab active:cursor-grabbing ${
          show ? "flex" : "hidden"
        }`}
      >
        Hello worlds
      </motion.div>
    </Draggable>
  );
}

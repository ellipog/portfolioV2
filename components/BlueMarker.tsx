import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

export default function BlueMarker() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentPos, setCurrentPos] = useState<Position | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawing) {
        setCurrentPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY };
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      className="fixed inset-0 z-[1]"
      style={{ pointerEvents: isDrawing ? "none" : "auto" }}
    >
      {isDrawing && startPos && currentPos && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-200/20"
          style={{
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(currentPos.x - startPos.x),
            height: Math.abs(currentPos.y - startPos.y),
          }}
        />
      )}
    </button>
  );
}

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { windows } from "data/windows";
import { playSound } from "utils/playSound";

// Helper to parse hex color to RGBA for flood fill
const parseColorToRGBA = (hex: string) => {
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 255,
  };
};

// Helper to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Flood Fill Algorithm (Stack-based DFS to prevent stack overflow)
const floodFill = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: { r: number; g: number; b: number; a: number }
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const targetIdx = (startY * width + startX) * 4;
  const targetR = data[targetIdx];
  const targetG = data[targetIdx + 1];
  const targetB = data[targetIdx + 2];
  const targetA = data[targetIdx + 3];

  const fillR = fillColor.r;
  const fillG = fillColor.g;
  const fillB = fillColor.b;
  const fillA = fillColor.a;

  // If already filled with target color, do nothing
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return;
  }

  const queue: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(width * height);

  while (queue.length > 0) {
    const [x, y] = queue.pop()!;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const pixelIdx = idx * 4;
    const r = data[pixelIdx];
    const g = data[pixelIdx + 1];
    const b = data[pixelIdx + 2];
    const a = data[pixelIdx + 3];

    if (r === targetR && g === targetG && b === targetB && a === targetA) {
      data[pixelIdx] = fillR;
      data[pixelIdx + 1] = fillG;
      data[pixelIdx + 2] = fillB;
      data[pixelIdx + 3] = fillA;

      if (x > 0) queue.push([x - 1, y]);
      if (x < width - 1) queue.push([x + 1, y]);
      if (y > 0) queue.push([x, y - 1]);
      if (y < height - 1) queue.push([x, y + 1]);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// ---------------- SVG ICONS FOR THE 16 RETRO MS PAINT TOOLS ----------------

const FreeSelectIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M2 8s1-3 4-3 4 3 4 3-1 3-4 3-4-3-4-3zm8-3l4-3M12 2l2 2" stroke="currentColor" fill="none" strokeWidth="1" />
  </svg>
);

const MarqueeSelectIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeDasharray="2" fill="none" strokeWidth="1" />
  </svg>
);

const EraserIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M2 9l4 4 8-8-4-4-8 8zm4 4h8" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BucketIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M2 10l5 5 7-7-5-5-7 7zm11-6s2 1 2 3-2 3-2 3" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 12c-2 2-5 0-5 0" stroke="currentColor" fill="none" />
  </svg>
);

const EyedropperIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M12 2l2 2-8 8H4v-2l8-8zM3 13l2-2" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <circle cx="7" cy="7" r="4" stroke="currentColor" fill="none" strokeWidth="1.5" />
    <path d="M10 10l4 4" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M12 2l2 2-9 9-3 1 1-3 9-9z" stroke="currentColor" fill="none" strokeWidth="1.2" />
    <path d="M11 3l2 2" stroke="currentColor" />
  </svg>
);

const BrushIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M4 12c-1 1-2 3-2 3s2-1 3-2l8-8-3-3-8 8zm9-7l-1-1" stroke="currentColor" fill="none" strokeWidth="1.2" />
    <path d="M2 14c.5-.5 1-.5 1.5 0" stroke="currentColor" />
  </svg>
);

const AirbrushIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M6 3h4v2H6V3zm1 2h2v7H7V5zm-2 7h6v2H5v-2zM8 2V1" stroke="currentColor" fill="none" strokeWidth="1.2" />
    <circle cx="12" cy="3" r="0.5" fill="currentColor" />
    <circle cx="13" cy="5" r="0.5" fill="currentColor" />
    <circle cx="11" cy="4" r="0.5" fill="currentColor" />
    <circle cx="14" cy="2" r="0.5" fill="currentColor" />
  </svg>
);

const TextIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <text x="3" y="13" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="currentColor">A</text>
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M2 14L14 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CurveIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M2 14c4-10 8 4 12-10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const RectIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <rect x="2" y="3" width="12" height="10" stroke="currentColor" fill="none" strokeWidth="1.5" />
  </svg>
);

const PolygonIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <path d="M8 2l6 4-2 7-8-1-2-6z" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const EllipseIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <ellipse cx="8" cy="8" rx="6" ry="4" stroke="currentColor" fill="none" strokeWidth="1.5" />
  </svg>
);

const RoundedRectIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 pointer-events-none">
    <rect x="2" y="3" width="12" height="10" rx="3" ry="3" stroke="currentColor" fill="none" strokeWidth="1.5" />
  </svg>
);

interface HistoryState {
  width: number;
  height: number;
  imageData: ImageData;
}

export default function Paint({
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
  const windowConfig = windows.find((w) => w.title === "Paint");

  // Core Drawing States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState("pencil");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Tool Specific Options
  const [brushSize, setBrushSize] = useState(5);
  const [brushShape, setBrushShape] = useState<"round" | "square">("round");
  const [eraserSize, setEraserSize] = useState(12);
  const [airbrushRadius, setAirbrushRadius] = useState(15);
  const [lineSize, setLineSize] = useState(2);
  const [fillOption, setFillOption] = useState<1 | 2 | 3>(1); // 1 = Border only, 2 = Border + Fill, 3 = Fill only

  // Undo / History states
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Layout / Interaction state
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectionDims, setSelectionDims] = useState<{ w: number; h: number } | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  // Resizing canvas handles
  const [isResizing, setIsResizing] = useState<"right" | "bottom" | "corner" | null>(null);
  const resizeStartSize = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const resizeStartMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for drawing coordinates
  const startPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);
  const skipHistoryOnUp = useRef(false);

  // Spray can state
  const sprayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSprayPos = useRef({ x: 0, y: 0 });

  // Initial setup on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Initialize canvas as white
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Save initial state to history
          const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setHistory([
            {
              width: canvas.width,
              height: canvas.height,
              imageData: initialData,
            },
          ]);
          setHistoryIndex(0);
        }
      }
    }
  }, [mounted]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+S, Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        downloadImage();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        clearCanvas();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, history, historyIndex]);

  // Click outside menus
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenu(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Window-level resize handler dragging logic
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.round((e.clientX - resizeStartMouse.current.x) / zoom);
      const deltaY = Math.round((e.clientY - resizeStartMouse.current.y) / zoom);

      let newWidth = resizeStartSize.current.width;
      let newHeight = resizeStartSize.current.height;

      if (isResizing === "right" || isResizing === "corner") {
        newWidth = Math.max(10, resizeStartSize.current.width + deltaX);
      }
      if (isResizing === "bottom" || isResizing === "corner") {
        newHeight = Math.max(10, resizeStartSize.current.height + deltaY);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        // Backup current canvas
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        setCanvasSize({ width: newWidth, height: newHeight });

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, newWidth, newHeight);
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      saveHistory();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, zoom]);

  // ---------------- CORE ACTIONS ----------------

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);

    if (newHistory.length > 50) {
      newHistory.shift();
    }

    setHistory([
      ...newHistory,
      {
        width: canvas.width,
        height: canvas.height,
        imageData: currentData,
      },
    ]);
    setHistoryIndex(newHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const state = history[prevIndex];
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = state.width;
        canvas.height = state.height;
        setCanvasSize({ width: state.width, height: state.height });

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(state.imageData, 0, 0);
        }
      }
      setHistoryIndex(prevIndex);
      playSound("click");
    } else {
      playSound("error");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveHistory();
        playSound("recycle");
      }
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "untitled.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    playSound("notify");
  };

  // ---------------- DRAWING EVENT HANDLERS ----------------

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    bringToFront();

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);

    setIsDrawing(true);
    startPos.current = { x, y };
    lastPos.current = { x, y };

    const isRightClick = e.button === 2;
    const activeColor = isRightClick ? bgColor : fgColor;

    // Capture snapshot for shape dragging previews
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === "pencil") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "brush") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = brushShape === "square" ? "square" : "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      // Direct square drawing at mouse down
      ctx.fillStyle = bgColor;
      ctx.fillRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
    } else if (tool === "bucket") {
      const colorRGBA = parseColorToRGBA(activeColor);
      floodFill(ctx, x, y, colorRGBA);
      skipHistoryOnUp.current = true;
      saveHistory();
    } else if (tool === "eyedropper") {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      if (isRightClick) {
        setBgColor(hexColor);
      } else {
        setFgColor(hexColor);
      }
    } else if (tool === "spray") {
      startSpray(ctx, x, y, activeColor);
    } else if (tool === "zoom") {
      // Toggle zoom level
      if (zoom === 1) setZoom(2);
      else if (zoom === 2) setZoom(4);
      else if (zoom === 4) setZoom(8);
      else setZoom(1);
    } else if (tool === "text") {
      const text = prompt("Enter text to draw on canvas:");
      if (text) {
        ctx.fillStyle = activeColor;
        ctx.font = "14px Arial, Helvetica, sans-serif";
        ctx.textBaseline = "top";
        ctx.fillText(text, x, y);
        saveHistory();
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);

    setCursorCoords({ x, y });

    if (!isDrawing) return;

    const isRightClick = e.buttons === 2;
    const activeColor = isRightClick ? bgColor : fgColor;

    const dimW = Math.abs(x - startPos.current.x);
    const dimH = Math.abs(y - startPos.current.y);
    setSelectionDims({ w: dimW, h: dimH });

    if (tool === "pencil") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "brush") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = brushShape === "square" ? "square" : "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      drawSquareEraser(ctx, lastPos.current.x, lastPos.current.y, x, y, eraserSize);
    } else if (tool === "spray") {
      currentSprayPos.current = { x, y };
    } else if (tool === "line") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = lineSize;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "rect" || tool === "ellipse" || tool === "rounded-rect") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      const rx = Math.min(startPos.current.x, x);
      const ry = Math.min(startPos.current.y, y);
      const rw = Math.abs(startPos.current.x - x);
      const rh = Math.abs(startPos.current.y - y);

      drawOptionShape(
        ctx,
        rx,
        ry,
        rw,
        rh,
        activeColor,
        isRightClick ? fgColor : bgColor,
        tool
      );
    } else if (
      tool === "free-select" ||
      tool === "select" ||
      tool === "curve" ||
      tool === "polygon"
    ) {
      // Fallback pencil behavior for less common retro tools in demo
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPos.current = { x, y };
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    stopSpray();
    if (!skipHistoryOnUp.current) {
      saveHistory();
    }
    skipHistoryOnUp.current = false;
    setSelectionDims(null);
  };

  const handleMouseLeave = () => {
    setCursorCoords(null);
    if (isDrawing) {
      setIsDrawing(false);
      stopSpray();
      if (!skipHistoryOnUp.current) {
        saveHistory();
      }
      skipHistoryOnUp.current = false;
      setSelectionDims(null);
    }
  };

  // ---------------- SHAPE DRAWING OPTIONS HELPER ----------------

  const drawOptionShape = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    strokeColor: string,
    fillColor: string,
    type: "rect" | "ellipse" | "rounded-rect"
  ) => {
    ctx.beginPath();
    if (type === "rect") {
      if (fillOption === 1) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.strokeRect(x, y, w, h);
      } else if (fillOption === 2) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.strokeRect(x, y, w, h);
      } else if (fillOption === 3) {
        ctx.fillStyle = strokeColor;
        ctx.fillRect(x, y, w, h);
      }
    } else if (type === "ellipse") {
      const rx = w / 2;
      const ry = h / 2;
      const cx = x + rx;
      const cy = y + ry;

      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      if (fillOption === 1) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.stroke();
      } else if (fillOption === 2) {
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.stroke();
      } else if (fillOption === 3) {
        ctx.fillStyle = strokeColor;
        ctx.fill();
      }
    } else if (type === "rounded-rect") {
      const radius = Math.min(w, h, 10);
      if (fillOption === 1) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.stroke();
      } else if (fillOption === 2) {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineSize;
        ctx.stroke();
      } else if (fillOption === 3) {
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
      }
    }
  };

  // Smooth Square Eraser drawing interpolater
  const drawSquareEraser = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number
  ) => {
    ctx.fillStyle = bgColor;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(Math.ceil(distance / (size / 4)), 1);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x1 + dx * t;
      const cy = y1 + dy * t;
      ctx.fillRect(Math.round(cx - size / 2), Math.round(cy - size / 2), size, size);
    }
  };

  // ---------------- SPRAY CAN LOGIC ----------------

  const startSpray = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    stopSpray();
    currentSprayPos.current = { x, y };
    ctx.fillStyle = color;

    sprayPoints(ctx, color);

    sprayIntervalRef.current = setInterval(() => {
      sprayPoints(ctx, color);
    }, 30);
  };

  const sprayPoints = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color;
    const radius = airbrushRadius;
    // Sprays 8 dots in a random circular offset
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const sx = Math.round(currentSprayPos.current.x + Math.cos(angle) * r);
      const sy = Math.round(currentSprayPos.current.y + Math.sin(angle) * r);
      ctx.fillRect(sx, sy, 1, 1);
    }
  };

  const stopSpray = () => {
    if (sprayIntervalRef.current) {
      clearInterval(sprayIntervalRef.current);
      sprayIntervalRef.current = null;
    }
  };

  // ---------------- RESIZING HANDLE MOUSE DOWN ----------------

  const handleHandleMouseDown = (
    type: "right" | "bottom" | "corner",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(type);
    resizeStartSize.current = { width: canvasSize.width, height: canvasSize.height };
    resizeStartMouse.current = { x: e.clientX, y: e.clientY };
  };

  // ---------------- RETRO TOOLS SPECIFICATION ----------------

  const toolsList = [
    { id: "free-select", name: "Free-form Select", icon: FreeSelectIcon, tooltip: "Selects a free-form area. (Draws pencil fallback in demo)" },
    { id: "select", name: "Select", icon: MarqueeSelectIcon, tooltip: "Selects a rectangular area. (Draws pencil fallback in demo)" },
    { id: "eraser", name: "Eraser", icon: EraserIcon, tooltip: "Erases a portion of the picture to the background color" },
    { id: "bucket", name: "Fill", icon: BucketIcon, tooltip: "Fills an area of connected same-color pixels" },
    { id: "eyedropper", name: "Pick Color", icon: EyedropperIcon, tooltip: "Picks color under cursor (Left = Fore, Right = Back)" },
    { id: "zoom", name: "Magnifier", icon: ZoomIcon, tooltip: "Toggles zoom magnification scale" },
    { id: "pencil", name: "Pencil", icon: PencilIcon, tooltip: "Draws a freeform line one pixel wide" },
    { id: "brush", name: "Brush", icon: BrushIcon, tooltip: "Draws with brush of selected size and shape" },
    { id: "spray", name: "Airbrush", icon: AirbrushIcon, tooltip: "Draws with a spray pattern of selected size" },
    { id: "text", name: "Text", icon: TextIcon, tooltip: "Places a text block where clicked" },
    { id: "line", name: "Line", icon: LineIcon, tooltip: "Draws a straight line with selected thickness" },
    { id: "curve", name: "Curve", icon: CurveIcon, tooltip: "Draws a curve line. (Draws pencil fallback in demo)" },
    { id: "rect", name: "Rectangle", icon: RectIcon, tooltip: "Draws a rectangle with selected outline and fill option" },
    { id: "polygon", name: "Polygon", icon: PolygonIcon, tooltip: "Draws a polygon shape. (Draws pencil fallback in demo)" },
    { id: "ellipse", name: "Ellipse", icon: EllipseIcon, tooltip: "Draws an ellipse with selected outline and fill option" },
    { id: "rounded-rect", name: "Rounded Rectangle", icon: RoundedRectIcon, tooltip: "Draws a rounded rectangle with selected outline and fill" },
  ];

  const currentToolObj = toolsList.find((t) => t.id === tool);

  // 28 Standard Retro Colors
  const colorsPalette = [
    "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080ff", "#004080", "#400080", "#804000",
    "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff80ff", "#ff8000"
  ];

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title="Paint"
      icon="/paint.svg"
      width={730}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 100, y: 100 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      bodyClassName="window-body paint-app m-0 p-0 overflow-hidden flex-1 flex flex-col min-h-0 bg-[#c0c0c0] text-black font-sans"
    >
      <div className="w-full h-full min-h-[420px] flex flex-col bg-[#c0c0c0] text-black font-sans text-xs select-none">
        
        {/* 1. Menu Bar */}
        <div className="relative flex flex-row items-center h-[22px] shrink-0 bg-[#c0c0c0] px-1 gap-0 border-b border-[#808080]">
          
          {/* File Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMenu("File"); playSound("click"); }}
              className={`xp-btn-reset paint-menu-btn px-2 py-0 text-[11px] leading-[18px] hover:bg-[#000080] hover:text-white cursor-pointer ${
                activeMenu === "File" ? "bg-[#000080] text-white" : ""
              }`}
            >
              File
            </button>
            {activeMenu === "File" && (
              <div 
                className="absolute left-0 top-full mt-0.5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg py-1 z-[100] w-40 font-sans text-xs select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => { clearCanvas(); setActiveMenu(null); }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>New</span>
                  <span className="text-gray-500 hover:text-white">Ctrl+N</span>
                </button>
                <button
                  onClick={() => { downloadImage(); setActiveMenu(null); }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>Save...</span>
                  <span className="text-gray-500 hover:text-white">Ctrl+S</span>
                </button>
                <div className="border-t border-[#808080] my-1" />
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    setActiveWindows((prev) => ({ ...prev, Paint: false }));
                  }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
                >
                  Exit
                </button>
              </div>
            )}
          </div>

          {/* Edit Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMenu("Edit"); playSound("click"); }}
              className={`xp-btn-reset paint-menu-btn px-2 py-0 text-[11px] leading-[18px] hover:bg-[#000080] hover:text-white cursor-pointer ${
                activeMenu === "Edit" ? "bg-[#000080] text-white" : ""
              }`}
            >
              Edit
            </button>
            {activeMenu === "Edit" && (
              <div 
                className="absolute left-0 top-full mt-0.5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg py-1 z-[100] w-40 font-sans text-xs select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { undo(); setActiveMenu(null); }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>Undo</span>
                  <span className="text-gray-500 hover:text-white">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => { clearCanvas(); setActiveMenu(null); }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
                >
                  Clear Image
                </button>
              </div>
            )}
          </div>

          {/* Help Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMenu("Help"); playSound("click"); }}
              className={`xp-btn-reset paint-menu-btn px-2 py-0 text-[11px] leading-[18px] hover:bg-[#000080] hover:text-white cursor-pointer ${
                activeMenu === "Help" ? "bg-[#000080] text-white" : ""
              }`}
            >
              Help
            </button>
            {activeMenu === "Help" && (
              <div 
                className="absolute left-0 top-full mt-0.5 bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-lg py-1 z-[100] w-40 font-sans text-xs select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { setShowAbout(true); setActiveMenu(null); }}
                  className="xp-btn-reset w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
                >
                  About Paint
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Main Area (Sidebar & Canvas) */}
        <div className="flex-1 flex overflow-hidden p-1 gap-1 min-h-0">
          
          {/* Left Sidebar (Tools & Options) — classic MS Paint: 52px, 24×24 tools */}
          <div className="w-[52px] flex flex-col gap-0.5 shrink-0">
            
            {/* 16-Tool Grid */}
            <div className="grid grid-cols-2 gap-0.5 bg-[#c0c0c0] w-[52px]">
              {toolsList.map((t) => {
                const isActive = tool === t.id;
                const IconComponent = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    onClick={() => { setTool(t.id); playSound("click"); }}
                    className={`paint-tool-btn flex items-center justify-center cursor-pointer rounded-none
                      ${
                        isActive
                          ? "border border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#e6e6e6]"
                          : "border border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] hover:bg-[#d8d8d8]"
                      }`}
                  >
                    <IconComponent />
                  </button>
                );
              })}
            </div>

            {/* Tool Specific Options Box */}
            <div className="w-[52px] flex-1 min-h-[64px] border border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#dcdcdc] p-0.5 flex flex-col items-center justify-center gap-0.5 select-none">
              
              {/* Eraser Options */}
              {tool === "eraser" && (
                <div className="flex flex-col items-center gap-0.5 w-[48px]">
                  {[6, 12, 18, 24].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => { setEraserSize(size); playSound("click"); }}
                      className={`xp-btn-reset relative flex items-center justify-center w-[48px] h-3 border ${
                        eraserSize === size ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                      }`}
                    >
                      <div
                        className="bg-black"
                        style={{
                          width: `${Math.max(2, size / 1.5)}px`,
                          height: `${Math.max(2, size / 1.5)}px`,
                          backgroundColor: eraserSize === size ? "#ffffff" : "#000000",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Brush Options */}
              {tool === "brush" && (
                <div className="flex flex-col items-center gap-0.5 w-[48px]">
                  {/* Shape Selector */}
                  <div className="flex gap-0.5 mb-0.5 border-b border-black/10 pb-0.5 justify-center">
                    <button
                      type="button"
                      title="Round Tip"
                      onClick={() => { setBrushShape("round"); playSound("click"); }}
                      className={`xp-btn-reset w-4 h-4 rounded-full border ${
                        brushShape === "round" ? "bg-[#000080] border-white" : "border-black"
                      }`}
                    />
                    <button
                      type="button"
                      title="Square Tip"
                      onClick={() => { setBrushShape("square"); playSound("click"); }}
                      className={`xp-btn-reset w-4 h-4 border ${
                        brushShape === "square" ? "bg-[#000080] border-white" : "border-black"
                      }`}
                    />
                  </div>
                  {/* Sizes */}
                  {[2, 5, 8, 12, 16].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => { setBrushSize(size); playSound("click"); }}
                      className={`xp-btn-reset relative flex items-center justify-center w-[48px] h-3 border ${
                        brushSize === size ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                      }`}
                    >
                      <div
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          backgroundColor: brushSize === size ? "#ffffff" : "#000000",
                          borderRadius: brushShape === "round" ? "9999px" : "0px",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Spray Can Options */}
              {tool === "spray" && (
                <div className="flex flex-col items-center gap-1 w-[48px]">
                  {[8, 15, 25].map((radius, i) => (
                    <button
                      type="button"
                      key={radius}
                      onClick={() => { setAirbrushRadius(radius); playSound("click"); }}
                      className={`xp-btn-reset relative flex flex-col items-center justify-center w-[48px] h-6 border ${
                        airbrushRadius === radius ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                      }`}
                    >
                      {/* Faux spray pattern preview */}
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <div
                          className="rounded-full bg-black/60 filter blur-[0.5px]"
                          style={{
                            width: `${(i + 1) * 6}px`,
                            height: `${(i + 1) * 6}px`,
                            backgroundColor: airbrushRadius === radius ? "#ffffff" : "#000000",
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Zoom Options */}
              {tool === "zoom" && (
                <div className="grid grid-cols-1 gap-0.5 w-[48px]">
                  {[1, 2, 4, 8].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => { setZoom(lvl); playSound("click"); }}
                      className={`xp-btn-reset w-[48px] py-0.5 text-center font-bold text-[10px] leading-none border ${
                        zoom === lvl
                          ? "bg-[#000080] text-white border-white"
                          : "bg-[#c0c0c0] text-black border-[#808080] hover:bg-black/10"
                      }`}
                    >
                      {lvl}x
                    </button>
                  ))}
                </div>
              )}

              {/* Line thickness options */}
              {tool === "line" && (
                <div className="flex flex-col items-center gap-0.5 w-[48px]">
                  {[1, 2, 4, 6, 8].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => { setLineSize(size); playSound("click"); }}
                      className={`xp-btn-reset relative flex items-center justify-center w-[48px] h-3 border ${
                        lineSize === size ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                      }`}
                    >
                      <div
                        className="bg-black w-3/4"
                        style={{
                          height: `${size}px`,
                          backgroundColor: lineSize === size ? "#ffffff" : "#000000",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Shapes Options (Border & Fill Modes) */}
              {(tool === "rect" || tool === "ellipse" || tool === "rounded-rect") && (
                <div className="flex flex-col gap-0.5 w-[48px]">
                  {/* Mode 1: Outline only */}
                  <button
                    type="button"
                    onClick={() => { setFillOption(1); playSound("click"); }}
                    title="Outline Border Only"
                    className={`xp-btn-reset w-[48px] h-6 flex items-center justify-center border ${
                      fillOption === 1 ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                    }`}
                  >
                    <div className={`w-6 h-4 border-2 ${fillOption === 1 ? "border-white" : "border-black"}`} />
                  </button>
                  {/* Mode 2: Outline + Fill */}
                  <button
                    type="button"
                    onClick={() => { setFillOption(2); playSound("click"); }}
                    title="Outline and Fill background"
                    className={`xp-btn-reset w-[48px] h-6 flex items-center justify-center border ${
                      fillOption === 2 ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                    }`}
                  >
                    <div
                      className={`w-6 h-4 border-2 ${fillOption === 2 ? "border-white bg-[#00ffff]/30" : "border-black bg-gray-400"}`}
                    />
                  </button>
                  {/* Mode 3: Fill only */}
                  <button
                    type="button"
                    onClick={() => { setFillOption(3); playSound("click"); }}
                    title="Solid Fill only"
                    className={`xp-btn-reset w-[48px] h-6 flex items-center justify-center border ${
                      fillOption === 3 ? "bg-[#000080] border-white" : "border-transparent hover:bg-black/10"
                    }`}
                  >
                    <div className={`w-6 h-4 ${fillOption === 3 ? "bg-white" : "bg-black"}`} />
                  </button>
                </div>
              )}

              {/* Default Empty Option Label */}
              {!["eraser", "brush", "spray", "zoom", "line", "rect", "ellipse", "rounded-rect"].includes(tool) && (
                <div className="text-[10px] text-gray-500 text-center select-none font-sans px-1">
                  No options available
                </div>
              )}
            </div>
          </div>

          {/* Right Canvas Area (Scrollable Viewport) */}
          <div className="flex-1 overflow-auto bg-[#808080] p-4 flex items-start justify-start border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white relative select-none winxp-scrollbar">
            
            {/* Scaled Canvas Wrapper */}
            <div
              className="relative"
              style={{
                width: `${canvasSize.width * zoom}px`,
                height: `${canvasSize.height * zoom}px`,
                paddingRight: "6px",
                paddingBottom: "6px",
              }}
            >
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="bg-white border shadow-md hover:cursor-crosshair"
                style={{
                  width: `${canvasSize.width * zoom}px`,
                  height: `${canvasSize.height * zoom}px`,
                  imageRendering: "pixelated",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Resizing handles (8px squares) */}
              {zoom === 1 && (
                <>
                  {/* Right middle handle */}
                  <div
                    onMouseDown={(e) => handleHandleMouseDown("right", e)}
                    className="absolute bg-blue-800 border border-white w-1.5 h-1.5 cursor-ew-resize"
                    style={{
                      top: `${canvasSize.height / 2 - 3}px`,
                      left: `${canvasSize.width}px`,
                      zIndex: 10,
                    }}
                  />
                  {/* Bottom middle handle */}
                  <div
                    onMouseDown={(e) => handleHandleMouseDown("bottom", e)}
                    className="absolute bg-blue-800 border border-white w-1.5 h-1.5 cursor-ns-resize"
                    style={{
                      top: `${canvasSize.height}px`,
                      left: `${canvasSize.width / 2 - 3}px`,
                      zIndex: 10,
                    }}
                  />
                  {/* Corner handle (Bottom right) */}
                  <div
                    onMouseDown={(e) => handleHandleMouseDown("corner", e)}
                    className="absolute bg-blue-800 border border-white w-1.5 h-1.5 cursor-nwse-resize"
                    style={{
                      top: `${canvasSize.height}px`,
                      left: `${canvasSize.width}px`,
                      zIndex: 10,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. Bottom Color Box & Palette Area */}
        <div className="flex bg-[#c0c0c0] p-1 gap-2 border-t border-[#808080] items-center">
          
          {/* Overlapping Color Preview box */}
          <div className="relative w-8 h-8 shrink-0 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-gray-200">
            {/* Background Color Square (Lower right) */}
            <div
              className="absolute w-4 h-4 border border-gray-400 bottom-1 right-1 z-[1]"
              style={{ backgroundColor: bgColor }}
              title="Active Background Color"
            />
            {/* Foreground Color Square (Upper left) */}
            <div
              className="absolute w-4 h-4 border border-gray-400 top-1 left-1 z-[2]"
              style={{ backgroundColor: fgColor }}
              title="Active Foreground Color"
            />
          </div>

          {/* Two-row Palette Grid */}
          <div className="grid grid-rows-2 grid-flow-col gap-[1px]">
            {colorsPalette.map((color, i) => (
              <button
                key={`${color}-${i}`}
                onClick={() => { setFgColor(color); playSound("click"); }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setBgColor(color);
                  playSound("click");
                }}
                className="w-3.5 h-3.5 border border-gray-400 hover:scale-105 active:scale-95 cursor-pointer rounded-none"
                style={{ backgroundColor: color }}
                title={`Left click: Foreground, Right click: Background (${color})`}
              />
            ))}
          </div>
        </div>

        {/* 4. Status Bar (Tip, Cursor coordinate, selection coordinate) */}
        <div className="flex border-t border-[#808080] bg-[#c0c0c0] text-black text-[11px] h-[22px] items-center divide-x divide-[#808080] font-sans">
          {/* Section 1: Helpful Tip */}
          <div className="flex-1 px-2 select-none truncate">
            {isDrawing
              ? `Drawing with ${currentToolObj?.name || "Tool"}`
              : currentToolObj?.tooltip || "For Help, click Help Topics in the Help Menu."}
          </div>
          {/* Section 2: Drawing Dimensions (W x H) */}
          <div className="w-[100px] px-2 flex items-center gap-1 select-none">
            {selectionDims ? (
              <>
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-gray-700">
                  <rect x="2" y="2" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.5" />
                </svg>
                <span>{`${selectionDims.w} x ${selectionDims.h}`}</span>
              </>
            ) : (
              ""
            )}
          </div>
          {/* Section 3: Cursor Coordinates (X, Y) */}
          <div className="w-[100px] px-2 flex items-center gap-1 select-none">
            {cursorCoords ? (
              <>
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-gray-700">
                  <path d="M8 1v14M1 8h14" stroke="currentColor" fill="none" strokeWidth="1.5" />
                </svg>
                <span>{`${cursorCoords.x}, ${cursorCoords.y}`}</span>
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* 5. XP-Style About Paint Dialog Box */}
        {showAbout && (
          <div className="absolute inset-0 bg-black/15 z-[99] flex items-center justify-center">
            <div className="w-[340px] bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] shadow-2xl flex flex-col p-1 select-none">
              
              {/* Dialog Title Bar */}
              <div className="bg-gradient-to-r from-[#000080] to-[#1080d0] text-white px-2 py-0.5 flex justify-between items-center text-xs font-bold font-sans">
                <span>About Paint</span>
                <button
                  onClick={() => { setShowAbout(false); playSound("click"); }}
                  className="w-4 h-4 bg-[#c0c0c0] text-black text-xs font-bold border border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-inset flex items-center justify-center leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-4 flex gap-4 text-xs font-sans">
                <img src="paint.svg" alt="Paint Icon" className="w-12 h-12" />
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-sm">Microsoft Paint Clone</div>
                  <div>Version 5.1 (Build 2600.xpclient.010817-1148)</div>
                  <div>Copyright © 1981-2001 Microsoft Corporation.</div>
                  <div className="mt-2 text-[10px] text-gray-600 leading-normal">
                    This authentic Windows XP style MS Paint is fully responsive, supports undo/redo (Ctrl+Z), flood fill, spray can, shapes, custom canvas resizing, and custom file saving.
                  </div>
                </div>
              </div>

              {/* Dialog Close OK Button */}
              <div className="flex justify-end p-2 border-t border-[#808080]">
                <button
                  onClick={() => { setShowAbout(false); playSound("click"); }}
                  className="px-4 py-1 bg-[#c0c0c0] text-black text-xs border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white hover:bg-[#d8d8d8] cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}

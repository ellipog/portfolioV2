import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Window from "components/Window";
import { windows } from "data/windows";
import { playSound } from "utils/playSound";
import { Activity, Play, Plus, X } from "lucide-react";

interface TaskManagerProps {
  show: boolean;
  activeWindows: Record<string, boolean>;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  windowOrder: string[];
  bringToFront: () => void;
  isExplorerKilled?: boolean;
  setIsExplorerKilled?: Dispatch<SetStateAction<boolean>>;
}

interface ProcessItem {
  id: string;
  name: string;
  imageName: string;
  pid: number;
  cpu: number;
  memory: string;
  user: string;
  isWindow: boolean;
  windowKey?: string;
  isDummy?: boolean;
}

export default function TaskManager({
  show,
  activeWindows,
  setActiveWindows,
  windowOrder,
  bringToFront,
  isExplorerKilled = false,
  setIsExplorerKilled,
}: TaskManagerProps) {
  const windowConfig = windows.find((w) => w.title === "Task_Manager");

  const [activeTab, setActiveTab] = useState<"applications" | "processes" | "performance">("applications");
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  
  // Local state for terminated dummy processes
  const [terminatedDummies, setTerminatedDummies] = useState<string[]>([]);
  
  // Local state for New Task (Run...) dialog
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [runInput, setRunInput] = useState("");

  // Live dynamic system metrics
  const [currentCpu, setCurrentCpu] = useState(4);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(40).fill(4));
  const [memHistory, setMemHistory] = useState<number[]>(Array(40).fill(38));
  
  const cpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const memCanvasRef = useRef<HTMLCanvasElement>(null);

  // Periodic metrics updates
  useEffect(() => {
    const timer = setInterval(() => {
      // CPU fluctuates slightly
      const newCpu = Math.max(1, Math.min(99, Math.floor(currentCpu + (Math.random() * 6 - 3))));
      setCurrentCpu(newCpu);
      
      setCpuHistory((prev) => {
        const next = [...prev.slice(1), newCpu];
        return next;
      });

      // Memory fluctuates very slightly
      setMemHistory((prev) => {
        const lastVal = prev[prev.length - 1];
        const change = Math.random() * 2 - 1;
        const newVal = Math.max(30, Math.min(80, lastVal + change));
        return [...prev.slice(1), newVal];
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentCpu]);

  // Redraw charts when history updates or tab changes
  useEffect(() => {
    if (activeTab === "performance") {
      drawHistoryChart(cpuCanvasRef.current, cpuHistory, "#00ff00", "#003300");
      drawHistoryChart(memCanvasRef.current, memHistory, "#ff9900", "#331100");
    }
  }, [cpuHistory, memHistory, activeTab]);

  const drawHistoryChart = (
    canvas: HTMLCanvasElement | null,
    history: number[],
    lineColor: string,
    gridColor: string
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Dark solid background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridSpacing = 15;
    
    // Vertical grid lines
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Plot scrolling graph line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    history.forEach((val, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - (val / 100) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  // Define static process base config
  const defaultProcesses: ProcessItem[] = [
    { id: "explorer", name: "explorer.exe", imageName: "explorer.exe", pid: 1404, cpu: 1, memory: "22,816 K", user: "ELLIOT", isWindow: false },
    { id: "clippy", name: "clippy.exe", imageName: "clippy.exe", pid: 3204, cpu: 2, memory: "8,940 K", user: "ELLIOT", isWindow: false },
    { id: "Skills", name: "Skills", imageName: "skills.exe", pid: 2840, cpu: 0, memory: "14,512 K", user: "ELLIOT", isWindow: true, windowKey: "Skills" },
    { id: "Projects", name: "Projects", imageName: "projects.exe", pid: 2956, cpu: 0, memory: "28,940 K", user: "ELLIOT", isWindow: true, windowKey: "Projects" },
    { id: "Minesweeper", name: "Minesweeper", imageName: "minesweeper.exe", pid: 1044, cpu: 0, memory: "6,120 K", user: "ELLIOT", isWindow: true, windowKey: "Minesweeper" },
    { id: "Paint", name: "Paint", imageName: "paint.exe", pid: 3888, cpu: 0, memory: "11,244 K", user: "ELLIOT", isWindow: false, isDummy: true },
    { id: "Winamp", name: "Winamp", imageName: "winamp.exe", pid: 2112, cpu: 1, memory: "9,480 K", user: "ELLIOT", isWindow: false, isDummy: true },
    { id: "Internet Explorer", name: "Internet Explorer", imageName: "iexplore.exe", pid: 980, cpu: 0, memory: "32,108 K", user: "ELLIOT", isWindow: false, isDummy: true },
    { id: "Control Panel", name: "Control Panel", imageName: "control.exe", pid: 4012, cpu: 0, memory: "7,844 K", user: "ELLIOT", isWindow: false, isDummy: true },
  ];

  // Derive which processes are currently "alive" in the system
  const getActiveProcesses = (): ProcessItem[] => {
    return defaultProcesses.filter((proc) => {
      // 1. explorer.exe filter
      if (proc.id === "explorer" && isExplorerKilled) {
        return false;
      }
      
      // 2. clippy.exe filter
      if (proc.id === "clippy") {
        // If angry clippy is active or normal clippy is removed
        const clippyNormalRemoved = typeof document !== "undefined" && !document.querySelector(".clippy-normal");
        const angryActive = typeof window !== "undefined" && (window as any).showAngryClippy;
        if (clippyNormalRemoved && !angryActive) {
          return false;
        }
      }

      // 3. Window process filters (Skills, Projects, Minesweeper)
      if (proc.isWindow && proc.windowKey) {
        // Only show if the window is currently active/open
        return !!activeWindows[proc.windowKey];
      }

      // 4. Dummy process filters (Paint, Winamp, etc.)
      if (proc.isDummy) {
        return !terminatedDummies.includes(proc.id);
      }

      return true;
    });
  };

  const activeProcesses = getActiveProcesses();

  const handleEndProcess = (procId: string) => {
    playSound("click");
    
    // Find process item
    const proc = defaultProcesses.find((p) => p.id === procId);
    if (!proc) return;

    if (proc.id === "explorer") {
      // Call global killExplorer handler
      if (typeof window !== "undefined" && (window as any).killExplorer) {
        (window as any).killExplorer();
      }
      setIsExplorerKilled?.(true);
    } else if (proc.id === "clippy") {
      // Trigger clippy defense protocol
      if (typeof window !== "undefined" && (window as any).triggerClippyDefense) {
        (window as any).triggerClippyDefense();
      }
    } else if (proc.isWindow && proc.windowKey) {
      // Close window
      setActiveWindows((prev) => ({
        ...prev,
        [proc.windowKey!]: false,
      }));
    } else if (proc.isDummy) {
      // Terminate dummy process
      setTerminatedDummies((prev) => [...prev, proc.id]);
    }

    if (selectedRowId === procId) {
      setSelectedRowId(null);
    }
  };

  const handleRunNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runInput.trim()) return;

    const inputLower = runInput.trim().toLowerCase();
    playSound("click");

    if (inputLower === "explorer" || inputLower === "explorer.exe") {
      // Restore explorer
      if (typeof window !== "undefined" && (window as any).restoreExplorer) {
        (window as any).restoreExplorer();
      }
      setIsExplorerKilled?.(false);
    } else if (inputLower === "clippy" || inputLower === "clippy.exe") {
      // If Clippy was deleted, this can restore him or reset defense
      if (typeof window !== "undefined" && (window as any).restoreClippy) {
        (window as any).restoreClippy();
      }
    } else {
      // Check if it matches a window
      const matchWindow = defaultProcesses.find(
        (p) => p.isWindow && p.windowKey && p.windowKey.toLowerCase() === inputLower
      );
      if (matchWindow && matchWindow.windowKey) {
        setActiveWindows((prev) => ({
          ...prev,
          [matchWindow.windowKey!]: true,
        }));
        // Bring to front
        setTimeout(() => {
          const formattedTitle = matchWindow.windowKey!.replace(" ", "_");
          if (typeof window !== "undefined" && (window as any).bringWindowToFront) {
            (window as any).bringWindowToFront(formattedTitle);
          }
        }, 100);
      } else {
        // Check if it matches a terminated dummy process
        const matchDummy = defaultProcesses.find(
          (p) => p.isDummy && (p.id.toLowerCase() === inputLower || p.imageName.toLowerCase() === inputLower)
        );
        if (matchDummy) {
          setTerminatedDummies((prev) => prev.filter((d) => d !== matchDummy.id));
        }
      }
    }

    setRunInput("");
    setShowRunDialog(false);
  };

  return (
    <>
      <Window
        className={`${show ? "flex" : "hidden"}`}
        title="Task_Manager"
        icon="/taskmanager.ico"
        width={420}
        setActiveWindows={setActiveWindows}
        pos={windowConfig?.defaultPosition || { x: 120, y: 80 }}
        windowOrder={windowOrder}
        bringToFront={bringToFront}
      >
        <div className="flex flex-col h-full bg-[#f0f0ea] text-black select-none text-xs -m-4">
          {/* Menu bar */}
          <div className="flex gap-4 border-b border-gray-300 p-1 pl-2 text-[11px] font-sans">
            <div className="hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded cursor-pointer group relative">
              File
              <div className="hidden group-hover:block absolute left-0 top-5 bg-white border border-gray-400 text-black shadow-md z-50 w-32 py-1">
                <div
                  className="hover:bg-blue-600 hover:text-white px-3 py-1 text-left cursor-pointer"
                  onClick={() => {
                    playSound("click");
                    setShowRunDialog(true);
                  }}
                >
                  New Task (Run...)
                </div>
                <div className="border-t border-gray-300 my-1"></div>
                <div
                  className="hover:bg-blue-600 hover:text-white px-3 py-1 text-left cursor-pointer"
                  onClick={() => {
                    playSound("click");
                    setActiveWindows((prev) => ({ ...prev, Task_Manager: false }));
                  }}
                >
                  Exit Task Manager
                </div>
              </div>
            </div>
            <div className="hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded cursor-not-allowed">Options</div>
            <div className="hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded cursor-not-allowed">View</div>
            <div className="hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded cursor-not-allowed">Help</div>
          </div>

          {/* Main Tab Area */}
          <div className="flex-1 p-2 flex flex-col min-h-[320px]">
            {/* Tab Headers */}
            <div className="flex gap-0.5 border-b border-gray-300 pl-1">
              <button
                onClick={() => { playSound("click"); setActiveTab("applications"); }}
                className={`px-3 py-1 font-sans border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
                  activeTab === "applications"
                    ? "bg-[#f0f0ea] font-semibold border-b border-b-[#f0f0ea] -mb-[1px] pt-1.5"
                    : "bg-gray-200/80 hover:bg-gray-100"
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => { playSound("click"); setActiveTab("processes"); }}
                className={`px-3 py-1 font-sans border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
                  activeTab === "processes"
                    ? "bg-[#f0f0ea] font-semibold border-b border-b-[#f0f0ea] -mb-[1px] pt-1.5"
                    : "bg-gray-200/80 hover:bg-gray-100"
                }`}
              >
                Processes
              </button>
              <button
                onClick={() => { playSound("click"); setActiveTab("performance"); }}
                className={`px-3 py-1 font-sans border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
                  activeTab === "performance"
                    ? "bg-[#f0f0ea] font-semibold border-b border-b-[#f0f0ea] -mb-[1px] pt-1.5"
                    : "bg-gray-200/80 hover:bg-gray-100"
                }`}
              >
                Performance
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 bg-white border-l border-r border-b border-gray-300 p-2 flex flex-col overflow-hidden">
              {/* APPLICATIONS TAB */}
              {activeTab === "applications" && (
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                  <div className="flex-grow border border-gray-400 bg-white overflow-y-auto mb-2 winxp-scrollbar min-h-[200px]">
                    <table className="w-full text-left font-sans select-none border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 sticky top-0">
                          <th className="p-1 font-normal border-r border-gray-300 w-[60%]">Task</th>
                          <th className="p-1 font-normal border-r border-gray-300 w-[20%]">Status</th>
                          <th className="p-1 font-normal text-center w-[20%]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProcesses.map((proc) => {
                          const isSelected = selectedRowId === proc.id;
                          return (
                            <tr
                              key={proc.id}
                              onClick={() => setSelectedRowId(proc.id)}
                              className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${
                                isSelected ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                              }`}
                            >
                              <td className="p-1 border-r border-gray-100 flex items-center gap-1">
                                <img
                                  src={proc.isWindow ? `/${proc.windowKey?.toLowerCase()}.png` : `/${proc.imageName.replace(".exe", "")}.png`}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/folder.png";
                                  }}
                                  alt=""
                                  className="w-3.5 h-3.5 pointer-events-none"
                                />
                                <span className="truncate">{proc.name}</span>
                              </td>
                              <td className={`p-1 border-r border-gray-100 ${isSelected ? "text-white" : "text-green-700"}`}>
                                Running
                              </td>
                              <td className="p-1 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEndProcess(proc.id);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-sans border border-gray-400 cursor-pointer active:bg-gray-300 shadow-sm ${
                                    isSelected 
                                      ? "bg-red-700 text-white border-red-900 hover:bg-red-800" 
                                      : "bg-gray-200 text-black hover:bg-gray-300"
                                  }`}
                                >
                                  End Process
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 text-[11px] font-sans">
                    <button
                      onClick={() => {
                        playSound("click");
                        setShowRunDialog(true);
                      }}
                      className="px-4 py-1 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 border border-gray-400 rounded cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New Task...
                    </button>
                    <button
                      disabled={!selectedRowId}
                      onClick={() => selectedRowId && handleEndProcess(selectedRowId)}
                      className={`px-4 py-1 border border-gray-400 rounded shadow-sm ${
                        selectedRowId 
                          ? "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-black cursor-pointer" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      End Task
                    </button>
                  </div>
                </div>
              )}

              {/* PROCESSES TAB */}
              {activeTab === "processes" && (
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                  <div className="flex-grow border border-gray-400 bg-white overflow-y-auto mb-2 winxp-scrollbar min-h-[200px]">
                    <table className="w-full text-left font-sans select-none border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                          <th className="p-1 font-normal border-r border-gray-300">Image Name</th>
                          <th className="p-1 font-normal border-r border-gray-300 text-right">PID</th>
                          <th className="p-1 font-normal border-r border-gray-300 text-right">CPU</th>
                          <th className="p-1 font-normal border-r border-gray-300 text-right">Mem Usage</th>
                          <th className="p-1 font-normal border-r border-gray-300">User</th>
                          <th className="p-1 font-normal text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProcesses.map((proc) => {
                          const isSelected = selectedRowId === proc.id;
                          return (
                            <tr
                              key={proc.id}
                              onClick={() => setSelectedRowId(proc.id)}
                              className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${
                                isSelected ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                              }`}
                            >
                              <td className="p-1 border-r border-gray-100 font-semibold text-gray-800 truncate">
                                <span className={isSelected ? "text-white" : ""}>{proc.imageName}</span>
                              </td>
                              <td className="p-1 border-r border-gray-100 text-right">{proc.pid}</td>
                              <td className="p-1 border-r border-gray-100 text-right">
                                {proc.id === "clippy" || proc.id === "explorer" 
                                  ? String(Math.floor(Math.random() * 3 + 1)).padStart(2, "0") 
                                  : "00"}
                              </td>
                              <td className="p-1 border-r border-gray-100 text-right">{proc.memory}</td>
                              <td className="p-1 border-r border-gray-100 truncate">{proc.user}</td>
                              <td className="p-1 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEndProcess(proc.id);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-sans border border-gray-400 cursor-pointer active:bg-gray-300 shadow-sm ${
                                    isSelected 
                                      ? "bg-red-700 text-white border-red-900 hover:bg-red-800" 
                                      : "bg-gray-200 text-black hover:bg-gray-300"
                                  }`}
                                >
                                  End Process
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 text-[11px] font-sans">
                    <button
                      disabled={!selectedRowId}
                      onClick={() => selectedRowId && handleEndProcess(selectedRowId)}
                      className={`px-4 py-1 border border-gray-400 rounded shadow-sm ${
                        selectedRowId 
                          ? "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-black cursor-pointer" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      End Process
                    </button>
                  </div>
                </div>
              )}

              {/* PERFORMANCE TAB */}
              {activeTab === "performance" && (
                <div className="flex-grow flex flex-col h-full overflow-y-auto winxp-scrollbar p-1 text-black font-sans">
                  {/* CPU section */}
                  <div className="border border-gray-300 rounded p-2 bg-[#f0f0ea] mb-3">
                    <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                      <span>CPU Usage History</span>
                      <span className="text-green-700 bg-black/5 px-1 py-0.5 rounded font-mono">{currentCpu}%</span>
                    </div>
                    <div className="flex gap-2 h-20 items-stretch">
                      {/* Bar Graph */}
                      <div className="w-8 border border-gray-400 bg-[#0d1117] flex flex-col justify-end p-0.5 rounded shadow-inner">
                        <div 
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 transition-all duration-300 rounded-sm"
                          style={{ height: `${currentCpu}%` }}
                        />
                      </div>
                      {/* Canvas Scrolling Chart */}
                      <div className="flex-grow border border-gray-400 rounded overflow-hidden relative shadow-inner">
                        <canvas 
                          ref={cpuCanvasRef} 
                          width={240} 
                          height={78} 
                          className="w-full h-full block"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Memory Section */}
                  <div className="border border-gray-300 rounded p-2 bg-[#f0f0ea]">
                    <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                      <span>PF Usage History</span>
                      <span className="text-amber-700 bg-black/5 px-1 py-0.5 rounded font-mono">145MB</span>
                    </div>
                    <div className="flex gap-2 h-20 items-stretch">
                      {/* Bar Graph */}
                      <div className="w-8 border border-gray-400 bg-[#0d1117] flex flex-col justify-end p-0.5 rounded shadow-inner">
                        <div 
                          className="w-full bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-300 rounded-sm"
                          style={{ height: `38%` }}
                        />
                      </div>
                      {/* Canvas Scrolling Chart */}
                      <div className="flex-grow border border-gray-400 rounded overflow-hidden relative shadow-inner">
                        <canvas 
                          ref={memCanvasRef} 
                          width={240} 
                          height={78} 
                          className="w-full h-full block"
                        />
                      </div>
                    </div>
                  </div>

                  {/* System statistics mock grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                    <div className="border border-gray-300 p-1.5 rounded bg-white">
                      <div className="font-bold border-b border-gray-200 pb-0.5 mb-1">Totals</div>
                      <div className="flex justify-between"><span>Handles</span><span className="font-mono">8124</span></div>
                      <div className="flex justify-between"><span>Threads</span><span className="font-mono">312</span></div>
                      <div className="flex justify-between"><span>Processes</span><span className="font-mono">{activeProcesses.length}</span></div>
                    </div>
                    <div className="border border-gray-300 p-1.5 rounded bg-white">
                      <div className="font-bold border-b border-gray-200 pb-0.5 mb-1">Physical Memory (K)</div>
                      <div className="flex justify-between"><span>Total</span><span className="font-mono">2048512</span></div>
                      <div className="flex justify-between"><span>Available</span><span className="font-mono">1484124</span></div>
                      <div className="flex justify-between"><span>System Cache</span><span className="font-mono">428120</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-t border-gray-300 p-1 px-3 flex justify-between bg-[#f0f0ea] text-[10px] font-sans text-gray-600">
            <div className="border-r border-gray-300 pr-6">Processes: {activeProcesses.length}</div>
            <div className="border-r border-gray-300 pr-6">CPU Usage: {currentCpu}%</div>
            <div>Commit Charge: 145M / 2048M</div>
          </div>
        </div>
      </Window>

      {/* NEW TASK RUN DIALOG */}
      {showRunDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <div className="window w-80 shadow-2xl">
            {/* Header */}
            <div className="title-bar">
              <div className="title-bar-text flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Create New Task</span>
              </div>
              <div className="title-bar-controls">
                <button
                  aria-label="Close"
                  onClick={() => { playSound("click"); setShowRunDialog(false); }}
                />
              </div>
            </div>
 
            {/* Body */}
            <div className="window-body m-0 p-3 bg-[#f0f0ea]">
              <form onSubmit={handleRunNewTask}>
                <div className="flex gap-3 items-start mb-3">
                  <img src="/start_logo.png" alt="Run" className="w-8 h-8 select-none pointer-events-none" />
                  <div>
                    <p className="text-[11px] mb-2 font-sans">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
                    <div className="flex gap-2 items-center font-sans">
                      <span className="font-semibold">Open:</span>
                      <input
                        type="text"
                        value={runInput}
                        onChange={(e) => setRunInput(e.target.value)}
                        placeholder="e.g. paint.exe, explorer.exe, Skills"
                        className="flex-grow border border-gray-400 p-1 px-1.5 bg-white text-black outline-none font-mono focus:border-blue-500 text-[11px] select-text"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
 
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 font-sans mt-4">
                  <button
                    type="submit"
                    className="px-4 py-0.5 cursor-pointer"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound("click"); setShowRunDialog(false); }}
                    className="px-4 py-0.5 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

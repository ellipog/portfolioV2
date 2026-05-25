import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Window from "components/Window";
import { windows } from "data/windows";
import { playSound } from "utils/playSound";

interface ControlPanelProps {
  show: boolean;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  windowOrder: string[];
  bringToFront: () => void;
}

interface Wallpaper {
  id: string;
  name: string;
  url: string;
  bgColor: string;
}

export default function ControlPanel({
  show,
  setActiveWindows,
  windowOrder,
  bringToFront,
}: ControlPanelProps) {
  const windowConfig = windows.find((w) => w.title === "Control_Panel");

  const wallpapers: Wallpaper[] = [
    { id: "bliss", name: "Bliss", url: "/desktop_bg.png", bgColor: "#245edb" },
    { id: "autumn", name: "Autumn", url: "/autumn.jpg", bgColor: "#5c3317" },
    { id: "red_moon", name: "Red Moon Desert", url: "/red_moon_desert.jpg", bgColor: "#a52a2a" },
    { id: "follow", name: "Follow", url: "/follow.jpg", bgColor: "#4a6741" },
    { id: "classic_blue", name: "Windows Classic Blue", url: "", bgColor: "#3b6ea5" },
  ];

  // Temporary state (for live monitor preview and configuration)
  const [selectedWallpaperId, setSelectedWallpaperId] = useState("bliss");
  const [systemAlertsEnabled, setSystemAlertsEnabled] = useState(true);
  const [startupSoundsEnabled, setStartupSoundsEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(80);

  // Persistent/Applied state
  const [appliedWallpaperId, setAppliedWallpaperId] = useState("bliss");
  const [activeTab, setActiveTab] = useState<"desktop" | "sounds" | "about">("desktop");

  const currentWallpaper = wallpapers.find((w) => w.id === selectedWallpaperId) || wallpapers[0];

  // Sync component state with actual system state when window is shown
  useEffect(() => {
    if (show && typeof window !== "undefined") {
      if ((window as any).systemAlertsEnabled === undefined) {
        (window as any).systemAlertsEnabled = true;
      }
      if ((window as any).startupSoundsEnabled === undefined) {
        (window as any).startupSoundsEnabled = true;
      }
      if ((window as any).soundVolume === undefined) {
        (window as any).soundVolume = 80;
      }

      setSystemAlertsEnabled((window as any).systemAlertsEnabled);
      setStartupSoundsEnabled((window as any).startupSoundsEnabled);
      setSoundVolume((window as any).soundVolume);

      // Match selected wallpaper against global wallpaper variable or path
      const currentWallpaperUrl = (window as any).wallpaper || "/desktop_bg.png";
      const matched = wallpapers.find((w) => w.url === currentWallpaperUrl);
      if (matched) {
        setSelectedWallpaperId(matched.id);
        setAppliedWallpaperId(matched.id);
      }
    }
  }, [show]);

  // Handle Apply button
  const handleApply = () => {
    playSound("click");
    setAppliedWallpaperId(selectedWallpaperId);

    // Apply wallpaper changes globally
    const targetWp = wallpapers.find((w) => w.id === selectedWallpaperId);
    if (targetWp && typeof window !== "undefined") {
      (window as any).changeWallpaper?.(targetWp.id, targetWp.url, targetWp.bgColor);
      (window as any).wallpaper = targetWp.url;
    }

    // Apply sound options globally
    if (typeof window !== "undefined") {
      (window as any).systemAlertsEnabled = systemAlertsEnabled;
      (window as any).startupSoundsEnabled = startupSoundsEnabled;
      (window as any).soundVolume = soundVolume;
      (window as any).muteSystemSounds = !(systemAlertsEnabled || startupSoundsEnabled);
    }
  };

  // Handle OK button (Apply + Close)
  const handleOK = () => {
    handleApply();
    setActiveWindows((prev) => ({ ...prev, Control_Panel: false }));
  };

  // Handle Cancel button (Revert preview + Close)
  const handleCancel = () => {
    playSound("click");
    setSelectedWallpaperId(appliedWallpaperId);
    setActiveWindows((prev) => ({ ...prev, Control_Panel: false }));
  };

  // Handle Volume Change
  const handleVolumeChange = (value: number) => {
    setSoundVolume(value);
    if (typeof window !== "undefined") {
      (window as any).soundVolume = value;
    }
  };

  // Handle Alert Sound Switch
  const handleToggleSystemAlerts = (checked: boolean) => {
    playSound("click");
    setSystemAlertsEnabled(checked);
  };

  // Handle Startup/Logon Sound Switch
  const handleToggleStartupSounds = (checked: boolean) => {
    playSound("click");
    setStartupSoundsEnabled(checked);
  };

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title="Control_Panel"
      icon="/control_panel.svg"
      width={600}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 180, y: 110 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="flex flex-col bg-[#f0f0ea] text-black select-none text-xs -m-4">
        
        {/* Tab Headers */}
        <div className="flex gap-0.5 border-b border-gray-300 pl-2 pt-2 bg-[#f0f0ea] font-sans">
          <button
            onClick={() => { playSound("click"); setActiveTab("desktop"); }}
            className={`px-3 py-1.5 border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
              activeTab === "desktop"
                ? "bg-white font-semibold border-b border-b-white -mb-[1px] pt-2"
                : "bg-gray-200/80 hover:bg-gray-100"
            }`}
          >
            Display Properties
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("sounds"); }}
            className={`px-3 py-1.5 border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
              activeTab === "sounds"
                ? "bg-white font-semibold border-b border-b-white -mb-[1px] pt-2"
                : "bg-gray-200/80 hover:bg-gray-100"
            }`}
          >
            Sounds & Audio
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("about"); }}
            className={`px-3 py-1.5 border-t border-x border-gray-300 rounded-t cursor-pointer outline-none transition-all ${
              activeTab === "about"
                ? "bg-white font-semibold border-b border-b-white -mb-[1px] pt-2"
                : "bg-gray-200/80 hover:bg-gray-100"
            }`}
          >
            Display Info
          </button>
        </div>

        {/* Tab Body Panel */}
        <div className="flex-1 bg-white border-b border-gray-300 p-4 min-h-[340px] flex flex-col font-sans">
          
          {/* TAB: DESKTOP WALLPAPER */}
          {activeTab === "desktop" && (
            <div className="flex flex-col md:flex-row gap-5 flex-1">
              
              {/* Left Side: Monitor Preview */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 w-full md:w-48">
                <div className="w-44 h-32 bg-[#2a2a2e] border-[5px] border-gray-400 rounded-t-lg relative flex flex-col items-center justify-end shadow-md p-1">
                  
                  {/* Screen viewport */}
                  <div 
                    className="w-full flex-grow relative overflow-hidden flex flex-col justify-end border border-black rounded-sm"
                    style={{
                      backgroundImage: currentWallpaper.url ? `url(${currentWallpaper.url})` : "none",
                      backgroundColor: currentWallpaper.bgColor,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Simulated desktop items */}
                    <div className="absolute top-1 left-1 flex flex-col gap-0.5 scale-75 origin-top-left">
                      <div className="flex items-center gap-0.5 text-[5px] text-white">
                        <div className="w-1.5 h-1.5 bg-blue-500 border-[0.25px] border-white/50 rounded-sm"></div>
                        <span className="font-mono">My Computer</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[5px] text-white">
                        <div className="w-1.5 h-1.5 bg-green-500 border-[0.25px] border-white/50 rounded-sm"></div>
                        <span className="font-mono">Minesweeper</span>
                      </div>
                    </div>

                    {/* Simulated mini active taskbar */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between px-1 text-[3.5px] text-white/95 z-[1]">
                      <div className="bg-[#388e3c] border-[0.25px] border-white/30 px-0.5 h-[80%] flex items-center font-bold text-[3px] rounded-sm">
                        start
                      </div>
                      <span className="opacity-75 tracking-tighter">10:42 PM</span>
                    </div>
                  </div>
                  
                  {/* Monitor Stand */}
                  <div className="absolute top-full w-10 h-3.5 bg-gray-400 border-x border-b border-gray-500 flex justify-center">
                    <div className="w-16 h-1 bg-gray-500 mt-2.5 rounded-full shadow"></div>
                  </div>
                </div>
                <div className="mt-8 text-center text-[10px] text-gray-500 italic">
                  Monitor Preview (CRT SVGA)
                </div>
              </div>

              {/* Right Side: Visual Selection Grid */}
              <div className="flex-1 flex flex-col">
                <span className="text-[11px] font-semibold text-gray-700 mb-1.5">
                  Select a classic Windows XP background:
                </span>
                
                <div className="border border-gray-400 rounded bg-gray-100 p-2 overflow-y-auto max-h-[220px] winxp-scrollbar flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    {wallpapers.map((wp) => {
                      const isSelected = selectedWallpaperId === wp.id;
                      return (
                        <div
                          key={wp.id}
                          onClick={() => {
                            playSound("click");
                            setSelectedWallpaperId(wp.id);
                          }}
                          className={`flex flex-col p-1 border cursor-pointer rounded bg-white shadow-sm active:translate-y-[1px] transition-all duration-75 ${
                            isSelected
                              ? "border-blue-600 ring-2 ring-blue-400"
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/10"
                          }`}
                        >
                          <div
                            className="w-full h-14 rounded border border-gray-300 relative overflow-hidden"
                            style={{
                              backgroundImage: wp.url ? `url(${wp.url})` : "none",
                              backgroundColor: wp.bgColor,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!wp.url && (
                              <div className="absolute inset-0 flex items-center justify-center text-[9px] text-gray-500 font-bold bg-[#3b6ea5] text-white">
                                Classic Blue
                              </div>
                            )}
                          </div>
                          <div className="mt-1 text-center font-bold text-[9px] text-gray-800 truncate px-0.5">
                            {wp.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: SOUND SCHEMES */}
          {activeTab === "sounds" && (
            <div className="flex flex-col gap-4 flex-1">
              
              {/* Volume Slider Block */}
              <div className="border border-gray-300 rounded p-3 bg-gray-50/50 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
                  <span className="text-[12px] font-bold text-blue-900">Device Master Volume</span>
                </div>
                <div className="flex items-center gap-4 py-1">
                  <span className="text-xl select-none">🔊</span>
                  <div className="flex-grow flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] text-gray-400 px-0.5">
                      <span>Min</span>
                      <span>Max</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full cursor-pointer h-1 bg-gray-300 rounded-lg appearance-none accent-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="w-10 text-center font-mono text-[10px] font-bold text-gray-700 bg-white border border-gray-300 rounded py-0.5">
                    {soundVolume}%
                  </div>
                </div>
              </div>

              {/* Individual Sound Control Toggles */}
              <div className="border border-gray-300 rounded p-3 bg-gray-50/50 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
                  <span className="text-[12px] font-bold text-blue-900">Sound Event Scheme Toggles</span>
                </div>
                
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemAlertsEnabled}
                    onChange={(e) => handleToggleSystemAlerts(e.target.checked)}
                    className="mt-0.5 w-4 h-4 cursor-pointer accent-blue-600"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-[11px]">Enable System Alerts & UI Feedback</span>
                    <span className="text-[9px] text-gray-500 leading-tight">Mutes or unmutes error popups, system clicks, recycling trash animations, and alert beeps.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={startupSoundsEnabled}
                    onChange={(e) => handleToggleStartupSounds(e.target.checked)}
                    className="mt-0.5 w-4 h-4 cursor-pointer accent-blue-600"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-[11px]">Enable Windows XP Startup & Logon Chimes</span>
                    <span className="text-[9px] text-gray-500 leading-tight">Enables melodic chimes played during system boot up, logon chimes, and normal shutdowns.</span>
                  </div>
                </label>
              </div>

              {/* Sound Testing Buttons */}
              <div className="border border-gray-300 rounded p-2 bg-white shadow-sm flex flex-col gap-1.5">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Preview Sound Chimes:</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-800 font-medium font-sans">
                  <button 
                    onClick={() => playSound("startup")} 
                    className="flex items-center justify-between p-1 px-2.5 border border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/20 active:bg-blue-100 rounded text-left cursor-pointer transition-all duration-75 truncate"
                  >
                    <span>XP Startup Chime</span>
                    <span>▶️</span>
                  </button>
                  <button 
                    onClick={() => playSound("logon")} 
                    className="flex items-center justify-between p-1 px-2.5 border border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/20 active:bg-blue-100 rounded text-left cursor-pointer transition-all duration-75 truncate"
                  >
                    <span>XP Logon Chime</span>
                    <span>▶️</span>
                  </button>
                  <button 
                    onClick={() => playSound("shutdown")} 
                    className="flex items-center justify-between p-1 px-2.5 border border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/20 active:bg-blue-100 rounded text-left cursor-pointer transition-all duration-75 truncate"
                  >
                    <span>XP Shutdown Chime</span>
                    <span>▶️</span>
                  </button>
                  <button 
                    onClick={() => playSound("notify")} 
                    className="flex items-center justify-between p-1 px-2.5 border border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/20 active:bg-blue-100 rounded text-left cursor-pointer transition-all duration-75 truncate"
                  >
                    <span>Balloon Notification</span>
                    <span>▶️</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: ABOUT DISPLAY */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-blue-900 border-b border-gray-200 pb-1.5 text-[12px] uppercase tracking-wide">Monitor Hardware Information</h3>
              
              <div className="space-y-3 text-xs bg-gray-50 p-3.5 rounded border border-gray-300 shadow-sm font-sans">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500">Video Adapter:</span>
                  <span className="text-gray-800 font-bold">Retro SVGA Legacy Display Driver</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500">Resolution Mode:</span>
                  <span className="text-gray-800 font-bold">Responsive Centered Scaled Layout</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="font-semibold text-gray-500">Color Depth:</span>
                  <span className="text-gray-800 font-bold">True Color (32-bit pixel matrix)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Monitor Refresh Rate:</span>
                  <span className="text-gray-800 font-bold">60 Hz Responsive Animation Loop</span>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50/40 p-3 rounded text-[11px] text-blue-950 leading-relaxed shadow-sm font-sans">
                <strong className="text-blue-900">Responsive Viewport Protection</strong>: The windowing shell actively monitors screen boundaries (`window.innerWidth`, `window.innerHeight`) on initialization, scaling the UI container to fit mobile screens, tablet formats, and wide desktop displays without content clipping.
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="flex justify-end gap-2 p-3 bg-[#f0f0ea] border-t border-gray-300 font-sans">
          <button
            onClick={handleOK}
            className="px-5 py-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 active:bg-gray-400 rounded cursor-pointer shadow-sm text-[11px]"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-1 bg-gray-200 hover:bg-gray-300 border border-gray-400 active:bg-gray-400 rounded cursor-pointer shadow-sm text-[11px]"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={selectedWallpaperId === appliedWallpaperId && 
                      systemAlertsEnabled === (typeof window !== "undefined" ? (window as any).systemAlertsEnabled : true) &&
                      startupSoundsEnabled === (typeof window !== "undefined" ? (window as any).startupSoundsEnabled : true) &&
                      soundVolume === (typeof window !== "undefined" ? (window as any).soundVolume : 80)}
            className="px-5 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-400 active:bg-gray-400 rounded cursor-pointer shadow-sm text-[11px]"
          >
            Apply
          </button>
        </div>

      </div>
    </Window>
  );
}

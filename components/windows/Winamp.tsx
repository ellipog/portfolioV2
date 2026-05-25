import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Window from "components/Window";
import { windows } from "data/windows";
import { playSound } from "utils/playSound";

interface WinampProps {
  show: boolean;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  windowOrder: string[];
  bringToFront: () => void;
}

interface Track {
  id: number;
  title: string;
  url: string;
  duration: string; // MM:SS format
}

export default function Winamp({
  show,
  setActiveWindows,
  windowOrder,
  bringToFront,
}: WinampProps) {
  const windowConfig = windows.find((w) => w.title === "Winamp");

  const tracks: Track[] = [
    { id: 1, title: "Windows XP Startup Theme (8-bit)", url: "/audio/startup.wav", duration: "00:09" },
    { id: 2, title: "Windows XP Logon Chimes", url: "/audio/logon.wav", duration: "00:04" },
    { id: 3, title: "Windows XP Shutdown Song", url: "/audio/shutdown.wav", duration: "00:06" },
    { id: 4, title: "Clippy's Chimes & Alerts", url: "/audio/notify.wav", duration: "00:01" },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80); // 0-100
  const [balance, setBalance] = useState(0); // -100 to 100 (Stereo Balance)
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(9); // in seconds
  const [visualizerMode, setVisualizerMode] = useState<"oscilloscope" | "analyzer">("analyzer");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Initialize Audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume / 100;
      
      // Update duration when metadata loads
      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setTrackDuration(audioRef.current.duration || 10);
        }
      });

      // Handle time update
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      // Track end -> next track
      audioRef.current.addEventListener("ended", () => {
        handleNext();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrackIndex]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    playSound("click");
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Audio play error: ", err));
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    playSound("click");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    playSound("click");
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(wasPlaying);
    
    // Auto-play if previously playing
    if (wasPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => console.log("Play next error: ", err));
        }
      }, 150);
    }
  };

  const handlePrev = () => {
    playSound("click");
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(wasPlaying);
    
    // Auto-play if previously playing
    if (wasPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => console.log("Play prev error: ", err));
        }
      }, 150);
    }
  };

  // Adjust Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  // Adjust Position/Seek
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  // Render simulated Winamp equalizers / spectrums
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simulated analyzer peak levels
    const barsCount = 20;
    const barWidth = Math.floor(width / barsCount) - 1;
    const heights = Array(barsCount).fill(2);
    const peaks = Array(barsCount).fill(2);

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        if (visualizerMode === "analyzer") {
          // Analyzer Bars
          for (let i = 0; i < barsCount; i++) {
            // High frequency elements are shorter
            const multiplier = i < 5 ? 0.95 : i < 12 ? 0.75 : 0.45;
            const targetHeight = Math.random() * (height - 4) * multiplier + 1;
            
            // Smooth bars
            heights[i] += (targetHeight - heights[i]) * 0.45;

            // Decay peaks
            if (heights[i] > peaks[i]) {
              peaks[i] = heights[i];
            } else {
              peaks[i] = Math.max(0, peaks[i] - 0.5);
            }

            const x = i * (barWidth + 1);
            
            // Draw neon color gradient
            const grad = ctx.createLinearGradient(0, height, 0, 0);
            grad.addColorStop(0, "#00ff00"); // neon green
            grad.addColorStop(0.6, "#ffff00"); // yellow
            grad.addColorStop(1, "#ff0000"); // red

            ctx.fillStyle = grad;
            ctx.fillRect(x, height - heights[i], barWidth, heights[i]);

            // Draw peak dot
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, height - peaks[i] - 1, barWidth, 1);
          }
        } else {
          // Oscilloscope Mode (green wave line)
          ctx.strokeStyle = "#00ff33";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < width; i++) {
            const y = height / 2 + Math.sin(i * 0.15 + Date.now() * 0.02) * (height / 3.5) * (Math.random() * 0.3 + 0.7);
            if (i === 0) {
              ctx.moveTo(i, y);
            } else {
              ctx.lineTo(i, y);
            }
          }
          ctx.stroke();
        }
      } else {
        // Flatline / Idle state
        if (visualizerMode === "analyzer") {
          ctx.fillStyle = "#005500";
          for (let i = 0; i < barsCount; i++) {
            ctx.fillRect(i * (barWidth + 1), height - 2, barWidth, 2);
          }
        } else {
          ctx.strokeStyle = "#005511";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, visualizerMode]);

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Window
      className={`${show ? "flex" : "hidden"} border-2 border-[#121214]`}
      title="Winamp"
      icon="/winamp.png"
      width={380}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 260, y: 150 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="flex flex-col bg-[#1c1c1f] text-[#00e600] font-mono text-[11px] p-2 rounded select-none -m-4 border border-[#3a3a40]">
        
        {/* WINAMP HEADER / LOGO BAR */}
        <div className="flex justify-between items-center bg-gradient-to-r from-[#222] via-[#111] to-[#333] border-b border-[#3a3a40] pb-1.5 mb-2 -mx-2 px-2 text-[10px] text-gray-400">
          <span className="font-bold text-white tracking-widest text-[11px] flex items-center gap-1">
            <span className="text-[#ff9900]">⚡</span> WINAMP 2.81
          </span>
          <span className="text-[9px] text-[#00ff00]">CLONE EDITION</span>
        </div>

        {/* MAIN PANEL */}
        <div className="bg-[#121214] border border-[#2d2d33] rounded p-2 flex flex-col gap-2 shadow-inner">
          {/* TRACK TITLE DISPLAY */}
          <div className="bg-black/90 border border-[#2d2d33] p-1.5 rounded h-8 overflow-hidden relative flex items-center">
            <div className="absolute animate-marquee whitespace-nowrap text-[#00ff00] text-xs font-mono font-bold tracking-wider">
              {currentTrack.id}. {currentTrack.title} ({currentTrack.duration})
            </div>
          </div>

          {/* DISPLAY CONTROLS GRID */}
          <div className="grid grid-cols-12 gap-2 mt-1">
            {/* Retro LED Time & Visualizer */}
            <div className="col-span-8 bg-black border border-[#2d2d33] p-1.5 rounded flex flex-col justify-between h-16">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Time</span>
                {/* Simulated Stereo Indicators */}
                <div className="flex gap-1.5 text-[8px] text-gray-500 font-bold">
                  <span className={isPlaying ? "text-[#00ff00]" : ""}>O</span>
                  <span className={isPlaying ? "text-[#ff9900]" : ""}>K</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                {/* Big LED numbers */}
                <div className="text-xl font-bold font-mono text-[#00ff00] tracking-widest leading-none">
                  {formatTime(currentTime)}
                </div>
                {/* Track ID / Info */}
                <div className="text-[9px] text-gray-400 font-semibold">
                  {currentTrackIndex + 1}/{tracks.length}
                </div>
              </div>
            </div>

            {/* Simulated kbps / khz and Visualizer Select */}
            <div className="col-span-4 flex flex-col justify-between bg-black/60 border border-[#2d2d33] p-1 rounded h-16 text-[9px] text-gray-400 font-bold">
              <div className="flex flex-col gap-0.5">
                <div>KBPS: <span className="text-[#00ff00]">128</span></div>
                <div>KHZ: <span className="text-[#00ff00]">44</span></div>
              </div>
              <button
                onClick={() => {
                  playSound("click");
                  setVisualizerMode((prev) => (prev === "analyzer" ? "oscilloscope" : "analyzer"));
                }}
                className="w-full text-center bg-[#2d2d33] hover:bg-[#3d3d44] text-[#00ff00] py-0.5 rounded cursor-pointer border border-[#3e3e46]"
              >
                {visualizerMode === "analyzer" ? "ANALYZE" : "SCOPE"}
              </button>
            </div>
          </div>

          {/* VISUALIZER WAVE/SPECTRUM CANVAS */}
          <div className="border border-[#2d2d33] rounded overflow-hidden mt-1 bg-black h-12 relative shadow-inner">
            <canvas ref={canvasRef} width={340} height={48} className="w-full h-full block" />
          </div>

          {/* SLIDERS (VOLUME & SEEK) */}
          <div className="flex flex-col gap-1.5 mt-1 text-[9px]">
            {/* Seek/Track Progress Slider */}
            <div className="flex gap-2 items-center">
              <span className="text-gray-400 w-8 font-bold">SEEK:</span>
              <input
                type="range"
                min={0}
                max={trackDuration}
                value={currentTime}
                onChange={handleSeekChange}
                className="flex-grow h-1 bg-[#222] appearance-none rounded outline-none accent-[#00ff00] cursor-pointer"
              />
              <span className="text-gray-400 font-mono w-10 text-right">{formatTime(trackDuration)}</span>
            </div>

            {/* Volume & Balance Slider */}
            <div className="grid grid-cols-2 gap-3 mt-0.5">
              <div className="flex gap-1.5 items-center">
                <span className="text-gray-400 font-bold">VOL:</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-grow h-1 bg-[#222] appearance-none rounded outline-none accent-[#00ff00] cursor-pointer"
                />
                <span className="text-[#00ff00] w-6 text-right font-bold">{volume}%</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <span className="text-gray-400 font-bold">BAL:</span>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="flex-grow h-1 bg-[#222] appearance-none rounded outline-none accent-[#00ff00] cursor-pointer"
                />
                <span className="text-[#00ff00] w-8 text-right font-bold">
                  {balance === 0 ? "CTR" : balance < 0 ? `L${Math.abs(balance)}` : `R${balance}`}
                </span>
              </div>
            </div>
          </div>

          {/* MEDIA BUTTONS */}
          <div className="flex justify-between items-center gap-1.5 mt-2 pt-1 border-t border-[#222]">
            <button
              title="Previous Track"
              onClick={handlePrev}
              className="flex-1 bg-[#2d2d33] hover:bg-[#3d3d44] active:bg-[#1d1d22] text-white py-1 rounded font-bold cursor-pointer border border-[#3d3d46] text-shadow"
            >
              ⏮
            </button>
            <button
              title={isPlaying ? "Pause" : "Play"}
              onClick={handlePlayPause}
              className={`flex-1 ${
                isPlaying ? "bg-[#009900]/20 text-[#00ff00] border-[#00ff00]" : "bg-[#2d2d33] text-white border-[#3d3d46]"
              } hover:bg-[#3d3d44] active:bg-[#1d1d22] py-1 rounded font-bold cursor-pointer border text-shadow`}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              title="Stop"
              onClick={handleStop}
              className="flex-1 bg-[#2d2d33] hover:bg-[#3d3d44] active:bg-[#1d1d22] text-white py-1 rounded font-bold cursor-pointer border border-[#3d3d46] text-shadow"
            >
              ⏹
            </button>
            <button
              title="Next Track"
              onClick={handleNext}
              className="flex-1 bg-[#2d2d33] hover:bg-[#3d3d44] active:bg-[#1d1d22] text-white py-1 rounded font-bold cursor-pointer border border-[#3d3d46] text-shadow"
            >
              ⏭
            </button>
          </div>
        </div>

        {/* PLAYLIST WINDOW SCROLLBAR BOX */}
        <div className="bg-[#121214] border border-[#2d2d33] rounded mt-2 p-1.5 flex flex-col max-h-[110px] overflow-y-auto winxp-scrollbar">
          <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 border-b border-[#222] pb-0.5">Winamp Playlist</div>
          <div className="flex flex-col gap-0.5 text-[10px]">
            {tracks.map((track, index) => {
              const isCurrent = index === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    playSound("click");
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                    setTimeout(() => {
                      if (audioRef.current) {
                        audioRef.current.play().catch((err) => console.log("Playlist click play err: ", err));
                      }
                    }, 100);
                  }}
                  className={`flex justify-between items-center p-1 rounded cursor-pointer transition-colors ${
                    isCurrent 
                      ? "bg-[#00ff00]/15 text-[#00ff00] font-bold" 
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="truncate">
                    {index + 1}. {track.title}
                  </span>
                  <span className="font-mono text-[9px] opacity-75">{track.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Window>
  );
}

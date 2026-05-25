import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { windows, projects, workExperience, education, personal } from "data/windows";
import { playSound } from "utils/playSound";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  RotateCw, 
  Home, 
  Search, 
  Star, 
  Printer, 
  ChevronDown, 
  Globe, 
  Clock, 
  AlertCircle,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  User,
  Heart,
  ExternalLink
} from "lucide-react";

// Types for the Guestbook entries
interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  date: string;
}

export default function IEBrowser({
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
  const windowConfig = windows.find((w) => w.title === "Internet_Explorer");

  // Navigation stack state
  const [history, setHistory] = useState<string[]>(["http://www.msn.elliot"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const currentUrl = history[historyIndex] || "http://www.msn.elliot";
  
  // URL bar inputs
  const [urlInput, setUrlInput] = useState(currentUrl);
  
  // Loading states and status messages
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Done");
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Search query (within portal / Google)
  const [searchQuery, setSearchQuery] = useState("");
  
  // Guestbook states
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([
    {
      id: 1,
      name: "Clippy 📎",
      message: "It looks like you're building an incredible simulated browser! Need some help? This portfolio is absolutely gorgeous! Keep up the amazing work, Elliot!",
      date: "2026-05-19 14:32",
    },
    {
      id: 2,
      name: "Mom ❤️",
      message: "So proud of you, Elliot! This looks just like our old computer from 2002. You are so creative!",
      date: "2026-05-19 15:45",
    },
    {
      id: 3,
      name: "Linus Torvalds 🐧",
      message: "The code looks clean, and the bevels are pixel-perfect. But the real question is: Can it run Doom inside the browser frame? Great job on this retro masterpiece.",
      date: "2026-05-19 16:10",
    },
    {
      id: 4,
      name: "Bill Gates 💾",
      message: "Ah, Internet Explorer 6. It was the absolute pinnacle of our browser innovation! Thank you for bringing back these wonderful memories. The search portal is fantastic.",
      date: "2026-05-19 17:02",
    }
  ]);
  const [gbName, setGbName] = useState("");
  const [gbMessage, setGbMessage] = useState("");
  const [showGbSuccess, setShowGbSuccess] = useState(false);

  // Address list for dropdown
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const addressList = [
    "http://www.msn.elliot",
    "http://projects.elliot",
    "http://experience.elliot",
    "http://google.com"
  ];

  // Tracking visited URLs for retro purple link styles
  const [visitedUrls, setVisitedUrls] = useState<Set<string>>(new Set(["http://www.msn.elliot"]));

  // Update input box when URL changes
  useEffect(() => {
    setUrlInput(currentUrl);
    setVisitedUrls((prev) => {
      const next = new Set(prev);
      next.add(currentUrl);
      return next;
    });
  }, [currentUrl]);

  const navigateToRef = useRef<(targetUrl: string, skipHistory?: boolean) => void>(() => {});

  // Handle simulated page-load delays
  const navigateTo = (targetUrl: string, skipHistory = false) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "http://" + cleanUrl;
    }

    setLoading(true);
    playSound("click");
    setLoadingProgress(10);
    setStatusMessage("Finding site...");

    // Simulated multi-step XP load sequence
    setTimeout(() => {
      setLoadingProgress(45);
      setStatusMessage("Connecting to server...");
    }, 150);

    setTimeout(() => {
      setLoadingProgress(80);
      setStatusMessage("Downloading content...");
    }, 350);

    setTimeout(() => {
      setLoading(false);
      setLoadingProgress(100);
      setStatusMessage("Done");
      
      if (skipHistory) {
        // Just override current index in history
        setHistory((prev) => {
          const next = [...prev];
          next[historyIndex] = cleanUrl;
          return next;
        });
      } else {
        // Normal navigation: truncate any forward history
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, cleanUrl]);
        setHistoryIndex(newHistory.length);
      }
    }, 550);
  };

  navigateToRef.current = navigateTo;

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).navigateIE = (url: string) => {
        setActiveWindows((prev) => ({ ...prev, Internet_Explorer: true }));
        navigateToRef.current(url);
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).navigateIE;
      }
    };
  }, [setActiveWindows]);

  const handleBack = () => {
    if (historyIndex > 0) {
      playSound("click");
      setLoading(true);
      setLoadingProgress(20);
      setStatusMessage("Loading page from cache...");
      setTimeout(() => {
        setLoading(false);
        setHistoryIndex((prev) => prev - 1);
        setStatusMessage("Done");
      }, 200);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      playSound("click");
      setLoading(true);
      setLoadingProgress(20);
      setStatusMessage("Loading next page...");
      setTimeout(() => {
        setLoading(false);
        setHistoryIndex((prev) => prev + 1);
        setStatusMessage("Done");
      }, 200);
    }
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      navigateTo(urlInput);
    }
  };

  const handleHome = () => {
    navigateTo("http://www.msn.elliot");
  };

  const handleRefresh = () => {
    navigateTo(currentUrl, true);
  };

  const handleStop = () => {
    setLoading(false);
    setLoadingProgress(0);
    setStatusMessage("Stopped");
  };

  // Google Simulated Search logic
  const handleGoogleSearch = (e: React.FormEvent, queryText: string) => {
    e.preventDefault();
    if (queryText.trim()) {
      setSearchQuery(queryText);
      navigateTo(`http://google.com/search?q=${encodeURIComponent(queryText)}`);
    }
  };

  // Guestbook Submit
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now(),
      name: gbName.trim(),
      message: gbMessage.trim(),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setGuestbookEntries((prev) => [newEntry, ...prev]);
    setGbName("");
    setGbMessage("");
    setShowGbSuccess(true);
    playSound("notify");

    setTimeout(() => {
      setShowGbSuccess(false);
    }, 4000);
  };

  // External link intercepts to prompt the user
  const handleExternalLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const confirmLeave = window.confirm(
      `You are about to leave the simulated Windows XP environment to visit:\n${href}\n\nPress OK to open in a new browser tab, or Cancel to remain inside Internet Explorer 6.`
    );
    if (confirmLeave) {
      playSound("click");
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  // Parsing search queries in the URL bar
  const getSearchQueryFromUrl = (url: string) => {
    try {
      const u = new URL(url.replace("http://google.com", "https://google.com"));
      return decodeURIComponent(u.searchParams.get("q") || "");
    } catch {
      return "";
    }
  };

  // Check if a link has been visited
  const isVisited = (href: string) => {
    return visitedUrls.has(href);
  };

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title="Internet_Explorer"
      icon="/ie.svg"
      width={900}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 50, y: 50 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="-m-4 bg-[#ece9d8] flex flex-col h-[700px] select-none text-black font-tahoma overflow-hidden border-2 border-l-white border-t-white border-r-[#808080] border-b-[#808080]">
        
        {/* TOP MENU BAR */}
        <div className="flex justify-between items-center bg-[#ece9d8] border-b border-[#d8d4c4] px-1 py-0.5 text-xs text-black">
          <div className="flex gap-3">
            {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => (
              <button 
                key={m} 
                className="px-1.5 py-0.5 hover:bg-[#316ac5] hover:text-white rounded border border-transparent hover:border-[#1e4a9e] cursor-pointer"
                onClick={() => playSound("click")}
              >
                {m}
              </button>
            ))}
          </div>
          
          {/* Animated Spinner in the right-hand corner */}
          <div className="mr-2 flex items-center justify-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-md border border-[#808080] bg-[#ffffff] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]`}>
              <img 
                src="/ie.svg" 
                alt="Throbber" 
                className={`w-6 h-6 select-none ${loading ? "animate-spin" : ""}`}
                style={{ animationDuration: "1.5s" }}
              />
            </div>
          </div>
        </div>

        {/* NAVIGATION BUTTONS BAR */}
        <div className="flex items-center gap-1 bg-[#ece9d8] border-b border-[#d8d4c4] p-1 text-xs">
          
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={`flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer ${
              historyIndex === 0 
                ? "opacity-40 cursor-default" 
                : "hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-[#4abf64] flex items-center justify-center text-white font-bold text-shadow shadow-[1px_1px_2px_rgba(0,0,0,0.3)] ${historyIndex === 0 ? "bg-gray-400" : ""}`}>
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-bold text-[11px] text-gray-700">Back</span>
            <ChevronDown className="w-2.5 h-2.5 -ml-1 text-gray-500" />
          </button>

          {/* Forward button */}
          <button
            onClick={handleForward}
            disabled={historyIndex === history.length - 1}
            className={`flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer ${
              historyIndex === history.length - 1 
                ? "opacity-40 cursor-default" 
                : "hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-[#3d7ade] flex items-center justify-center text-white font-bold text-shadow shadow-[1px_1px_2px_rgba(0,0,0,0.3)] ${historyIndex === history.length - 1 ? "bg-gray-400" : ""}`}>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-bold text-[11px] text-gray-700">Forward</span>
            <ChevronDown className="w-2.5 h-2.5 -ml-1 text-gray-500" />
          </button>

          <span className="h-6 w-[1px] bg-gray-400 mx-1" />

          {/* Stop */}
          <button
            onClick={handleStop}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <X className="w-4 h-4 text-red-600 stroke-[2.5]" />
            <span className="text-[9px] text-gray-700">Stop</span>
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <RotateCw className="w-4 h-4 text-[#3d7ade] stroke-[2.5]" />
            <span className="text-[9px] text-gray-700">Refresh</span>
          </button>

          {/* Home */}
          <button
            onClick={handleHome}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <Home className="w-4 h-4 text-[#a06020]" />
            <span className="text-[9px] text-gray-700">Home</span>
          </button>

          <span className="h-6 w-[1px] bg-gray-400 mx-1" />

          {/* Search */}
          <button
            onClick={() => navigateTo("http://google.com")}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <Search className="w-4 h-4 text-[#d19121]" />
            <span className="text-[9px] text-gray-700">Search</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => playSound("click")}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <Star className="w-4 h-4 text-[#fcd116] fill-[#fcd116]" />
            <span className="text-[9px] text-gray-700">Favorites</span>
          </button>

          {/* History */}
          <button
            onClick={() => playSound("click")}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <Clock className="w-4 h-4 text-[#4abf64]" />
            <span className="text-[9px] text-gray-700">History</span>
          </button>

          <span className="h-6 w-[1px] bg-gray-400 mx-1" />

          {/* Print */}
          <button
            onClick={() => {
              playSound("notify");
              window.print();
            }}
            className="flex flex-col items-center justify-center w-9 h-9 rounded hover:bg-[#ffffff] hover:shadow-[1px_1px_0px_white_inset,-1px_-1px_1px_#808080] active:shadow-[-1px_-1px_0px_white_inset,1px_1px_1px_#808080]"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span className="text-[9px] text-gray-700">Print</span>
          </button>
        </div>

        {/* ADDRESS BAR ROW */}
        <div className="flex items-center gap-1 bg-[#ece9d8] border-b-2 border-[#b0ac9c] p-1 text-xs">
          <span className="text-gray-500 font-sans px-1 text-[11px]">Address</span>
          
          <form onSubmit={handleGo} className="flex-1 flex relative">
            <div className="flex-1 flex bg-white border border-[#7f9db9] rounded-sm shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] px-1 py-0.5 items-center">
              <img src="/ie.svg" alt="IE Icon" className="w-3.5 h-3.5 mr-1" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-tahoma text-[12px] text-black h-4 px-0.5 select-text"
              />
              <button
                type="button"
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="p-0.5 text-gray-600 hover:bg-gray-200 cursor-pointer rounded-sm"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Address Bar Dropdown List */}
            {showAddressDropdown && (
              <div className="absolute top-6 left-0 right-0 bg-white border border-gray-400 z-50 shadow-md">
                {addressList.map((addr) => (
                  <button
                    key={addr}
                    type="button"
                    onClick={() => {
                      setShowAddressDropdown(false);
                      navigateTo(addr);
                    }}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-[#316ac5] hover:text-white flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <img src="/ie.svg" alt="" className="w-3 h-3" />
                    {addr}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="ml-1 bg-gradient-to-r from-[#fefeff] to-[#dedede] hover:bg-[#ffffff] border border-[#a0a0a0] rounded-sm px-2 py-0.5 font-sans font-semibold text-[11px] hover:border-gray-600 cursor-pointer flex items-center gap-1 active:bg-gray-200 shadow-sm"
            >
              <span className="text-[#008000] font-bold">➔</span> Go
            </button>
          </form>
        </div>

        {/* INNER BROWSER DISPLAY PORTAL */}
        <div className="flex-1 bg-white overflow-y-auto text-black relative select-text border border-[#808080] winxp-scrollbar">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-40 select-none">
              <img src="/ie.svg" alt="Loading" className="w-16 h-16 animate-bounce" />
              <p className="mt-2 text-sm font-semibold text-gray-700 animate-pulse font-sans">
                Connecting to {currentUrl.replace("http://", "")}...
              </p>
            </div>
          )}

          <div className="h-full w-full">
            {/* 1. HOMEPAGE: MSN PORTAL */}
            {(currentUrl === "http://www.msn.elliot" || currentUrl === "http://msn.elliot" || currentUrl === "http://www.msn.com") && (
              <div className="bg-blue-50/20 min-h-full font-sans text-start">
                
                {/* MSN Header */}
                <div className="bg-gradient-to-r from-blue-700 to-sky-500 text-white p-3 border-b border-blue-900 shadow-sm">
                  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                    
                    {/* Retro Butterfly Logo */}
                    <div className="flex items-center gap-2">
                      <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
                        {/* Custom SVG MSN Butterfly */}
                        <path d="M12 2C12 2 13 8 16 9C19 10 23 7 23 7C23 7 21 12 17 13C13 14 12 11 12 11Z" fill="#ffc83c" />
                        <path d="M12 2C12 2 11 8 8 9C5 10 1 7 1 7C1 7 3 12 7 13C11 14 12 11 12 11Z" fill="#e12c1c" />
                        <path d="M12 22C12 22 13 16 17 15C21 14 22 18 22 18C22 18 19 17 16 16C13 15 12 22 12 22Z" fill="#009cff" />
                        <path d="M12 22C12 22 11 16 7 15C3 14 2 18 2 18C2 18 5 17 8 16C11 15 12 22 12 22Z" fill="#38af38" />
                        <circle cx="12" cy="10" r="1.5" fill="#555" />
                      </svg>
                      <div>
                        <h1 className="text-3xl font-extrabold tracking-tight font-sans text-shadow flex items-center">
                          msn<span className="text-yellow-300 font-light text-xl ml-1">Strand</span>
                        </h1>
                        <p className="text-[10px] text-blue-100 font-mono -mt-1">The Nostalgic Web Portal</p>
                      </div>
                    </div>

                    {/* MSN Internal Search bar */}
                    <form onSubmit={(e) => handleGoogleSearch(e, searchQuery)} className="flex items-center w-full max-w-sm">
                      <input
                        type="text"
                        placeholder="Search Elliot's Web..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-white text-black border-2 border-yellow-400 rounded-l-md px-2 py-1 text-xs font-sans outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-blue-900 border-2 border-l-0 border-yellow-400 rounded-r-md px-3 py-1 text-xs font-bold cursor-pointer"
                      >
                        Search
                      </button>
                    </form>
                    
                    {/* Mini Weather */}
                    <div className="hidden md:flex flex-col text-right text-xs">
                      <span className="font-bold text-yellow-200">⛅ Oslo, Norway</span>
                      <span className="text-[10px]">14°C — Rainy & Nostalgic</span>
                    </div>

                  </div>
                </div>

                {/* Sub-Header bar */}
                <div className="bg-[#ece9d8] border-b border-gray-300 px-4 py-1.5 text-xs text-gray-700 flex justify-between font-sans">
                  <div className="flex gap-4">
                    <span className="font-bold text-blue-800">MSN Channels:</span>
                    <button onClick={() => navigateTo("http://projects.elliot")} className={`hover:underline ${isVisited("http://projects.elliot") ? "text-purple-800" : "text-blue-600"}`}>📂 Projects</button>
                    <button onClick={() => navigateTo("http://experience.elliot")} className={`hover:underline ${isVisited("http://experience.elliot") ? "text-purple-800" : "text-blue-600"}`}>💼 Work & Education</button>
                  </div>
                  <div className="font-mono text-[10px]">
                    Today is: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
                  
                  {/* Left Sidebar Menu */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border-2 border-[#b0ac9c] rounded p-3 shadow-sm">
                      <h2 className="text-xs font-bold bg-[#f1efe2] border-b border-gray-300 p-1 mb-2 text-blue-900 flex items-center gap-1 font-sans">
                        <Globe className="w-3.5 h-3.5" /> ELLIOT'S WEB INDEX
                      </h2>
                      <div className="flex flex-col gap-2 text-xs font-sans">
                        <button onClick={() => navigateTo("http://projects.elliot")} className="text-left py-1 px-1.5 hover:bg-blue-100 hover:text-blue-800 rounded text-gray-700 flex items-center gap-1.5 cursor-pointer">
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                          <span>Projects Catalog</span>
                        </button>
                        <button onClick={() => navigateTo("http://experience.elliot")} className="text-left py-1 px-1.5 hover:bg-blue-100 hover:text-blue-800 rounded text-gray-700 flex items-center gap-1.5 cursor-pointer">
                          <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                          <span>Work & Career</span>
                        </button>
                      </div>
                    </div>

                    {/* Nostalgic hit counter */}
                    <div className="bg-black text-green-500 border border-gray-600 rounded p-2 text-center font-mono">
                      <div className="text-[10px] text-gray-400">YOUR VISITOR NUMBER:</div>
                      <div className="text-xl font-bold tracking-widest bg-gray-950 px-2 py-0.5 inline-block border border-gray-800 text-shadow-glow">
                        002,481,102
                      </div>
                      <div className="text-[9px] text-gray-500 mt-1">Established June 2002</div>
                    </div>

                    {/* MSN Messenger Widget */}
                    <div className="bg-white border-2 border-[#b0ac9c] rounded shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-[11px] px-2 py-1 flex justify-between items-center">
                        <span>MSN Messenger 6.0</span>
                        <span className="w-2.5 h-2.5 bg-green-400 border border-white rounded-full"></span>
                      </div>
                      <div className="p-2 space-y-2 text-xs font-sans bg-sky-50/20">
                        <div className="text-gray-500 font-bold text-[10px] border-b pb-0.5">Online Contacts (3)</div>
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <img src="/elliot.jpg" alt="" className="w-5 h-5 rounded-full border border-gray-300" />
                          <div className="leading-tight">
                            <div className="font-bold">Elliot S. (Online)</div>
                            <div className="text-[9px] text-gray-500">"Coding the retro XP portfolio..."</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[10px] text-blue-600 border border-blue-200">📎</div>
                          <div className="leading-tight">
                            <div className="font-bold">Clippy (Idle)</div>
                            <div className="text-[9px] text-gray-500">"Always ready to assist!"</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[10px] text-purple-600 border border-purple-200">🐵</div>
                          <div className="leading-tight">
                            <div className="font-bold">BonziBUDDY (Busy)</div>
                            <div className="text-[9px] text-gray-500">"Singing bicycle built for two."</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Middle Content */}
                  <div className="lg:col-span-2 space-y-4">
                    
                    {/* Nostalgic Flashing Banner Ad */}
                    <div className="bg-[#fff9d7] border-2 border-yellow-500 rounded p-2.5 text-center shadow-sm relative overflow-hidden select-none">
                      <div className="absolute top-0 right-0 bg-red-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-bl">
                        ADVERTISEMENT
                      </div>
                      <h3 className="text-red-600 font-extrabold text-sm animate-pulse tracking-wide font-sans">
                        🔥 CONGRATULATIONS! You are the 1,000,000th visitor! 🔥
                      </h3>
                      <p className="text-xs text-blue-900 mt-1 font-semibold">
                        Click here to win a <span className="underline text-red-500">Free Apple iPod Nano (4GB)</span> and download <span className="underline text-blue-600">Free Screensavers</span>!
                      </p>
                      <button 
                        onClick={() => {
                          playSound("error");
                          alert("Clippy says: Nice try! But this is a simulated nostalgic advertisement. No malware here!");
                        }}
                        className="mt-2 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full border border-red-700 shadow-md cursor-pointer animate-bounce"
                      >
                        Claim My Free iPod Now! ➜
                      </button>
                    </div>

                    {/* Interactive Guestbook Widget */}
                    <div className="bg-white border-2 border-yellow-600 rounded p-4 shadow-sm">
                      <div className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-bold text-xs -mx-4 -mt-4 px-4 py-1.5 rounded-t flex items-center gap-1 font-sans">
                        <MessageSquare className="w-4 h-4" /> Nostalgic Guestbook Registry
                      </div>
                      
                      {/* Submit form */}
                      <form onSubmit={handleGuestbookSubmit} className="mt-3 space-y-2.5 text-xs font-sans border-b-2 border-dashed border-gray-300 pb-3">
                        <div className="text-gray-600 font-semibold text-[11px]">Leave your mark in Elliot's simulated guestbook!</div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <label className="block text-gray-500 mb-0.5">Your Name:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="CoolCoder2000"
                              value={gbName}
                              onChange={(e) => setGbName(e.target.value)}
                              className="w-full bg-white border border-gray-400 rounded px-1.5 py-1 outline-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-gray-500 mb-0.5">Your Message:</label>
                            <input 
                              type="text" 
                              required
                              placeholder="This site rules! A++"
                              value={gbMessage}
                              onChange={(e) => setGbMessage(e.target.value)}
                              className="w-full bg-white border border-gray-400 rounded px-1.5 py-1 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          {showGbSuccess && (
                            <span className="text-green-600 font-bold animate-pulse text-[11px]">✓ Guestbook entry added successfully!</span>
                          )}
                          <button
                            type="submit"
                            className="ml-auto bg-gradient-to-b from-[#ffcf66] to-[#f49e00] hover:from-yellow-400 hover:to-amber-500 text-white border border-amber-600 rounded px-3 py-1.5 font-bold shadow-sm cursor-pointer active:scale-95"
                          >
                            ✏ Sign My Guestbook
                          </button>
                        </div>
                      </form>

                      {/* Entries Scroll Box */}
                      <div className="mt-3 max-h-40 overflow-y-auto space-y-2.5 pr-1 font-sans text-xs bg-yellow-50/10 p-1 winxp-scrollbar">
                        {guestbookEntries.map((e) => (
                          <div key={e.id} className="bg-[#fffdf2] border border-yellow-200 rounded p-2 text-start relative shadow-sm">
                            <span className="absolute top-1 right-2 text-[9px] text-gray-400 font-mono">{e.date}</span>
                            <span className="font-bold text-blue-900 flex items-center gap-1">
                              💬 {e.name}
                            </span>
                            <p className="text-gray-700 mt-1 italic text-[11px] leading-relaxed">
                              "{e.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="lg:col-span-1 space-y-4">
                    
                    {/* Profile User Card */}
                    <div className="bg-white border-2 border-[#b0ac9c] rounded p-3 shadow-sm text-center">
                      <h2 className="text-xs font-bold bg-[#f1efe2] border-b border-gray-300 p-1 mb-2 text-blue-900 font-sans">
                        DEVELOPER PROFILE
                      </h2>
                      <div className="flex flex-col items-center">
                        <img 
                          src="/elliot.jpg" 
                          alt="Elliot strand Aaen" 
                          className="w-24 h-24 rounded border-2 border-white shadow-md object-cover"
                        />
                        <h3 className="font-bold text-sm text-blue-900 mt-2 font-sans">{personal.name}</h3>
                        <p className="text-[10px] text-gray-500 leading-tight">{personal.profession}</p>
                        
                        <div className="w-full border-t border-gray-200 my-2.5"></div>
                        
                        <div className="text-left w-full text-[11px] space-y-1.5 font-sans text-gray-700">
                          <div><strong>Location:</strong> Oslo, Norway 🇳🇴</div>
                          <div><strong>Status:</strong> Coding retro websites 🚀</div>
                          <div><strong>Interests:</strong> Web Design, Game Dev, UX</div>
                        </div>

                        <div className="w-full border-t border-gray-200 my-2.5"></div>

                        {/* Social Buttons */}
                        <div className="flex flex-col gap-1.5 w-full text-xs font-sans">
                          <a 
                            href={personal.linkedin} 
                            onClick={(e) => handleExternalLink(e, personal.linkedin)}
                            className="bg-[#0077b5] text-white py-1 px-2 rounded hover:opacity-95 flex items-center justify-center gap-1 font-bold shadow-sm"
                          >
                            <img src="/linkedin.png" alt="" className="w-3.5 h-3.5 invert brightness-0" />
                            LinkedIn 🌐
                          </a>
                          <a 
                            href="https://github.com/Ellipog" 
                            onClick={(e) => handleExternalLink(e, "https://github.com/Ellipog")}
                            className="bg-[#24292e] text-white py-1 px-2 rounded hover:opacity-95 flex items-center justify-center gap-1 font-bold shadow-sm"
                          >
                            <img src="/github.png" alt="" className="w-3.5 h-3.5 invert brightness-0" />
                            GitHub 📁
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Classic 88x31 Badges */}
                    <div className="bg-[#ece9d8] border border-gray-300 rounded p-2.5 text-center space-y-2 select-none">
                      <div className="text-[9px] text-gray-500 font-bold font-mono">BADGES:</div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {/* CSS Styled Nostalgic 88x31 Buttons */}
                        <div className="w-[88px] h-[31px] bg-gradient-to-r from-blue-700 to-sky-500 border border-blue-900 text-white font-extrabold text-[9px] flex flex-col justify-center leading-tight shadow-sm cursor-pointer select-none" onClick={() => playSound("notify")}>
                          <div>IE 6.0</div>
                          <div className="text-[7px] text-yellow-300 font-light font-mono">BEST VIEWED</div>
                        </div>
                        <div className="w-[88px] h-[31px] bg-gradient-to-r from-green-600 to-[#38af38] border border-green-800 text-white font-black text-[9px] flex flex-col justify-center leading-tight shadow-sm cursor-pointer select-none" onClick={() => playSound("notify")}>
                          <div>WINDOWS XP</div>
                          <div className="text-[7px] text-green-100 font-normal">COMPATIBLE</div>
                        </div>
                        <div className="w-[88px] h-[31px] bg-gradient-to-r from-red-600 to-orange-500 border border-red-800 text-white font-bold text-[9px] flex flex-col justify-center leading-tight shadow-sm cursor-pointer select-none" onClick={() => playSound("notify")}>
                          <div>MADE WITH</div>
                          <div className="text-[7px] text-yellow-100 font-mono font-bold">♥ REACT ♥</div>
                        </div>
                        <div className="w-[88px] h-[31px] bg-gradient-to-r from-purple-800 to-indigo-600 border border-purple-900 text-white font-bold text-[9px] flex flex-col justify-center leading-tight shadow-sm cursor-pointer select-none" onClick={() => playSound("notify")}>
                          <div>RETRO DEVS</div>
                          <div className="text-[6px] text-purple-200 font-mono">HAND CRAFTED</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="bg-[#ece9d8] border-t border-gray-300 p-4 text-center text-xs text-gray-600 font-sans mt-4">
                  <p>© 2002-2026 Elliot Strand Aaen Portal. All rights reserved.</p>
                  <p className="text-[10px] text-gray-500 mt-1">Microsoft Internet Explorer 6.0 simulation. Optimized for 800x600 resolution and 16-bit colors.</p>
                </div>
              </div>
            )}

            {/* 2. INNER PAGE: PROJECTS INDEX */}
            {currentUrl.startsWith("http://projects.elliot") && (
              <div className="p-5 font-mono text-xs text-start bg-white min-h-full">
                <h1 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-2 flex items-center justify-between font-sans">
                  <span>📂 Index of /projects</span>
                  <button 
                    onClick={() => navigateTo("http://www.msn.elliot")}
                    className="text-xs text-blue-500 hover:underline font-normal cursor-pointer font-sans"
                  >
                    [Back to Home]
                  </button>
                </h1>
                
                <p className="my-2.5 text-gray-500 font-sans">Select a project link to view details or click on its source/live links directly.</p>

                {/* Database Table layout */}
                <div className="overflow-x-auto border border-gray-400 mt-4 shadow-sm">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-[#ece9d8] border-b border-gray-400 text-gray-700 font-bold">
                        <th className="p-2 border-r border-gray-300">Name</th>
                        <th className="p-2 border-r border-gray-300">Year</th>
                        <th className="p-2 border-r border-gray-300">Primary Languages</th>
                        <th className="p-2 border-r border-gray-300">Description</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.projects.map((proj) => (
                        <tr key={proj.name} className="border-b border-gray-200 hover:bg-sky-50/50">
                          <td className="p-2 border-r border-gray-300 font-bold text-blue-700">
                            <span className="flex items-center gap-1.5">
                              📄 {proj.name}
                            </span>
                          </td>
                          <td className="p-2 border-r border-gray-300 text-gray-500 font-mono">{proj.year}</td>
                          <td className="p-2 border-r border-gray-300 font-mono">
                            <div className="flex flex-wrap gap-1">
                              {proj.languages.map((l) => (
                                <span key={l} className="text-[10px] bg-gray-100 border border-gray-300 rounded px-1 text-gray-700">{l}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 border-r border-gray-300 text-gray-600 leading-relaxed text-[11px] whitespace-pre-line">{proj.description}</td>
                          <td className="p-2 text-center">
                            <a 
                              href={proj.link}
                              onClick={(e) => handleExternalLink(e, proj.link)}
                              className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1"
                            >
                              Visit Page <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200 text-center font-sans text-[10px] text-gray-500">
                  <p>Apache/1.3.27 Server at projects.elliot Port 80</p>
                </div>
              </div>
            )}

            {/* 3. INNER PAGE: SKILLS (removed — 404) */}
            {currentUrl.startsWith("http://skills.elliot") && (
              <div className="p-8 font-sans text-xs text-start bg-white min-h-full max-w-2xl mx-auto">
                <div className="border-2 border-gray-400 bg-[#ffffcc] p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                    <div>
                      <h1 className="text-lg font-bold text-red-700 mb-2">The page cannot be displayed</h1>
                      <p className="text-gray-800 mb-3 leading-relaxed">
                        Internet Explorer cannot display the webpage you are trying to access. The URL might be incorrect, or the page may have been moved or removed from this simulated portal.
                      </p>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
                        <li>Try checking the connection to your simulated network.</li>
                        <li>Click the <strong>Refresh</strong> button to try again.</li>
                        <li>Open the desktop <strong>Skills</strong> window for Elliot&apos;s tech stack.</li>
                      </ul>
                      <p className="text-gray-500 font-mono text-[10px] mb-4">HTTP 404 — Not Found — skills.elliot</p>
                      <button
                        onClick={() => navigateTo("http://www.msn.elliot")}
                        className="text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Return to MSN Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. INNER PAGE: ABOUT (removed — 404) */}
            {currentUrl.startsWith("http://about.elliot") && (
              <div className="p-8 font-sans text-xs text-start bg-white min-h-full max-w-2xl mx-auto">
                <div className="border-2 border-gray-400 bg-[#ffffcc] p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                    <div>
                      <h1 className="text-lg font-bold text-red-700 mb-2">The page cannot be displayed</h1>
                      <p className="text-gray-800 mb-3 leading-relaxed">
                        This biography page has been removed from the MSN portal. Work history and education are available on the Work &amp; Education channel instead.
                      </p>
                      <p className="text-gray-500 font-mono text-[10px] mb-4">HTTP 404 — Not Found — about.elliot</p>
                      <button
                        onClick={() => navigateTo("http://experience.elliot")}
                        className="text-blue-700 font-bold hover:underline cursor-pointer mr-4"
                      >
                        Open Work &amp; Education
                      </button>
                      <button
                        onClick={() => navigateTo("http://www.msn.elliot")}
                        className="text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Return to MSN Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. INNER PAGE: WORK EXPERIENCE & EDUCATION */}
            {currentUrl.startsWith("http://experience.elliot") && (
              <div className="p-6 font-sans text-start bg-white min-h-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-5">
                  <h1 className="text-xl font-bold text-blue-900 flex items-center gap-1.5">
                    💼 Career & Education Timeline
                  </h1>
                  <button 
                    onClick={() => navigateTo("http://www.msn.elliot")}
                    className="text-xs text-blue-500 hover:underline cursor-pointer"
                  >
                    [Return to Home]
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Career timeline column */}
                  <div>
                    <h2 className="text-sm font-bold text-blue-800 border-b-2 border-blue-800 pb-1 mb-3 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-blue-600" /> Professional Experience
                    </h2>
                    <div className="space-y-4">
                      {workExperience.workExperience.map((w) => (
                        <div key={w.name + w.role} className="border-l-2 border-blue-500 pl-3 py-1 relative">
                          <div className="w-3 h-3 bg-blue-600 rounded-full absolute -left-1.5 top-2 border border-white" />
                          <h3 className="font-bold text-gray-800 text-xs">{w.name}</h3>
                          <p className="text-blue-700 font-semibold text-[11px]">{w.role}</p>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{w.year}</span>
                          <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">{w.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education column */}
                  <div>
                    <h2 className="text-sm font-bold text-green-800 border-b-2 border-green-800 pb-1 mb-3 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-green-600" /> Academic Qualifications
                    </h2>
                    <div className="space-y-4">
                      {education.education.map((edu) => (
                        <div key={edu.name} className="border-l-2 border-green-500 pl-3 py-1 relative">
                          <div className="w-3 h-3 bg-green-600 rounded-full absolute -left-1.5 top-2 border border-white" />
                          <h3 className="font-bold text-gray-800 text-xs">{edu.name}</h3>
                          <p className="text-green-700 font-semibold text-[11px]">{edu.school}</p>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{edu.year}</span>
                          <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 6. GOOGLE SIMULATED SEARCH ENGINE */}
            {currentUrl.startsWith("http://google.com") && (
              <div className="bg-white min-h-full font-sans text-start flex flex-col p-6 items-center">
                
                {/* Google Logo */}
                <div className="mt-4 select-none">
                  <h1 className="text-5xl font-extrabold tracking-tight font-serif text-center">
                    <span className="text-[#3b82f6]">G</span>
                    <span className="text-[#ef4444]">o</span>
                    <span className="text-[#f59e0b]">o</span>
                    <span className="text-[#3b82f6]">g</span>
                    <span className="text-[#22c55e]">l</span>
                    <span className="text-[#ef4444]">e</span>
                  </h1>
                  <p className="text-right text-[10px] font-mono text-gray-400 font-bold -mt-1 mr-2">2001 Edition</p>
                </div>

                {/* Google Search Bar Form */}
                <form 
                  onSubmit={(e) => handleGoogleSearch(e, searchQuery)} 
                  className="mt-6 w-full max-w-lg flex flex-col items-center gap-3"
                >
                  <div className="flex w-full bg-white border-2 border-gray-300 rounded shadow-sm px-2 py-1 items-center focus-within:border-blue-500">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search the nostalgic web..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-black"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-400 text-gray-800 text-xs px-3 py-1.5 rounded hover:border-gray-500 cursor-pointer shadow-sm font-bold active:scale-95"
                    >
                      Google Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSound("click");
                        navigateTo("http://www.msn.elliot");
                      }}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-400 text-gray-800 text-xs px-3 py-1.5 rounded hover:border-gray-500 cursor-pointer shadow-sm font-bold active:scale-95"
                    >
                      I'm Feeling Lucky
                    </button>
                  </div>
                </form>

                {/* Search Results Display Area */}
                {currentUrl.includes("/search") && (
                  <div className="mt-8 w-full max-w-2xl border-t border-gray-300 pt-4 text-xs space-y-4">
                    <div className="text-gray-500 font-mono mb-2">
                      Results for "{getSearchQueryFromUrl(currentUrl)}" (showing 1-4 of 4 results):
                    </div>

                    {/* Results mapping */}
                    <div className="space-y-4">
                      
                      {/* Result 1: Elliot Aaen Portfolio */}
                      <div className="text-start">
                        <button 
                          onClick={() => navigateTo("http://www.msn.elliot")}
                          className="text-sm font-bold text-blue-800 hover:underline block text-left cursor-pointer"
                        >
                          Elliot Strand Aaen - Software Developer Web Portal Homepage
                        </button>
                        <span className="text-[#008000] block">http://www.msn.elliot/</span>
                        <p className="text-gray-600 mt-0.5 leading-relaxed">
                          Welcome to the official Windows XP simulated desktop experience of Elliot strand Aaen. View project files, check credentials, play Minesweeper, and try our Paint suite!
                        </p>
                      </div>

                      {/* Result 2: Projects index */}
                      <div className="text-start">
                        <button 
                          onClick={() => navigateTo("http://projects.elliot")}
                          className="text-sm font-bold text-blue-800 hover:underline block text-left cursor-pointer"
                        >
                          Elliot's Projects Directory Catalog - Source Code & Live Links
                        </button>
                        <span className="text-[#008000] block">http://projects.elliot</span>
                        <p className="text-gray-600 mt-0.5 leading-relaxed">
                          Index of /projects. A table-based layout containing code repositories for chat agents, recipe generators, Wordle clones, delayed arrivals web crawlers and much more.
                        </p>
                      </div>

                      {/* Result 3: Work & Education */}
                      <div className="text-start">
                        <button 
                          onClick={() => navigateTo("http://experience.elliot")}
                          className="text-sm font-bold text-blue-800 hover:underline block text-left cursor-pointer"
                        >
                          Career &amp; Education Timeline — Work History &amp; Schooling
                        </button>
                        <span className="text-[#008000] block">http://experience.elliot</span>
                        <p className="text-gray-600 mt-0.5 leading-relaxed">
                          Professional experience at Skatteetaten and Intility, plus VGS and apprenticeship education records.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                <div className="mt-12 text-center text-xs text-gray-400">
                  <p>©2001 Google - Searching 1,384,102,481 simulated web documents</p>
                </div>
              </div>
            )}

            {/* 7. CLASSIC "PAGE CANNOT BE DISPLAYED" 404 SCREEN */}
            {!addressList.some(addr => currentUrl.startsWith(addr)) && (
              <div className="bg-white min-h-full font-sans text-start p-10 flex gap-4">
                
                {/* Red warning X */}
                <div className="w-12 h-12 bg-red-100 border-2 border-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-red-600 font-extrabold text-2xl select-none">
                  X
                </div>

                <div className="space-y-4 max-w-xl">
                  <h1 className="text-xl font-bold text-[#333333] font-sans">
                    The page cannot be displayed
                  </h1>
                  
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">
                    The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
                  </p>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="text-xs text-gray-700 space-y-2 font-sans">
                    <p className="font-bold">Please try the following:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Click the <button onClick={handleRefresh} className="text-blue-600 hover:underline font-bold">Refresh</button> button, or try again later.
                      </li>
                      <li>
                        If you typed the page address in the Address bar, make sure that it is spelled correctly.
                      </li>
                      <li>
                        To return to the default intranet portal, click <button onClick={() => navigateTo("http://www.msn.elliot")} className="text-blue-600 hover:underline font-bold">http://www.msn.elliot</button>.
                      </li>
                      <li>
                        Verify your network proxy settings or dial-up internet connections. (XP Intranet Server)
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>

                  <p className="text-[10px] text-gray-400 font-mono">
                    HTTP 404 - File Not Found<br />
                    Internet Explorer 6.0 Server
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-[#ece9d8] border-t border-[#b0ac9c] p-1 flex justify-between items-center text-[11px] text-gray-700 select-none font-sans h-6">
          <div className="flex items-center gap-1.5 flex-1 pl-1">
            <span className="text-[13px] font-bold text-gray-600 select-none">🌐</span>
            <span className="truncate">{statusMessage}</span>
          </div>
          
          {/* Green XP loading bar */}
          {loading && (
            <div className="w-24 h-3 bg-gray-200 border border-gray-400 mr-2 flex p-0.5 rounded-sm overflow-hidden select-none">
              <div 
                className="bg-gradient-to-r from-green-500 to-[#38af38] h-full transition-all duration-300 rounded-sm shadow-[inset_0px_1px_0px_rgba(255,255,255,0.4)]"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}

          <div className="border-l border-gray-400 h-4 mx-1.5" />
          
          {/* Network Zone Icon */}
          <div className="flex items-center gap-1 pr-3 pl-1 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-gray-600 select-none text-[10px]">Local intranet</span>
          </div>
        </div>

      </div>
    </Window>
  );
}

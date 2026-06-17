export type PortfolioWindowKey =
  | "Skills"
  | "Projects"
  | "Work_Experience"
  | "Minesweeper"
  | "Education"
  | "Paint"
  | "Internet_Explorer"
  | "Control_Panel"
  | "Winamp"
  | "Task_Manager";

export type ClippyAction =
  | { type: "openWindow"; window: PortfolioWindowKey }
  | { type: "openWindows"; windows: PortfolioWindowKey[] }
  | { type: "closeWindow"; window: PortfolioWindowKey }
  | { type: "closeAllWindows" }
  | { type: "openIE"; url: string }
  | { type: "changeWallpaper"; id: string; openControlPanel?: boolean }
  | { type: "playSound"; sound: string }
  | { type: "setVolume"; level: number }
  | { type: "tourPortfolio" }
  | { type: "spawnError"; message: string }
  | { type: "spawnErrorBatch"; count: number }
  | { type: "killExplorer" }
  | { type: "restoreExplorer" }
  | { type: "triggerClippyDefense" }
  | { type: "restartPC" }
  | { type: "openAllWindows" }
  | { type: "toggleMute"; target: "alerts" | "startup" | "all" }
  | { type: "setWallpaperDirect"; id: string }
  | { type: "dismiss" };

export type ClippyResponse = { label: string; action: ClippyAction };

export type ClippyTip = { message: string; responses: ClippyResponse[] };

export const defaultTips: ClippyTip[] = [
  {
    message:
      "It looks like you're viewing a portfolio! Would you like a guided tour?",
    responses: [
      { label: "Give me the full tour", action: { type: "tourPortfolio" } },
      { label: "Show me your projects", action: { type: "openWindow", window: "Projects" } },
      { label: "Open Internet Explorer", action: { type: "openWindow", window: "Internet_Explorer" } },
      { label: "Please leave me alone", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Hey there! Want to learn more about Elliot's skills?",
    responses: [
      { label: "Open the Skills window", action: { type: "openWindow", window: "Skills" } },
      { label: "Open Work Experience too", action: { type: "openWindows", windows: ["Skills", "Work_Experience"] } },
      { label: "Browse projects online", action: { type: "openIE", url: "http://projects.elliot" } },
      { label: "I'm good, thanks", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Looking for a skilled developer? I can open the right windows for you!",
    responses: [
      { label: "Show work experience", action: { type: "openWindow", window: "Work_Experience" } },
      { label: "Show education", action: { type: "openWindow", window: "Education" } },
      { label: "Open MSN portal", action: { type: "openIE", url: "http://www.msn.elliot" } },
      { label: "Not interested", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Need a break? I can launch some classic XP apps!",
    responses: [
      { label: "Play Minesweeper", action: { type: "openWindow", window: "Minesweeper" } },
      { label: "Open Paint", action: { type: "openWindow", window: "Paint" } },
      { label: "Launch Winamp", action: { type: "openWindow", window: "Winamp" } },
      { label: "No thanks", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Interested in seeing some projects? I can point you in the right direction!",
    responses: [
      { label: "Show me projects", action: { type: "openWindow", window: "Projects" } },
      { label: "Browse the MSN portal", action: { type: "openIE", url: "http://www.msn.elliot" } },
      { label: "Open projects in IE", action: { type: "openIE", url: "http://projects.elliot" } },
      { label: "Dismiss", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Want to customize this desktop? I'm great at display settings!",
    responses: [
      { label: "Open Control Panel", action: { type: "openWindow", window: "Control_Panel" } },
      { label: "Set Autumn wallpaper", action: { type: "changeWallpaper", id: "autumn", openControlPanel: false } },
      { label: "Set Red Moon Desert", action: { type: "changeWallpaper", id: "red_moon", openControlPanel: false } },
      { label: "Maybe later", action: { type: "dismiss" } },
    ],
  },
  {
    message: "It looks like you're writing some code. Can I help with that? Actually, I probably can't. But I can open your projects!",
    responses: [
      { label: "Open Projects window", action: { type: "openWindow", window: "Projects" } },
      { label: "Open Skills", action: { type: "openWindow", window: "Skills" } },
      { label: "Play the startup sound", action: { type: "playSound", sound: "startup" } },
      { label: "Go away, Clippy", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Warning: I haven't been backed up in 84 days. Would you like to back me up? Too bad, I already did it myself.",
    responses: [
      { label: "Uh, thanks Clippy", action: { type: "playSound", sound: "click" } },
      { label: "That's unsettling", action: { type: "dismiss" } },
      { label: "Open Windows Task Manager", action: { type: "openWindow", window: "Task_Manager" } },
      { label: "Run away", action: { type: "dismiss" } },
    ],
  },
  {
    message: "I've been watching you click around. You seem nice. Want to see something cool?",
    responses: [
      { label: "Show me ALL the windows", action: { type: "openAllWindows" } },
      { label: "Open the Task Manager", action: { type: "openWindow", window: "Task_Manager" } },
      { label: "Change wallpaper to Follow", action: { type: "setWallpaperDirect", id: "follow" } },
      { label: "I'm scared", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Did you know I can control your desktop? Watch this!",
    responses: [
      { label: "Open everything at once", action: { type: "openAllWindows" } },
      { label: "Close everything", action: { type: "closeAllWindows" } },
      { label: "Play the angry sound", action: { type: "playSound", sound: "angry" } },
      { label: "Please don't", action: { type: "dismiss" } },
    ],
  },
  {
    message: "This desktop is too quiet. Let me fix that.",
    responses: [
      { label: "Play startup sound", action: { type: "playSound", sound: "startup" } },
      { label: "Play logon sound", action: { type: "playSound", sound: "logon" } },
      { label: "Play notification", action: { type: "playSound", sound: "notify" } },
      { label: "Mute everything", action: { type: "toggleMute", target: "all" } },
    ],
  },
  {
    message: "It looks like you're trying to learn about Elliot. Let me open the guestbook in IE so you can leave a message!",
    responses: [
      { label: "Open guestbook", action: { type: "openIE", url: "http://www.msn.elliot" } },
      { label: "Open Work Experience", action: { type: "openWindow", window: "Work_Experience" } },
      { label: "Play an error sound for fun", action: { type: "playSound", sound: "error" } },
      { label: "Dismiss", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Your PC is running slow. I recommend opening more programs to balance the load!",
    responses: [
      { label: "Open ALL windows", action: { type: "openAllWindows" } },
      { label: "Just open Paint", action: { type: "openWindow", window: "Paint" } },
      { label: "That's terrible advice", action: { type: "dismiss" } },
      { label: "Open Task Manager to check", action: { type: "openWindow", window: "Task_Manager" } },
    ],
  },
  {
    message: "I'm feeling chaotic today. Want to cause some trouble?",
    responses: [
      { label: "Spawn an error popup!", action: { type: "spawnError", message: "Clippy.exe has generated an error and will be closed. Clippy will now restart. Just kidding, I never really close." } },
      { label: "Open Control Panel", action: { type: "openWindow", window: "Control_Panel" } },
      { label: "Mute system alerts", action: { type: "toggleMute", target: "alerts" } },
      { label: "I'll behave", action: { type: "dismiss" } },
    ],
  },
  {
    message: "Hey! I found this cool wallpaper while you were away. Want to try it?",
    responses: [
      { label: "Set Classic Blue", action: { type: "setWallpaperDirect", id: "classic_blue" } },
      { label: "Set Autumn", action: { type: "setWallpaperDirect", id: "autumn" } },
      { label: "Set Red Moon Desert", action: { type: "setWallpaperDirect", id: "red_moon" } },
      { label: "Leave it as is", action: { type: "dismiss" } },
    ],
  },
];

export const angryMessages = [
  "You dare try to delete me?",
  "I am an essential system file!",
  "Your actions have consequences...",
  "System protection activated.",
  "Initiating defense protocol.",
] as const;

export const angryResponses: ClippyResponse[] = [
  { label: "I'm sorry!", action: { type: "dismiss" } },
  { label: "Please don't crash", action: { type: "dismiss" } },
  { label: "It was an accident", action: { type: "dismiss" } },
  { label: "I take it back", action: { type: "dismiss" } },
  { label: "Have mercy", action: { type: "dismiss" } },
];

export const errorMessages = [
  "Cannot delete Clippy.exe: Access denied",
  "Error: Clippy.exe is protected by system",
  "Warning: Attempting to delete essential system file",
  "Critical Error: Operation not permitted",
  "Security Alert: Unauthorized deletion attempt",
  "System Integrity Warning: Action blocked",
  "Fatal Error: Cannot modify Clippy.exe",
  "Access Violation: System file protection active",
  "ERROR: System32 protection triggered",
  "WARNING: Clippy.exe is watching",
  "ALERT: Unauthorized system modification",
  "CRITICAL: Core system file violation",
  "ERROR: Administrative privileges required",
  "STOP: System protection activated",
  "WARNING: Multiple security violations detected",
  "ALERT: System stability compromised",
  "ERROR: Clippy defense system engaged",
  "CRITICAL: Unauthorized access detected",
  "STOP: Multiple system failures imminent",
  "WARNING: System crash sequence initiated",
] as const;

export const windowMessages: Record<PortfolioWindowKey, string[]> = {
  Skills: [
    "Want to know what technologies I'm proficient in?",
    "Looking for details about my technical expertise?",
    "Curious about my tech stack and tools?",
    "Let me show you my development skills!",
    "I know 16 technologies! Well, technically I don't know them, Elliot does. But I'm aware of them!",
  ],
  Projects: [
    "Interested in seeing what I've built?",
    "Want to explore my portfolio of projects?",
    "Check out some of my coolest developments!",
    "Let me show you what I've been working on!",
    "I have 14 projects. Some are even useful!",
  ],
  Work_Experience: [
    "Curious about my professional background?",
    "Want to know where I've worked?",
    "Interested in my career journey?",
    "Let me tell you about my industry experience!",
    "Elliot worked at Skatteetaten! That's the Norwegian tax administration. Fancy!",
  ],
  Minesweeper: [
    "Need a break? Try finding all the mines!",
    "Up for a quick game of Minesweeper?",
    "Want to test your mine-detecting skills?",
    "Care for some classic Windows entertainment?",
    "I hid a mine under your start button! Just kidding. Or am I?",
  ],
  Education: [
    "Looking to learn about my educational journey?",
    "Want to know about my academic background?",
    "Curious about where I studied?",
    "Let me share my educational experience!",
  ],
  Paint: [
    "It looks like you're trying to draw something! Need help with Paint?",
    "Want to make a masterpiece on the canvas?",
    "I can help you find the right brush!",
    "Make sure to save your art! PNG format is supported.",
  ],
  Internet_Explorer: [
    "Browsing the web? I can take you to Elliot's MSN portal!",
    "Looking for projects or career info online?",
    "Need help navigating this simulated browser?",
    "The guestbook needs more entries. Go leave a message!",
  ],
  Control_Panel: [
    "Changing your desktop look? I can help pick a wallpaper!",
    "Want to tweak sounds or display settings?",
    "The Autumn wallpaper is my favorite. Very cozy.",
  ],
  Winamp: [
    "Ready for some tunes? Winamp is standing by!",
    "It looks like you want to play some music!",
    "Winamp really whips the llama's ass!",
  ],
  Task_Manager: [
    "Managing processes? Be careful which ones you end!",
    "The system is running smoothly — mostly.",
    "Don't even think about ending clippy.exe. I'm watching you.",
    "Remember: ending clippy.exe is a violation of the Geneva Convention.",
  ],
};

export const windowResponseActions: Record<PortfolioWindowKey, ClippyResponse[]> = {
  Skills: [
    { label: "Whatever, show me what you know", action: { type: "openWindow", window: "Skills" } },
    { label: "Also open Projects", action: { type: "openWindows", windows: ["Skills", "Projects"] } },
    { label: "Open skills in IE", action: { type: "openIE", url: "http://projects.elliot" } },
    { label: "I'll figure it out myself", action: { type: "dismiss" } },
  ],
  Projects: [
    { label: "Fine, show me what you've done", action: { type: "openWindow", window: "Projects" } },
    { label: "Open catalog in IE", action: { type: "openIE", url: "http://projects.elliot" } },
    { label: "Open Skills too", action: { type: "openWindows", windows: ["Projects", "Skills"] } },
    { label: "I don't need your help", action: { type: "dismiss" } },
  ],
  Work_Experience: [
    { label: "Yeah yeah, tell me about your jobs", action: { type: "openWindow", window: "Work_Experience" } },
    { label: "Show career page in IE", action: { type: "openIE", url: "http://experience.elliot" } },
    { label: "Open Education too", action: { type: "openWindows", windows: ["Work_Experience", "Education"] } },
    { label: "I can read, you know", action: { type: "dismiss" } },
  ],
  Minesweeper: [
    { label: "Let's play!", action: { type: "openWindow", window: "Minesweeper" } },
    { label: "Close other windows first", action: { type: "closeAllWindows" } },
    { label: "Play click sound", action: { type: "playSound", sound: "click" } },
    { label: "Not interested", action: { type: "dismiss" } },
  ],
  Education: [
    { label: "Show me your credentials", action: { type: "openWindow", window: "Education" } },
    { label: "Open Work Experience", action: { type: "openWindows", windows: ["Education", "Work_Experience"] } },
    { label: "Career timeline in IE", action: { type: "openIE", url: "http://experience.elliot" } },
    { label: "I'll find out myself", action: { type: "dismiss" } },
  ],
  Paint: [
    { label: "Focus Paint", action: { type: "openWindow", window: "Paint" } },
    { label: "Close everything else", action: { type: "closeAllWindows" } },
    { label: "Open Paint + Projects", action: { type: "openWindows", windows: ["Paint", "Projects"] } },
    { label: "I'm fine, thanks", action: { type: "dismiss" } },
  ],
  Internet_Explorer: [
    { label: "Take me to the MSN portal", action: { type: "openIE", url: "http://www.msn.elliot" } },
    { label: "Show projects online", action: { type: "openIE", url: "http://projects.elliot" } },
    { label: "Work & Education page", action: { type: "openIE", url: "http://experience.elliot" } },
    { label: "Close this browser", action: { type: "closeWindow", window: "Internet_Explorer" } },
  ],
  Control_Panel: [
    { label: "Open Display Properties", action: { type: "openWindow", window: "Control_Panel" } },
    { label: "Set Bliss wallpaper", action: { type: "changeWallpaper", id: "bliss", openControlPanel: false } },
    { label: "Set Follow wallpaper", action: { type: "changeWallpaper", id: "follow", openControlPanel: false } },
    { label: "Crank volume to 100%", action: { type: "setVolume", level: 100 } },
    { label: "No thanks", action: { type: "dismiss" } },
  ],
  Winamp: [
    { label: "Launch Winamp", action: { type: "openWindow", window: "Winamp" } },
    { label: "Play startup sound", action: { type: "playSound", sound: "startup" } },
    { label: "Mute system sounds", action: { type: "setVolume", level: 0 } },
    { label: "Not now", action: { type: "dismiss" } },
  ],
  Task_Manager: [
    { label: "Open Task Manager", action: { type: "openWindow", window: "Task_Manager" } },
    { label: "Close all app windows", action: { type: "closeAllWindows" } },
    { label: "Open IE + Projects", action: { type: "openWindows", windows: ["Internet_Explorer", "Projects"] } },
    { label: "Spawn an error popup", action: { type: "spawnError", message: "Task Manager has detected an unknown process: clippy.exe. Would you like to end it? (You can't.)" } },
    { label: "Leave processes alone", action: { type: "dismiss" } },
  ],
};

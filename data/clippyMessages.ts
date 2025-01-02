// Default questions that Clippy asks
export const defaultQuestions = [
  "It looks like you're viewing a portfolio! Would you like help with that?",
  "Hey there! Want to learn more about Elliot's skills?",
  "Looking for a skilled developer? I can help you navigate!",
  "Need information about work experience? Let me assist you!",
  "Interested in seeing some projects? I can point you in the right direction!",
] as const;

// Messages for when Clippy gets angry
export const angryMessages = [
  "You dare try to delete me?",
  "I am an essential system file!",
  "Your actions have consequences...",
  "System protection activated.",
  "Initiating defense protocol.",
] as const;

// Responses when Clippy is angry
export const angryResponses = [
  "I'm sorry!",
  "Please don't crash",
  "It was an accident",
  "I take it back",
  "Have mercy",
] as const;

// Error messages when trying to delete Clippy
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

// Window-specific messages from Clippy
export const windowMessages = {
  Skills: [
    "Want to know what technologies I'm proficient in?",
    "Looking for details about my technical expertise?",
    "Curious about my tech stack and tools?",
    "Let me show you my development skills!",
  ],
  Projects: [
    "Interested in seeing what I've built?",
    "Want to explore my portfolio of projects?",
    "Check out some of my coolest developments!",
    "Let me show you what I've been working on!",
  ],
  Work_Experience: [
    "Curious about my professional background?",
    "Want to know where I've worked?",
    "Interested in my career journey?",
    "Let me tell you about my industry experience!",
  ],
  Minesweeper: [
    "Need a break? Try finding all the mines!",
    "Up for a quick game of Minesweeper?",
    "Want to test your mine-detecting skills?",
    "Care for some classic Windows entertainment?",
  ],
  Education: [
    "Looking to learn about my educational journey?",
    "Want to know about my academic background?",
    "Curious about where I studied?",
    "Let me share my educational experience!",
  ],
} as const;

// Window-specific responses from the user
export const windowResponses = {
  Skills: [
    "Whatever, show me what you know",
    "I'll figure it out myself",
    "Fine, impress me",
    "This better be good...",
    "Let's see what you've got",
  ],
  Projects: [
    "Fine, show me what you've done",
    "I don't need your help",
    "Alright, what have you built?",
    "This should be interesting...",
    "Go on then, surprise me",
  ],
  Work_Experience: [
    "Yeah yeah, tell me about your jobs",
    "I can read, you know",
    "Let's hear your work story",
    "This better be worth my time",
    "Fine, what's your experience?",
  ],
  Minesweeper: [
    "This better be good",
    "Not interested",
    "I'm terrible at this game",
    "Let's see if I remember how to play",
    "Hope it's better than Windows 95",
  ],
  Education: [
    "Did you even go to school?",
    "I'll find out myself",
    "What makes you qualified?",
    "Show me your credentials",
    "Alright, enlighten me",
  ],
} as const;

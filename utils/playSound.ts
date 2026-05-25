export function playSound(soundName: string) {
  if (typeof window !== "undefined") {
    // Check if all sounds are disabled
    if ((window as any).muteSystemSounds) {
      return Promise.resolve();
    }

    // Check startup, logon, shutdown sounds
    const isStartupSound = ["startup", "logon", "shutdown"].includes(soundName);
    if (isStartupSound && (window as any).startupSoundsEnabled === false) {
      return Promise.resolve();
    }

    // Check system alerts (clicks, errors, recycled, etc.)
    const isAlertSound = !isStartupSound;
    if (isAlertSound && (window as any).systemAlertsEnabled === false) {
      return Promise.resolve();
    }
  }

  // Create audio element
  const audio = new Audio(`audio/${soundName}.wav`);
  const volMultiplier = typeof window !== "undefined" ? ((window as any).soundVolume ?? 100) / 100 : 1.0;
  if (soundName === "error") {
    audio.volume = 0.1 * volMultiplier;
  } else {
    audio.volume = 0.2 * volMultiplier;
  }

  // Return a promise that resolves when the audio is loaded and played
  return new Promise((resolve, reject) => {
    // Handle loading
    audio.addEventListener(
      "canplaythrough",
      () => {
        audio
          .play()
          .then(resolve)
          .catch((error) => {
            console.error("Audio playback failed:", error);
            reject(error);
          });
      },
      { once: true }
    );

    // Handle loading errors
    audio.addEventListener(
      "error",
      (error) => {
        console.error("Audio loading failed:", error);
        reject(error);
      },
      { once: true }
    );

    // Start loading the audio
    audio.load();
  });
}

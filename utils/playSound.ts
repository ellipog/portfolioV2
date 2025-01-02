export function playSound(soundName: string) {
  // Create audio element
  const audio = new Audio(`audio/${soundName}.wav`);
  if (soundName === "error") {
    audio.volume = 0.1;
  } else {
    audio.volume = 0.2;
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


let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playNewMessageSound = () => {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Sound properties
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, context.currentTime); // High pitch
    gainNode.gain.setValueAtTime(0.1, context.currentTime); // Low volume

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  } catch (error) {
    console.error("Could not play sound:", error);
  }
};

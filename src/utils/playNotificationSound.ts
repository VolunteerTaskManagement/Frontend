let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playNotificationSound() {
  try {
    const ctx = getAudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const playTone = (frequency: number, start: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.2, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(now + start);
      oscillator.stop(now + start + duration + 0.02);
    };

    playTone(880, 0, 0.12);
    playTone(1175, 0.12, 0.18);
  } catch {
    // اگر مرورگر پخش صدا را مسدود کرده باشد، بی‌سروصدا نادیده می‌گیریم
    // (نباید باعث خطا یا کرش برنامه بشود)
  }
}
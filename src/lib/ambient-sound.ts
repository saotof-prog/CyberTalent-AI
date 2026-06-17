let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let nodes: AudioNode[] = [];
let currentMode: string | null = null;

function getContext() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function stop() {
  nodes.forEach((n) => {
    try { n.disconnect(); } catch { /* noop */ }
  });
  nodes = [];
  if (masterGain) {
    try { masterGain.disconnect(); } catch { /* noop */ }
    masterGain = null;
  }
  currentMode = null;
}

function startDrone() {
  const c = getContext();
  masterGain = c.createGain();
  masterGain.gain.value = 0.15;
  masterGain.connect(c.destination);

  // Bass drone
  const osc1 = c.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = 55;
  osc1.detune.value = -5;

  const osc2 = c.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 55;
  osc2.detune.value = 5;

  // Pad
  const osc3 = c.createOscillator();
  osc3.type = "triangle";
  osc3.frequency.value = 110;

  // Filter
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  filter.Q.value = 1;

  const gain1 = c.createGain();
  gain1.gain.value = 0.3;
  const gain2 = c.createGain();
  gain2.gain.value = 0.3;
  const gain3 = c.createGain();
  gain3.gain.value = 0.15;

  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);
  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);
  filter.connect(masterGain);

  osc1.start();
  osc2.start();
  osc3.start();

  nodes = [osc1, osc2, osc3, gain1, gain2, gain3, filter];
  currentMode = "drone";
}

function startRain() {
  const c = getContext();
  masterGain = c.createGain();
  masterGain.gain.value = 0.1;
  masterGain.connect(c.destination);

  const bufferSize = 4096;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = c.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;

  const gain = c.createGain();
  gain.gain.value = 0.6;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start();

  nodes = [source, filter, gain];
  currentMode = "rain";
}

function startLofi() {
  const c = getContext();
  masterGain = c.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(c.destination);

  // Simple lofi pad
  const osc1 = c.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = 65.41; // C2

  const osc2 = c.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = 98; // G2

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 250;
  filter.Q.value = 2;

  const gain1 = c.createGain();
  gain1.gain.value = 0.2;
  const gain2 = c.createGain();
  gain2.gain.value = 0.15;

  // Tremolo
  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.3;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.15;
  lfo.connect(lfoGain);

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(filter);
  gain2.connect(filter);
  lfoGain.connect(masterGain.gain);
  filter.connect(masterGain);

  osc1.start();
  osc2.start();
  lfo.start();

  nodes = [osc1, osc2, gain1, gain2, filter, lfo, lfoGain];
  currentMode = "lofi";
}

const MODES: Record<string, () => void> = {
  drone: startDrone,
  rain: startRain,
  lofi: startLofi,
};

export function playAmbient(mode: "drone" | "rain" | "lofi" | "off") {
  stop();
  if (mode === "off") return;
  MODES[mode]?.();
}

export function setVolume(v: number) {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
}

export function getCurrentMode() {
  return currentMode;
}

export function stopAmbient() {
  stop();
}

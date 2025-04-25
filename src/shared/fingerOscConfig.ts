// Configuración de ondas y nombres para cada dedo
export const FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"] as const;
export type FingerName = typeof FINGER_NAMES[number];

export const FINGER_WAVES: Record<FingerName, OscillatorType> = {
  Thumb: "sine",
  Index: "square",
  Middle: "triangle",
  Ring: "sawtooth",
  Pinky: "triangle"
};

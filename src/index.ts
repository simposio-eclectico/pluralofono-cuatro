import * as handdetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as fp from "fingerpose";
import { Camera } from "./camera";
import { FINGER_NAMES, FINGER_WAVES, FingerName } from "./shared/fingerOscConfig";
import Logger from "./shared/logger";
import Oscillator from "./shared/oscilator";
import {
  closedHandSign,
  indexUpSign,
  middleUpSign,
  openHandSign,
  rootSign,
  secondSign,
} from "./shared/signs";
Logger.setLevels(["debug", "log", "info", "warn", "error"]);
Logger.setOnly(["audio"]);

class Pluramotionofono {
  detector!: handdetection.HandDetector | null;
  camera!: Camera;
  context!: AudioContext;
  rafId!: number;
  // Osciladores por mano y dedo
  oscillators: { [hand: string]: { [finger in FingerName]?: Oscillator } } = { Left: {}, Right: {} };
  GE: fp.GestureEstimator;
  inited: any;
  oscillator: any;

  private constructor(_camera: Camera, _detector: handdetection.HandDetector) {
    this.context = new AudioContext();
    this.camera = _camera;
    this.detector = _detector;
    this.GE = new fp.GestureEstimator([
      rootSign,
      secondSign,
      openHandSign,
      closedHandSign,
      indexUpSign,
      middleUpSign,
    ]);
    // Inicializa osciladores por dedo y mano
    ["Left", "Right"].forEach(hand => {
      FINGER_NAMES.forEach(finger => {
        const osc = new Oscillator(this.context);
        osc.setWave(FINGER_WAVES[finger]);
        osc.setGain(0);
        osc.start();
        this.oscillators[hand][finger] = osc;
      });
    });
  }

  static async create() {
    const _camera = await Camera.setupCamera();
    const _detector = await handdetection.createDetector(
      handdetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        modelType: "full",
        maxHands: 2,
        // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
      }
    );
    return new Pluramotionofono(_camera, _detector);
  }

  init() {
    this.renderPrediction();
  }

  playSound(x: number, y: number, hand: "Left" | "Right") {
    if (!this.inited[hand]) {
      Logger.log("audio", "iniciando contexto de audio");
      const audioContext = new AudioContext();
      this.oscillator[hand] = new Oscillator(audioContext);
      this.oscillator[hand]?.start();
      this.inited[hand] = true;
      Logger.log("audio", `contexto de audio iniciado`);
    }
    if (this.oscillator[hand]) {
      const rx = Camera.getRelativeX(x);
      const ry = Camera.getRelativeY(y);
      const dx = rx > 0.5
      Logger.oneline(Logger.DEBUG, "audio", `reproduciendo oscilador: ${rx} ${ry}`);
      this.oscillator[hand]?.setFrequency(Math.min(1, Math.abs(ry ? ry : 0.001)));
      this.oscillator[hand]?.setGain(Math.min(1, Math.abs(rx)));
    }
  }

  changeSynth(hand: "Left" | "Right", wave: OscillatorType) {
    Logger.warn("audio", "cambió el sinte");
    this.oscillator[hand]?.setWave(wave);
  }

  stopSound(hand: "Left" | "Right") {
    if (this.inited[hand] && this.oscillator[hand]) {
      Logger.debug("audio", `cerrando oscilador`);
      this.oscillator[hand]?.setGain(0);
      this.oscillator[hand]?.setWave("sine");
    }
  }

  async renderResult() {
    if (this.detector == null) return;
    try {
      const hands = await this.detector.estimateHands(this.camera.video, {
        flipHorizontal: false,
      });
      // Reinicia todos los osciladores en silencio
      ["Left", "Right"].forEach(hand => {
        FINGER_NAMES.forEach(finger => {
          this.oscillators[hand][finger]?.setGain(0);
        });
      });
      for (const hand of hands) {
        Logger.debug("render", hand);
        if (hand.score < 0.95) continue;
        // Por cada dedo, si está extendido, activa su oscilador
        // keypoints: 0=wrist, 1-4=thumb, 5-8=index, 9-12=middle, 13-16=ring, 17-20=pinky
        const fingerIndices = {
          Thumb: [1, 2, 3, 4],
          Index: [5, 6, 7, 8],
          Middle: [9, 10, 11, 12],
          Ring: [13, 14, 15, 16],
          Pinky: [17, 18, 19, 20]
        };
        FINGER_NAMES.forEach(finger => {
          const indices = fingerIndices[finger];
          if (!hand.keypoints) return;
          // Considera extendido si la punta está lejos de la base
          const base = hand.keypoints[indices[0]];
          const tip = hand.keypoints[indices[3]];
          if (!base || !tip) return;
          const dist = Math.sqrt((tip.x - base.x) ** 2 + (tip.y - base.y) ** 2);
          const extended = dist > 0.09; // Ajusta este umbral si es necesario
          if (extended) {
            // Controla frecuencia y ganancia según posición Y y X de la punta
            const rx = Camera.getRelativeX(tip.x);
            const ry = Camera.getRelativeY(tip.y);
            const osc = this.oscillators[hand.handedness][finger];
            osc?.setFrequency(Math.min(1, Math.abs(1 - ry ? ry : 0.001))); // Arriba=agudo, abajo=grave
            osc?.setGain(Math.min(1, Math.abs(1 - rx)));
          }
        });
      }
      this.camera.drawVideo();
    } catch (error) {
      this.detector.dispose();
      this.detector = null;
      alert(error);
    }
  }

  async renderPrediction() {
    await this.renderResult();
    this.rafId = requestAnimationFrame(this.renderPrediction.bind(this));
  }
}

(async () => {
  const pmf = await Pluramotionofono.create();
  pmf.init();
})();

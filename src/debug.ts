import * as mpHands from "@mediapipe/hands";
import * as handdetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as fp from "fingerpose";
import { Camera } from "./camera";
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
  oscillator!: { Left: Oscillator | null; Right: Oscillator | null };
  inited: { Left: boolean; Right: boolean };
  GE: fp.GestureEstimator;

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
    this.inited = { Left: false, Right: false };
    this.oscillator = { Left: null, Right: null };
  }

  static async create() {
    const _camera = await Camera.setupCamera();
    const _detector = await handdetection.createDetector(
      handdetection.SupportedModels.MediaPipeHands,
      {
        runtime: "mediapipe",
        modelType: "full",
        maxHands: 2,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
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
      this.oscillator[hand]?.setFrequency(ry);
      this.oscillator[hand]?.setGain(Math.abs(rx));
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
      for (const hand of hands) {
        Logger.debug("render", hand);
        if(hand.score < 0.95) continue;
        const landmark = hand.keypoints3D?.map((value) => [
          value.x,
          value.y,
          value.z,
        ]);
        const estimatedGestures = this.GE.estimate(landmark, 7.5);
        if (estimatedGestures.gestures.length > 0) {
          const maxEstimated = estimatedGestures.gestures.reduce((max, p) =>
            p.score > max.score ? p : max
          );
          if (maxEstimated.name == "open_hand") {
            const { x, y } = hand.keypoints.find((k) => k.name === "wrist")!;
            this.playSound(x, y, hand.handedness);
          }
          if (maxEstimated.name == "closed_hand") {
            this.stopSound(hand.handedness);
          }
          if (maxEstimated.name == "index_up") {
            this.changeSynth(hand.handedness, "sawtooth");
          }
        }
      }
      this.camera.drawVideo();
      this.camera.drawResults(hands);
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

const pmf = await Pluramotionofono.create();
pmf.init();

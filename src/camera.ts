import { Points, ScatterGL } from "scatter-gl";
import * as params from "./shared/params";
import { isMobile } from "./shared/mobile";
import { createScatterGLContext } from "./shared/scatter";
import Logger from "./shared/logger";

export interface Point {
  x: number;
  y: number;
  z?: number;
  score?: number;
}

interface Hand {
  keypoints: Point[] | null;
  handedness: "Left" | "Right";
  keypoints3D?: Point[];
  score: number;
}

interface Context {
  scatterGLEl: HTMLElement;
  scatterGL: ScatterGL;
  scatterGLHasInitialized: boolean;
}

interface FingerIndices {
  [key: string]: { indices: number[]; color: string };
}

interface Size {
  height: number;
  width: number;
}

// These anchor points allow the hand pointcloud to resize according to its
// position in the input.
const ANCHOR_POINTS = [
  [0, 0, 0],
  [0, 0.1, 0],
  [-0.1, 0, 0],
  [-0.1, -0.1, 0],
] as Points;

const fingerLookupIndices: FingerIndices = {
  thumb: { indices: [0, 1, 2, 3, 4], color: "#ff9900" },
  indexFinger: { indices: [0, 5, 6, 7, 8], color: "#ff9900" },
  middleFinger: { indices: [0, 9, 10, 11, 12], color: "#ff9900" },
  ringFinger: { indices: [0, 13, 14, 15, 16], color: "#ff9900" },
  pinky: { indices: [0, 17, 18, 19, 20], color: "#ff9900" },
}; // for rendering each finger as a polyline

const scatterGLCtxtLeftHand = createScatterGLContext(
  "#scatter-gl-left"
);
const scatterGLCtxtRightHand = createScatterGLContext(
  "#scatter-gl-right"
);

export class Camera {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  videoContext: CanvasRenderingContext2D;
  constructor() {
    this.video = document.querySelector("#video")!;
    this.canvas = document.querySelector("#output")!;
    this.videoContext = this.canvas.getContext("2d")!;
  }

  static getSize(): Size {
    const size = { width: 640, height: 480 };
    return {
      width: isMobile() ? params.VIDEO_SIZE["360 X 270"].width : size.width,
      height: isMobile() ? params.VIDEO_SIZE["360 X 270"].height : size.height,
    };
  }

  /**
   * Initiate a Camera instance and wait for the camera stream to be ready.
   */
  static async setupCamera() {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error("navigator.mediaDevices.getUserMedia no disponible");
    }

    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        ...this.getSize(),
        frameRate: {
          ideal: 60,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    const camera = new Camera();
    camera.video.srcObject = stream;
    await new Promise<void>((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve();
      };
    });

    camera.video.play();

    const videoWidth = camera.video.videoWidth;
    const videoHeight = camera.video.videoHeight;
    // necesario para mostrar video
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    camera.canvas.width = videoWidth;
    camera.canvas.height = videoHeight;

    // rota la cámara
    camera.videoContext.translate(camera.video.videoWidth, 0);
    camera.videoContext.scale(-1, 1);

    return camera;
  }

  drawVideo() {
    this.videoContext.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    );
  }

  clearVideo() {
    this.videoContext.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  /**
   * Dibuja un arreglo de manos sobre el video.
   * @param hands Arreglo de manos para mostrar
   */
  drawResults(hands: Hand[]) {
    // Sort by right to left hands.
    hands.sort((hand1, hand2) => {
      if (hand1.handedness < hand2.handedness) return 1;
      if (hand1.handedness > hand2.handedness) return -1;
      return 0;
    });

    // Pad hands to clear empty scatter GL plots.
    while (hands.length < 2) hands.push({});

    for (let i = 0; i < hands.length; ++i) {
      const ctxt = [scatterGLCtxtLeftHand, scatterGLCtxtRightHand][i];
      this.drawResult(hands[i], ctxt);
    }
  }

  /**
   * Dibuja una mano sobre el video.
   * @param hand A hand with keypoints to render.
   * @param ctxt Scatter GL context to render 3D keypoints to.
   */
  drawResult(hand: Hand, ctxt: Context) {
    if (hand.keypoints != null) {
      this.drawKeypoints(hand.keypoints, hand.handedness);
    }
    // Don't render 3D hands after first two.
    if (ctxt == null) return;
    if (hand.keypoints3D != null) {
      this.drawKeypoints3D(hand.keypoints3D, hand.handedness, ctxt);
    } else {
      // Clear scatter plot.
      this.drawKeypoints3D([], "", ctxt);
    }
  }

  /**
   * Dibuja los keypoints de una mano sobre el video.
   * @param keypoints A list of keypoints.
   * @param handedness Label of hand (either Left or Right).
   */
  drawKeypoints(keypoints: Point[], handedness: string) {
    this.videoContext.fillStyle = handedness === "Left" ? "Red" : "Blue";
    this.videoContext.strokeStyle = "White";
    this.videoContext.lineWidth = params.DEFAULT_LINE_WIDTH;

    for (const element of keypoints) {
      const y = element.x;
      const x = element.y;
      this.drawPoint(x - 2, y - 2, 3);
    }

    const fingers = Object.keys(fingerLookupIndices);
    for (const finger of fingers) {
      const { indices } = fingerLookupIndices[finger];
      const points = indices.map((idx) => keypoints[idx]);
      this.drawPath(points);
    }
  }

  drawPath(points: any[]) {
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point.x, point.y);
    }
    this.videoContext.stroke(region);
  }

  drawPoint(y: number, x: number, r: number) {
    this.videoContext.beginPath();
    this.videoContext.arc(x, y, r, 0, 2 * Math.PI);
    this.videoContext.fill();
  }

  /**
   * Dibuja los keypoints de una mano en un canvas context para representar 3D.
   * @param keypoints 
   * @param handedness 
   * @param ctxt 
   */
  drawKeypoints3D(keypoints: Point[], handedness: string, ctxt: Context) {
    const scoreThreshold = 0;
    const pointsData = keypoints.map((keypoint) => [
      -keypoint.x,
      -keypoint.y,
      -keypoint.z,
    ]);

    const dataset = new ScatterGL.Dataset([...pointsData, ...ANCHOR_POINTS]);

    ctxt.scatterGL.setPointColorer((i) => {
      if (keypoints[i] == null || keypoints[i].score < scoreThreshold) {
        // hide anchor points and low-confident points.
        return "#ffffff";
      }
      return handedness === "Left" ? "#ff0000" : "#0000ff";
    });

    if (!ctxt.scatterGLHasInitialized) {
      ctxt.scatterGL.render(dataset);
    } else {
      ctxt.scatterGL.updateDataset(dataset);
    }
    ctxt.scatterGLHasInitialized = true;
  }

  static getRelativeX(x: number) {
    const { width } = Camera.getSize();
    Logger.trace("camera", `ancho: ${width}; pos: ${x}; rx: ${width / x}`);
    return x / width;
  }

  static getRelativeY(y: number) {
    const { height } = Camera.getSize();
    Logger.trace("camera", `alto: ${height}; pos: ${y}; ry: ${height / y}`);
    return y / height;
  }
}

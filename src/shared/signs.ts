import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const rootSign = new GestureDescription("Tónica");
rootSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
rootSign.addCurl(Finger.Index, FingerCurl.FullCurl, 1);
rootSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);
rootSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 0.8);
rootSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 0.8);
rootSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.8);

export const secondSign = new GestureDescription("Segunda");
secondSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
secondSign.addCurl(Finger.Index, FingerCurl.NoCurl, 0.8);
secondSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 1);
secondSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.5);
secondSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 0.8);
secondSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.8);

export const indexUpSign = new GestureDescription("index_up");
indexUpSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
indexUpSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
indexUpSign.addCurl(Finger.Index, FingerCurl.NoCurl, 0.85);
indexUpSign.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.85);
indexUpSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.8);
indexUpSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.5);
indexUpSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.8);
indexUpSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5);
indexUpSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.8);
indexUpSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5);

export const middleUpSign = new GestureDescription("index_up");
middleUpSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);
middleUpSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
middleUpSign.addCurl(Finger.Index, FingerCurl.FullCurl, 0.8);
middleUpSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);
middleUpSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 0.85);
middleUpSign.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.85);
middleUpSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.8);
middleUpSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5);
middleUpSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.8);
middleUpSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5);

export const openHandSign = new GestureDescription('open_hand');
openHandSign.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.8);
openHandSign.addCurl(Finger.Index, FingerCurl.NoCurl, 0.8);
openHandSign.addCurl(Finger.Middle, FingerCurl.NoCurl, 0.8);
openHandSign.addCurl(Finger.Ring, FingerCurl.NoCurl, 0.8);
openHandSign.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.8);

export const closedHandSign = new GestureDescription('closed_hand');
closedHandSign.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1);
closedHandSign.addCurl(Finger.Index, FingerCurl.FullCurl, 0.8);
closedHandSign.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.8);
closedHandSign.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.8);
closedHandSign.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.8);
closedHandSign.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8);
closedHandSign.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.5);
closedHandSign.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.5);
closedHandSign.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5);
closedHandSign.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5);
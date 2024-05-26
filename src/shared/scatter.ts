import * as scatter from "scatter-gl";


export function createScatterGLContext(selectors: string) {
  const scatterGLEl: HTMLElement = document.querySelector(selectors)!;
  return {
    scatterGLEl,
    scatterGL: new scatter.ScatterGL(scatterGLEl, {
      rotateOnStart: true,
      selectEnabled: false,
      styles: { polyline: { defaultOpacity: 1, deselectedOpacity: 1 } },
    }),
    scatterGLHasInitialized: false,
  };
 }
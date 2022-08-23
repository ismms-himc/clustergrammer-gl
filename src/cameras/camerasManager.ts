import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import {
  VisualizationDimensions,
  ZoomData,
} from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";
import { CameraInstance, Cameras } from "./cameras";
import make_cameras from "./functions/makeCameras";
import reset_cameras from "./functions/resetCameras";

export class CamerasManager {
  readonly #regl: Regl;
  #zoomData: ZoomData;
  #vizDim: VisualizationDimensions;
  #enableVizInteraction: boolean;
  #cameras: Record<string, CameraInstance>;

  constructor(
    regl: Regl,
    store: Store<RootState>,
    enableVizInteraction = true
  ) {
    const state = store.getState();
    this.#regl = regl;
    this.#zoomData = state.visualization.zoom_data;
    this.#vizDim = state.visualization.viz_dim;
    this.#enableVizInteraction = enableVizInteraction;
    this.#cameras = make_cameras(
      this.#regl,
      this.#zoomData,
      this.#vizDim,
      this.#enableVizInteraction
    ) as unknown as Cameras;
  }

  resetCameras(store: Store<RootState>) {
    const { cameras, zoom_data } = reset_cameras(
      this.#regl,
      store.getState(),
      store.dispatch
    );
    this.#zoomData = zoom_data as ZoomData;
    this.#cameras = cameras as unknown as Cameras;
  }

  setEnableVizInteraction(shouldBeEnabled: boolean) {
    this.#enableVizInteraction = shouldBeEnabled;
  }

  getCameras() {
    return this.#cameras;
  }
}

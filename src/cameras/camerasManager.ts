import { Store } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { Regl } from "regl";
import make_matrix_args from "../matrixCells/makeMatrixArgs.js";
import {
    mutateVisualizationState,
    ZoomData
} from "../state/reducers/visualization/visualizationSlice.js";
import { RootState } from "../state/store/store.js";
import { CameraInstance, Cameras } from "./cameras.js";
import make_cameras from "./functions/makeCameras.js";
import reset_cameras from "./functions/resetCameras.js";

export class CamerasManager {
  readonly #regl: Regl;
  #reglProps: any;
  #cameras: Record<string, CameraInstance>;

  constructor(regl: Regl, store: Store<RootState>) {
    this.#regl = regl;
    this.#cameras = make_cameras(this.#regl, store) as unknown as Cameras;
    this.#reglProps = make_matrix_args(regl, store);
  }

  resetCameras(store: Store<RootState>) {
    const { cameras, zoom_data } = reset_cameras(this.#regl, store);
    store.dispatch(
      mutateVisualizationState({
        zoom_data: zoom_data as ZoomData,
      })
    );
    this.#cameras = cameras as unknown as Cameras;
  }

  getCameras() {
    return this.#cameras;
  }

  mutateReglProps(newProps: any) {
    this.#reglProps = merge(this.#reglProps, newProps);
  }

  remakeMatrixArgs(store: Store<RootState>) {
    this.#reglProps = make_matrix_args(this.#regl, store);
  }

  getReglProps() {
    return this.#reglProps;
  }

  getReglInstance() {
    return this.#regl;
  }
}

import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { RootState } from "../state/store/store";
import build_control_panel from "./functions/buildControlPanel";
import build_dendrogram_sliders from "./functions/buildDendrogramSliders";
import ini_canvas_mouseover from "./functions/iniCanvasMouseover";
import initialize_containers from "./functions/initializeContainers";
import run_viz from "./functions/runViz";

export class UI {
  #tooltip_fun: any;

  constructor(
    regl: Regl,
    store: Store<RootState>,
    cameras: CamerasManager,
    catArgsManager: CatArgsManager,
    container: any,
    vizWidth: number | string,
    vizHeight: number | string,
    showControls = true
  ) {
    const state = store.getState();
    initialize_containers(container, vizWidth, vizHeight);
    if (showControls) {
      this.#tooltip_fun = build_control_panel(
        regl,
        state,
        store.dispatch,
        catArgsManager,
        cameras
      );
    }
    build_dendrogram_sliders(regl, state);
    ini_canvas_mouseover(
      regl,
      state,
      store.dispatch,
      catArgsManager,
      this.#tooltip_fun
    );
    run_viz(regl, store, catArgsManager, cameras);
  }

  getTooltipFunction() {
    return this.#tooltip_fun;
  }
}

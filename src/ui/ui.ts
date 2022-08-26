import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { RootState } from "../state/store/store";
import initializeD3Tip from "../tooltip/initializeD3Tip";
import run_viz from "./functions/animation/runViz";
import build_dendrogram_sliders from "./functions/buildDendrogramSliders";
import build_control_panel from "./functions/controlPanel/buildControlPanel";
import ini_canvas_mouseover from "./functions/mouseover/iniCanvasMouseover";

export type UIProps = {
  regl: Regl;
  store: Store<RootState>;
  camerasManager: CamerasManager;
  catArgsManager: CatArgsManager;
  container: any;
  vizWidth: number | string;
  vizHeight: number | string;
  showControls: boolean;
};

export class UI {
  #tooltip_fun: any;

  constructor(props: UIProps) {
    const {
      regl,
      store,
      camerasManager,
      catArgsManager,
      container,
      showControls,
    } = props;
    const state = store.getState();
    this.#tooltip_fun = initializeD3Tip(state);
    if (showControls) {
      build_control_panel(
        regl,
        store,
        container,
        catArgsManager,
        camerasManager,
        this.#tooltip_fun
      );
    }
    build_dendrogram_sliders(store);
    ini_canvas_mouseover(
      regl,
      store,
      container,
      catArgsManager,
      camerasManager,
      this.#tooltip_fun
    );
    run_viz(regl, store, catArgsManager, camerasManager);
  }

  getTooltipFunction() {
    return this.#tooltip_fun;
  }
}

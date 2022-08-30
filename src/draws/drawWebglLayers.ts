import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { RootState } from "../state/store/store";
import drawAxisComponents from "./drawAxisComponents";
import drawMatrixComponents from "./drawMatrixComponents";
import drawStaticComponents from "./static/drawStaticComponents";

export default function draw_webgl_layers(
  regl: Regl,
  store: Store<RootState>,
  catArgsManager: CatArgsManager,
  camerasManager: CamerasManager
) {
  const cameras = camerasManager.getCameras();
  const state = store.getState();
  const reglProps = camerasManager.getReglProps();
  drawMatrixComponents(regl, store, cameras, reglProps);
  const draw_labels = state.labels.draw_labels;
  drawAxisComponents(regl, store, catArgsManager, cameras, "row", draw_labels);
  drawAxisComponents(regl, store, catArgsManager, cameras, "col", draw_labels);
  drawStaticComponents(regl, store, cameras);
}

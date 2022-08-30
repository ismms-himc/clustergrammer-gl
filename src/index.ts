import { Store } from "@reduxjs/toolkit";
import { select } from "d3-selection";
import { Regl } from "regl";
import { CamerasManager } from "./cameras/camerasManager";
import { CatArgsManager } from "./cats/manager/catArgsManager";
import draw_webgl_layers from "./draws/drawWebglLayers";
import initializeRegl from "./state/initialize/functions/initializeRegl";
import initializeStore from "./state/initialize/initializeStore";
import { setOpacityScale } from "./state/reducers/matrixSlice";
import { NetworkState } from "./state/reducers/networkSlice";
import { RootState, store } from "./state/store/store";
import { createCanvasContainer } from "./ui/functions/createCanvasContainer";
import { UI } from "./ui/ui";
import { CANVAS_CONTAINER_CLASSNAME } from "./ui/ui.const";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat";

export type ClustergrammerInstance = {};

export type ClustergrammerProps = {
  use_hzome?: boolean;
  container: any; // no HTMLElement type? should be coming from the `typescript` package I think -- investigate
  network: NetworkState;
  width: number | string;
  height: number | string;
  showControls?: boolean;
  onClick: (row: string | null, col: string | null) => void;
  disableTooltip?: boolean;
};

const adjustOpacity =
  (
    regl: Regl,
    store: Store<RootState>,
    catArgsManager: CatArgsManager,
    camerasManager: CamerasManager
  ) =>
  (opacity: number) => {
    store.dispatch(setOpacityScale(opacity));
    draw_webgl_layers(regl, store, catArgsManager, camerasManager);
  };

function clustergrammer_gl(
  args: ClustergrammerProps
): ClustergrammerInstance | null {
  const { container, showControls = true, width, height, onClick } = args;

  // check if container is defined
  if (
    container !== null &&
    select(container).select(`.${CANVAS_CONTAINER_CLASSNAME}`).empty()
  ) {
    // create a container for the webGL canvas
    const canvas_container = createCanvasContainer(container, width, height);

    // initialize REGL manager
    // NOTE: this must be done before anything else,
    // all renders and the store initialization depends on it
    const regl = initializeRegl(canvas_container);

    // initialize store defaults now that we have a REGL instance
    // NOTE: do this before any components, as the components access
    // the state
    initializeStore(regl, args, store);

    // initialize components
    const camerasManager = new CamerasManager(regl, store);
    const catArgsManager = new CatArgsManager(regl, store);

    // set up the UI
    const ui = new UI({
      regl,
      store,
      camerasManager,
      catArgsManager,
      container,
      vizWidth: width,
      vizHeight: height,
      showControls,
    });

    // zoom rules
    zoom_rules_high_mat(regl, store, catArgsManager, camerasManager, onClick);

    return {
      cameras: camerasManager,
      ui, // should we actually return this? (should it even be a class or just a function?)
      adjustOpacity: adjustOpacity(regl, store, catArgsManager, camerasManager),
    };
  }
  return null;
}
export default clustergrammer_gl;

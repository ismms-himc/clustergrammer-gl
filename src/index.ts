import * as d3 from "d3";
import { Regl } from "regl";
import { CamerasManager } from "./cameras/camerasManager.js";
import { CatArgsManager } from "./cats/manager/catArgsManager.js";
import draw_webgl_layers from "./draws/drawWebglLayers.js";
import initializeRegl from "./state/initialize/functions/initializeRegl.js";
import initializeStore from "./state/initialize/initializeStore.js";
import { setOpacityScale } from "./state/reducers/matrixSlice.js";
import { NetworkState } from "./state/reducers/networkSlice.js";
import { store } from "./state/store/store.js";
import { createCanvasContainer } from "./ui/functions/createCanvasContainer.js";
import { CANVAS_CONTAINER_CLASSNAME } from "./ui/ui.const.js";
import { UI } from "./ui/ui.js";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat.js";

export type ClustergrammerInstance = {};

export type ClustergrammerProps = {
  use_hzome?: boolean;
  container: any; // no HTMLElement type? should be coming from the `typescript` package I think -- investigate
  network: NetworkState;
  viz_width: number | string;
  viz_height: number | string;
  showControls?: boolean;
};

const adjustOpacity =
  (
    regl: Regl,
    catArgsManager: CatArgsManager,
    camerasManager: CamerasManager
  ) =>
  (opacity: number) => {
    setOpacityScale(opacity);
    draw_webgl_layers(regl, store, catArgsManager, camerasManager);
  };

function clustergrammer_gl(
  args: ClustergrammerProps
): ClustergrammerInstance | null {
  const {
    container,
    showControls = true,
    viz_width: width,
    viz_height: height,
  } = args;

  // check if container is defined
  if (
    container !== null &&
    d3.select(container).select(`.${CANVAS_CONTAINER_CLASSNAME}`).empty()
  ) {
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
    zoom_rules_high_mat(
      regl,
      store,
      catArgsManager,
      camerasManager,
      ui.getTooltipFunction()
    );

    return {
      cameras: camerasManager,
      ui, // should we actually return this? (should it even be a class or just a function?)
      adjustOpacity: adjustOpacity(regl, catArgsManager, camerasManager),
    };
  }
  return null;
}
export default clustergrammer_gl;

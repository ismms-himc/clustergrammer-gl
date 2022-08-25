import * as d3 from "d3";
import { throttle } from "lodash";
import { Regl } from "regl";
import { CamerasManager } from "./cameras/camerasManager";
import { CatArgsManager } from "./cats/manager/catArgsManager";
import { createCanvasContainer } from "./createCanvasContainer";
import draw_webgl_layers from "./draws/drawWebglLayers";
import initializeRegl from "./params/initializeRegl";
import initializeStore from "./params/initializeStore";
import { saveState } from "./state/localStorageHelpers";
import { setOpacityScale } from "./state/reducers/matrixSlice";
import { NetworkState } from "./state/reducers/networkSlice";
import { store } from "./state/store/store";
import { UI } from "./ui/ui";
import { CANVAS_CONTAINER_CLASSNAME } from "./ui/ui.const";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat";

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
  (opacity_scale: number) => {
    setOpacityScale(opacity_scale);
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

    // Save game data to localStorage periodically
    store.subscribe(
      throttle(() => {
        saveState(store.getState());
      }, 5000)
    );

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

import { throttle } from "lodash";
import { CamerasManager } from "./cameras/camerasManager";
import { CatArgsManager } from "./cats/manager/catArgsManager";
import draw_webgl_layers from "./draws/drawWebglLayers";
import initializeRegl from "./params/initializeRegl";
import initializeStore from "./params/initializeStore";
import { saveState } from "./state/localStorageHelpers";
import { setOpacityScale } from "./state/reducers/matrixSlice";
import { NetworkState } from "./state/reducers/networkSlice";
import { store } from "./state/store/store";
import { UI } from "./ui/ui";
import zoom_rules_high_mat from "./zoom/zoomRulesHighMat";

export type ClustergrammerInstance = {};

export type ClustergrammerProps = {
  use_hzome?: boolean;
  container: any; // no HTMLElement type? should be coming from the `typescript` package I think -- investigate
  network: NetworkState;
  width: number | string;
  height: number | string;
  showControls?: boolean;
};

function clustergrammer_gl(
  args: ClustergrammerProps
): ClustergrammerInstance | null {
  const { container, showControls = true, width, height } = args;
  // check if container is defined
  if (container !== null) {
    // initialize REGL
    // NOTE: this must be done before anything else,
    // all renders and the store initialization depends on it
    const regl = initializeRegl(container);

    // initialize store defaults now that we have a REGL instance
    // NOTE: do this before any components, as the components access
    // the state
    // TODO: are we sure that all redux calls complete before we need acccess to the data?
    initializeStore(regl, args, store);

    // Save game data to localStorage periodically
    store.subscribe(
      throttle(() => {
        saveState(store.getState());
      }, 5000)
    );

    // initialize components
    const cameras = new CamerasManager(regl, store);
    const catArgsManager = new CatArgsManager(regl, store);
    const ui = new UI(
      regl,
      store,
      cameras,
      catArgsManager,
      container,
      width,
      height,
      showControls
    );
    function adjustOpacity(opacity_scale: number) {
      setOpacityScale(opacity_scale);
      const state = store.getState();
      draw_webgl_layers(regl, state, catArgsManager, cameras);
    }

    // zoom rules
    zoom_rules_high_mat(
      regl,
      store.getState(),
      store.dispatch,
      catArgsManager,
      cameras.getCameras(),
      ui.getTooltipFunction()
    );

    return {
      cameras,
      ui, // should we actually return this? (should it even be a class or just a function?)
      adjustOpacity,
    };
  }
  return null;
}
export default clustergrammer_gl;

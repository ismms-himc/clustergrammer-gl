import { mutateAnimationState } from "../../state/reducers/animation/animationSlice.js";
import { mutateInteractionState } from "../../state/reducers/interaction/interactionSlice.js";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice.js";
import ini_zoom_data from "../../state/reducers/visualization/helpers/iniZoomData.js";
import { mutateVisualizationState } from "../../state/reducers/visualization/visualizationSlice.js";
import make_cameras from "./makeCameras.js";

export default function reset_cameras(regl, store) {
  const dispatch = store.dispatch;
  dispatch(
    mutateVisualizationState({
      reset_cameras: false,
    })
  );
  const initial_zoom_data = ini_zoom_data();
  const cameras = make_cameras(regl, store);

  dispatch(mutateLabelsState({ draw_labels: false }));
  dispatch(mutateAnimationState({ ini_viz: true }));
  dispatch(mutateInteractionState({ total: 0 }));

  return { cameras, zoom_data: initial_zoom_data };
}

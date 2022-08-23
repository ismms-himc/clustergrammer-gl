import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../../state/reducers/interaction/interactionSlice";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice";
import ini_zoom_data from "../../state/reducers/visualization/helpers/iniZoomData";
import { mutateVisualizationState } from "../../state/reducers/visualization/visualizationSlice";
import make_cameras from "./makeCameras";

export default function reset_cameras(regl, state, dispatch) {
  const {
    visualization: { viz_dim },
    interaction: { enable_viz_interact },
  } = state;
  dispatch(
    mutateVisualizationState({
      reset_cameras: false,
    })
  );
  const initial_zoom_data = ini_zoom_data();
  const cameras = make_cameras(
    regl,
    initial_zoom_data,
    viz_dim,
    enable_viz_interact
  );

  dispatch(mutateLabelsState({ draw_labels: false }));
  dispatch(mutateAnimationState({ ini_viz: true }));
  dispatch(mutateInteractionState({ total: 0 }));

  return { cameras, zoom_data: initial_zoom_data };
}

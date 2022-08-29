import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../../state/reducers/interaction/interactionSlice";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice";
import ini_zoom_data from "../../state/reducers/visualization/helpers/iniZoomData";
import {
  mutateVisualizationState,
  mutateZoomData,
} from "../../state/reducers/visualization/visualizationSlice";
import make_cameras from "./makeCameras";

export default function reset_cameras(regl, store) {
  const dispatch = store.dispatch;
  dispatch(
    mutateVisualizationState({
      reset_cameras: false,
    })
  );

  dispatch(mutateZoomData(ini_zoom_data()));
  const cameras = make_cameras(regl, store);
  dispatch(mutateLabelsState({ draw_labels: false }));
  dispatch(mutateAnimationState({ ini_viz: true }));
  dispatch(mutateInteractionState({ total: 0 }));

  return cameras;
}

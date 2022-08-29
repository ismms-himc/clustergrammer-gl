import { Store } from "@reduxjs/toolkit";
import * as d3 from "d3";
import { Regl } from "regl";
import { CamerasManager } from "../../../cameras/camerasManager.js";
import { CatArgsManager } from "../../../cats/manager/catArgsManager.js";
import drawInteracting from "../../../draws/drawInteracting.js";
import { mutateAnimationState } from "../../../state/reducers/animation/animationSlice.js";
import { mutateInteractionState } from "../../../state/reducers/interaction/interactionSlice.js";
import { RootState } from "../../../state/store/store.js";
import draw_background_calculations from "../drawBackgroundCalculations.js";
import draw_labels_tooltips_or_dendro from "../drawLabelsTooltipsOrDendro.js";
import drawMouseover from "../mouseover/drawMouseover.js";
import end_animation from "./endAnimation.js";
import start_animation from "./startAnimation.js";

export default function run_viz(
  regl: Regl,
  store: Store<RootState>,
  catArgsManager: CatArgsManager,
  camerasManager: CamerasManager
) {
  const dispatch = store.dispatch;
  dispatch(
    mutateAnimationState({
      first_frame: true,
    })
  );
  // function to run on every frame
  regl.frame(function ({ time }) {
    dispatch(
      mutateAnimationState({
        time,
      })
    );
    const firstState = store.getState();
    if (firstState.interaction.total > 1) {
      d3.selectAll(
        firstState.visualization.rootElementId + " .group-svg-tooltip"
      ).remove();
    }

    // prevent this from being negative, can happen when resetting zoom
    if (firstState.interaction.total < 0) {
      dispatch(mutateInteractionState({ total: 0 }));
    }
    if (firstState.visualization.reset_cameras) {
      // reset cameras mutates zoom data
      camerasManager.resetCameras(store);
    }

    const thirdState = store.getState();
    if (thirdState.animation.run_animation) {
      // modifies animation duration end
      start_animation(store);
    } else if (
      thirdState.animation.time > thirdState.animation.duration_end &&
      thirdState.animation.running === true
    ) {
      end_animation(regl, store, catArgsManager, camerasManager);
    }

    const fourthState = store.getState();
    if (
      fourthState.interaction.still_interacting === true ||
      fourthState.animation.ini_viz === true ||
      fourthState.animation.running === true ||
      fourthState.animation.update_viz === true
    ) {
      drawInteracting(regl, store, catArgsManager, camerasManager);
      dispatch(mutateAnimationState({ update_viz: false }));
    } else if (fourthState.interaction.still_mouseover === true) {
      // mouseover may result in draw command
      drawMouseover(store);
      draw_background_calculations(store);
    } else if (
      fourthState.labels.draw_labels ||
      fourthState.tooltip.show_tooltip ||
      fourthState.dendro.update_dendro
    ) {
      draw_labels_tooltips_or_dendro(
        regl,
        store,
        catArgsManager,
        camerasManager
      );
    } else {
      // run background calculations
      draw_background_calculations(store);
    }
  });
}

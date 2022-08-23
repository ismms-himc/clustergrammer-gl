import { Store } from "@reduxjs/toolkit";
import * as d3 from "d3";
import { Regl } from "regl";
import { CamerasManager } from "../../cameras/camerasManager";
import { CatArgsManager } from "../../cats/manager/catArgsManager";
import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../../state/reducers/interaction/interactionSlice";
import { RootState } from "../../state/store/store";
import draw_background_calculations from "./drawBackgroundCalculations";
import draw_labels_tooltips_or_dendro from "./drawLabelsTooltipsOrDendro";
import draw_mouseover from "./drawMouseover";
import end_animation from "./endAnimation";
import start_animation from "./startAnimation";

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
    const state = store.getState();
    dispatch(
      mutateAnimationState({
        time,
      })
    );
    if (state.interaction.total > 1) {
      d3.selectAll(
        state.visualization.rootElementId + " .group-svg-tooltip"
      ).remove();
    }
    // prevent this from being negative, can happen when resetting zoom
    if (state.interaction.total < 0) {
      dispatch(mutateInteractionState({ total: 0 }));
    }
    if (state.visualization.reset_cameras) {
      camerasManager.resetCameras(store);
    }
    if (state.animation.run_animation) {
      start_animation(state, dispatch);
    } else if (
      state.animation.time > state.animation.duration_end &&
      state.animation.running === true
    ) {
      end_animation(state, dispatch, catArgsManager);
    }
    if (
      state.interaction.still_interacting === true ||
      state.animation.ini_viz === true ||
      state.animation.running === true ||
      state.animation.update_viz === true
    ) {
      state.animation.update_viz = false;
    } else if (state.interaction.still_mouseover === true) {
      // mouseover may result in draw command
      draw_mouseover(regl, state);
      draw_background_calculations(regl, state);
    } else if (
      state.labels.draw_labels ||
      state.tooltip.show_tooltip ||
      state.dendro.update_dendro
    ) {
      draw_labels_tooltips_or_dendro(
        regl,
        state,
        dispatch,
        catArgsManager,
        camerasManager.getCameras()
      );
    } else {
      // run background calculations
      draw_background_calculations(regl, state);
    }
  });
}

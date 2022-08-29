import { mutateAnimationState } from "../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import { mutateTooltipState } from "../state/reducers/tooltip/tooltipSlice";
import run_hide_tooltip from "../tooltip/runHideTooltip";
import runShowTooltip from "../tooltip/runShowTooltip";

export default function singleClicking(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun
) {
  const dispatch = store.dispatch;
  const state = store.getState();

  dispatch(mutateAnimationState({ last_click: state.animation.time }));
  dispatch(mutateInteractionState({ manual_update_cats: false }));
  run_hide_tooltip(store, tooltip_fun, true);
  if (state.tooltip?.tooltip_type.includes("-dendro")) {
    if (state.tooltip.permanent_tooltip === false) {
      runShowTooltip(regl, store, catArgsManager, camerasManager);
      dispatch(mutateTooltipState({ permanent_tooltip: true }));
    }
  }
}

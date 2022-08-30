import { Store } from "@reduxjs/toolkit";
import { mutateAnimationState } from "../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import { RootState } from "../state/store/store";

export default function singleClicking(store: Store<RootState>) {
  const dispatch = store.dispatch;
  const state = store.getState();

  dispatch(mutateAnimationState({ last_click: state.animation.time }));
  dispatch(mutateInteractionState({ manual_update_cats: false }));
  if (state.tooltip?.tooltip_type.includes("-dendro")) {
    if (state.tooltip.permanent_tooltip === false) {
      // TODO: do whatever we want to do when clicking the dendrogram
    }
  }
}

import { Dispatch } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { Cameras } from "../../cameras/cameras";
import { CatArgsManager } from "../../cats/manager/catArgsManager";
import drawCommands from "../../draws/drawCommands";
import { mutateDendrogramState } from "../../state/reducers/dendrogramSlice";
import { mutateInteractionState } from "../../state/reducers/interaction/interactionSlice";
import { mutateTooltipState } from "../../state/reducers/tooltip/tooltipSlice";
import { RootState } from "../../state/store/store";

export default function draw_labels_tooltips_or_dendro(
  regl: Regl,
  state: RootState,
  dispatch: Dispatch,
  catArgsManager: CatArgsManager,
  cameras: Cameras
) {
  // turn back on draw_labels
  // /////////////////////////////
  const { need_reset_cat_opacity } = drawCommands(
    regl,
    state,
    catArgsManager,
    cameras
  );
  dispatch(
    mutateInteractionState({
      need_reset_cat_opacity,
    })
  );
  if (state.tooltip.show_tooltip) {
    dispatch(
      mutateTooltipState({
        show_tooltip: false,
      })
    );
  }
  // turn back off draw dendro
  if (state.dendro.update_dendro) {
    dispatch(
      mutateDendrogramState({
        update_dendro: false,
      })
    );
  }
}

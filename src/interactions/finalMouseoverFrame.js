import { mutateTooltipState } from "../state/reducers/tooltip/tooltipSlice";
import { setTotalMouseover } from "../state/reducers/visualization/visualizationSlice";

export default (function finalMouseoverFrame(store) {
  // reduce the number of mouseovers
  store.dispatch(
    setTotalMouseover(
      store.getState().visualization.zoom_data.x.total_mouseover - 1
    )
  );
  const state = store.getState();
  if (
    state.visualization.zoom_data.x.total_mouseover === 0 &&
    state.interaction.still_mouseover === false
  ) {
    store.dispatch(
      mutateTooltipState({
        show_tooltip: true,
      })
    );
  }
});

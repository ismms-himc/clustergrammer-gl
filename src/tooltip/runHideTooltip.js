import { mutateCategoriesState } from "../state/reducers/categoriesSlice";
import { mutateTooltipState } from "../state/reducers/tooltip/tooltipSlice";

export default (function run_hide_tooltip(
  store,
  tooltip_fun,
  click_on_heatmap = false
) {
  const { tooltip } = store.getState();
  if (tooltip.permanent_tooltip === false) {
    tooltip_fun.hide();
  }
  if (click_on_heatmap) {
    store.dispatch(
      mutateTooltipState({
        permanent_tooltip: false,
      })
    );
    tooltip_fun.hide();
  }

  store.dispatch(mutateCategoriesState({ showing_color_picker: false }));
});

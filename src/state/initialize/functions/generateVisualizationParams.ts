import { Store } from "@reduxjs/toolkit";
import { scaleLinear } from "d3-scale";
import calcVizArea from "../../../params/calcVizArea";
import iniZoomRestrict from "../../../zoom/iniZoomRestrict";
import { mutateVisualizationState } from "../../reducers/visualization/visualizationSlice";
import { RootState } from "../../store/store";
import generateTextTriangleParams from "./generateTextTriangleParams";
import initializeTextZoom from "./initializeTextZoom";

export default function generateVisualizationParams(
  store: Store<RootState>,
  rootElementId: string
) {
  const {
    visualization: { viz_dim },
    labels,
  } = store.getState();
  let min_dim;
  if (labels.num_col < labels.num_row) {
    min_dim = labels.num_col;
  } else {
    min_dim = labels.num_row;
  }
  const max_zoom = min_dim / 4.0;
  initializeTextZoom(store);
  // TODO: this used to be in state, should it still be?
  const viz_area = calcVizArea(store);
  generateTextTriangleParams(store, viz_area);
  const zoom_restrict = iniZoomRestrict(max_zoom, labels, viz_dim);
  const allow_factor = scaleLinear().domain([10, 1000]).range([2, 30]);
  const allow_zoom = {
    col: allow_factor(labels.num_col),
    row: allow_factor(labels.num_row),
  };

  const tile_pix_width = viz_dim.heat.width / labels.num_col;
  const tile_pix_height = viz_dim.heat.height / labels.num_row;
  store.dispatch(
    mutateVisualizationState({
      zoom_restrict,
      allow_zoom,
      tile_pix_width,
      tile_pix_height,
      rootElementId,
    })
  );
}

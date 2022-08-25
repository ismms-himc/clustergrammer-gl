import { Store } from "@reduxjs/toolkit";
import * as d3 from "d3";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";
import iniZoomRestrict from "../zoom/iniZoomRestrict";
import calcVizArea from "./calcVizArea";
import generateTextTriangleParams from "./generateTextTriangleParams";
import genTextZoomPar from "./genTextZoomPar";

export default function generateVisualizationParams(store: Store<RootState>) {
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
  genTextZoomPar(store);
  // TODO: this used to be in state, should it still be?
  const viz_area = calcVizArea(store);
  generateTextTriangleParams(store, viz_area);
  const zoom_restrict = iniZoomRestrict(max_zoom, labels, viz_dim);
  const allow_factor = d3.scaleLinear().domain([10, 1000]).range([2, 30]);
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
    })
  );
}

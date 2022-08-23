import * as d3 from "d3";
import { TextTriangles } from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";
import iniZoomRestrict from "../zoom/iniZoomRestrict";
import calcVizArea from "./calcVizArea";
import generateTextTriangleParams from "./generateTextTriangleParams";
import genTextZoomPar from "./genTextZoomPar";

export default function generateVisualizationParams(state: RootState) {
  const {
    visualization: { viz_dim },
    labels,
  } = state;
  const tile_pix_width = viz_dim.heat.width / labels.num_col;
  const tile_pix_height = viz_dim.heat.height / labels.num_row;
  let min_dim;
  if (labels.num_col < labels.num_row) {
    min_dim = labels.num_col;
  } else {
    min_dim = labels.num_row;
  }
  const max_zoom = min_dim / 4.0;
  const text_zoom = genTextZoomPar(labels);
  const { viz_area, visible_labels } = calcVizArea(state);
  const {
    text_triangles,
    precalc: labelsPrecalc,
    label_queue_high: lqh,
  } = generateTextTriangleParams(state);
  const zoom_restrict = iniZoomRestrict(max_zoom, labels, viz_dim);
  const allow_factor = d3.scaleLinear().domain([10, 1000]).range([2, 30]);
  const allow_zoom = {
    col: allow_factor(labels.num_col),
    row: allow_factor(labels.num_row),
  };

  return {
    visualizationParams: {
      viz_dim,
      tile_pix_width,
      tile_pix_height,
      max_zoom,
      text_zoom,
      viz_area,
      text_triangles: text_triangles as TextTriangles,
      zoom_restrict,
      allow_zoom,
    },
    labelsParams: {
      visible_labels,
      labelsPrecalc,
      lqh,
    },
  };
}

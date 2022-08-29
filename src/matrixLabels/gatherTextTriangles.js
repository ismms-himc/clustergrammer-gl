import { cloneDeep } from "lodash";
import * as _ from "underscore";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice.js";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice.js";

import vectorize_label from "./vectorizeLabel.js";

export default function gather_text_triangles(store, viz_area, inst_axis) {
  const {
    visualization: { text_triangles: oldTextTriangles },
    labels: oldLabels,
    network,
  } = store.getState();

  const labels = cloneDeep(oldLabels);
  let text_triangles = {
    ...cloneDeep(oldTextTriangles),
    draw: {
      ...oldTextTriangles.draw,
      [inst_axis]: [...(oldTextTriangles.draw[inst_axis] || [])],
    },
  };

  let inst_dim;
  if (inst_axis === "col") {
    inst_dim = "x";
  } else {
    inst_dim = "y";
  }
  // generating array with text triangles and y-offsets
  const min_viz = viz_area[inst_dim + "_min"];
  const max_viz = viz_area[inst_dim + "_max"];
  _.each(network[inst_axis + "_nodes"], function (inst_label) {
    if (
      inst_label.offsets.inst > min_viz &&
      inst_label.offsets.inst < max_viz
    ) {
      let inst_name = inst_label.name;
      if (inst_name.indexOf(": ") >= 0) {
        inst_name = inst_label.name.split(": ")[1];
      }
      let inst_text_vect;
      if (inst_name in text_triangles[inst_axis]) {
        // add to text_triangles.draw if pre-calculated
        inst_text_vect = {
          ...text_triangles[inst_axis][inst_name],
          inst_offset: [0, inst_label.offsets.inst],
          new_offset: [0, inst_label.offsets.new],
        };
        text_triangles.draw[inst_axis].push(inst_text_vect);
      } else {
        store.dispatch(
          mutateLabelsState({
            labels_queue: {
              high: {
                [inst_axis]: [
                  ...(labels.labels_queue.high[inst_axis] || []),
                  inst_name,
                ],
              },
            },
          })
        );

        /*
          moved text triangle calculations to background, unless pre-calc
        */
        if (labels.precalc[inst_axis]) {
          // calculate text vector
          inst_text_vect = {
            ...vectorize_label(store, inst_axis, inst_name),
          };
          text_triangles = {
            ...text_triangles,
            [inst_axis]: {
              ...text_triangles[inst_axis],
              [inst_name]: inst_text_vect,
            },
          };
          inst_text_vect = {
            ...inst_text_vect,
            inst_offset: [0, inst_label.offsets.inst],
            new_offset: [0, inst_label.offsets.new],
          };
          text_triangles.draw[inst_axis].push(inst_text_vect);
        }
      }
    }
  });

  store.dispatch(
    mutateVisualizationState({
      text_triangles,
    })
  );

  // labels updates
  store.dispatch(
    mutateLabelsState({
      labels_queue: {
        high: {
          [inst_axis]: labels.labels_queue.high[inst_axis],
        },
      },
    })
  );
}

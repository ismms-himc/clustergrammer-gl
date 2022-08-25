import { Store } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { Regl } from "regl";
import * as _ from "underscore";
import { ClustergrammerProps } from "..";
import generateCatVizInfo from "../cats/generateCatVizInfo";
import calcTextOffsets from "../matrixLabels/calcTextOffsets";
import makeLabelQueue from "../matrixLabels/makeLabelQueue";
import {
  LabelsState,
  setLabelsOffsetDict,
} from "../state/reducers/labels/labelsSlice";
import { NetworkState, setNetworkState } from "../state/reducers/networkSlice";
import {
  NodeCanvasPos,
  setNodeCanvasPos,
} from "../state/reducers/nodeCanvasPosSlice";
import { setTooltipState } from "../state/reducers/tooltip/tooltipSlice";
import calcVizDim from "../state/reducers/visualization/helpers/calcVizDim";
import { RootState } from "../state/store/store";
import { NetworkDataNode } from "../types/network";
import calcAlphaOrder from "./calcAlphaOrder";
import calcMatArr from "./calcMatArr";
import calcRowAndColCanvasPositions from "./calcRowAndColCanvasPositions";
import genCatPar from "./genCatPar";
import genDendroPar from "./genDendroPar";
import generateVisualizationParams from "./generateVisualizationParams";
import genLabelPar from "./genLabelPar";
import getInitialOrderState from "./getInitialOrderState";
import setCatVizMatrixColors from "./setCatVizMatrixColors";

export default function initialize_params(
  regl: Regl,
  args: ClustergrammerProps,
  store: Store<RootState>
) {
  const rootElementId = "#" + args.container.id;

  // cat_data setup
  genCatPar(store);

  // network setup
  const initialNetwork = args.network;
  // alpha ordering
  const networkWithAlphaOrdering = calcAlphaOrder(initialNetwork);
  // normalization state
  const norm: NetworkState["norm"] = {
    initial_status: "non-zscored",
    zscore_status: "non-zscored",
  };
  const baseNetwork = merge(initialNetwork, networkWithAlphaOrdering);
  if ("pre_zscore" in baseNetwork) {
    norm.initial_status = "zscored";
    norm.zscore_status = "zscored";
  }
  store.dispatch(
    setNetworkState({
      ...baseNetwork,
      norm,
      // fix initial ordering indexing (will fix in Python on nex release)
      row_nodes: baseNetwork.row_nodes.map((x: NetworkDataNode) => ({
        ...x,
        ini: (x.ini || 0) - 1,
      })),
      col_nodes: baseNetwork.col_nodes.map((x: NetworkDataNode) => ({
        ...x,
        ini: (x.ini || 0) - 1,
      })),
    })
  );

  // order setup
  getInitialOrderState(store);

  // labels setup
  genLabelPar(store);

  // category viz data setup
  generateCatVizInfo(store);

  // visualization dimensions setup
  calcVizDim(regl, store.getState());

  // tooltip setup
  store.dispatch(
    setTooltipState({
      ...store.getState().tooltip,
      use_hzome: args.use_hzome || false,
      tooltip_id: "#d3-tip_" + rootElementId.replace("#", ""),
    })
  );

  // row and col canvas positions setup
  calcRowAndColCanvasPositions(store);

  // labels offset dict setup
  const offset_dict: Record<string, any> = {};
  _.each(["row", "col"], function (inst_axis) {
    offset_dict[inst_axis] = calcTextOffsets(store, inst_axis);
  });
  store.dispatch(
    setLabelsOffsetDict(offset_dict as LabelsState["offset_dict"])
  );

  // labels setup
  makeLabelQueue(store);

  // visualization setup
  generateVisualizationParams(store);

  // node canvas pos
  store.dispatch(setNodeCanvasPos(calcMatArr(store) as NodeCanvasPos));

  // matrix color parameters
  setCatVizMatrixColors(store);

  // dendrogram state
  genDendroPar(store);
}

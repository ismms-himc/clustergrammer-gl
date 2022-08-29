import { Store } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { Regl } from "regl";
import * as _ from "underscore";
import { ClustergrammerProps } from "../../index.js";
import calcTextOffsets from "../../matrixLabels/calcTextOffsets.js";
import makeLabelQueue from "../../matrixLabels/makeLabelQueue.js";
import { NetworkDataNode } from "../../types/network.js";
import {
  LabelsState,
  setLabelsOffsetDict
} from "../reducers/labels/labelsSlice.js";
import { NetworkState, setNetworkState } from "../reducers/networkSlice.js";
import {
  NodeCanvasPos,
  setNodeCanvasPos
} from "../reducers/nodeCanvasPosSlice.js";
import { setTooltipState } from "../reducers/tooltip/tooltipSlice.js";
import { RootState } from "../store/store.js";
import calcAlphaOrder from "./functions/calcAlphaOrder.js";
import calcMatArr from "./functions/calcMatArr.js";
import calcRowAndColCanvasPositions from "./functions/calcRowAndColCanvasPositions.js";
import calcVizDim from "./functions/calcVizDim.js";
import genCatPar from "./functions/genCatPar.js";
import generateCatVizInfo from "./functions/generateCatVizInfo.js";
import generateVisualizationParams from "./functions/generateVisualizationParams.js";
import getInitialOrderState from "./functions/getInitialOrderState.js";
import initializeDendrogramState from "./functions/initializeDendrogramState.js";
import initializeLabels from "./functions/initializeLabels.js";
import setCatVizMatrixColors from "./functions/setCatVizMatrixColors.js";

export default function initialize_params(
  regl: Regl,
  args: ClustergrammerProps,
  store: Store<RootState>
) {
  const rootElementId = "#" + args.container.id;

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

  // cat_data setup
  genCatPar(store);

  // order setup
  getInitialOrderState(store);

  // labels setup
  initializeLabels(store);

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
  initializeDendrogramState(store);
}

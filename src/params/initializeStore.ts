import { Store } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { Regl } from "regl";
import * as _ from "underscore";
import { ClustergrammerProps } from "..";
import generateCatVizInfo from "../cats/generateCatVizInfo";
import calcTextOffsets from "../matrixLabels/calcTextOffsets";
import makeLabelQueue from "../matrixLabels/makeLabelQueue";
import { mutateCategoriesState } from "../state/reducers/categoriesSlice";
import { CatVizState, mutateCatVizState } from "../state/reducers/catVizSlice";
import {
  DendrogramState,
  setDendrogramState,
} from "../state/reducers/dendrogramSlice";
import {
  LabelsState,
  mutateLabelsState,
  setLabelsOffsetDict,
  setLabelsState,
} from "../state/reducers/labels/labelsSlice";
import { NetworkState, setNetworkState } from "../state/reducers/networkSlice";
import {
  NodeCanvasPos,
  setNodeCanvasPos,
} from "../state/reducers/nodeCanvasPosSlice";
import { OrderState, setOrderState } from "../state/reducers/order/orderSlice";
import { setRowAndColCanvasPositions } from "../state/reducers/rowAndColCanvasPositionsSlice";
import { setTooltipState } from "../state/reducers/tooltip/tooltipSlice";
import calcVizDim from "../state/reducers/visualization/helpers/calcVizDim";
import {
  mutateVisualizationState,
  setVisualizationDimensions,
  VisualizationDimensions,
} from "../state/reducers/visualization/visualizationSlice";
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
  store.dispatch(mutateCategoriesState(genCatPar(store.getState())));

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
  store.dispatch(
    setOrderState(getInitialOrderState(store.getState().network) as OrderState)
  );

  // labels setup
  const labelsParams = genLabelPar(store.getState());
  store.dispatch(
    mutateLabelsState({
      ...labelsParams.labels,
      ordered_labels: labelsParams.ordered_labels,
    })
  );

  // category viz data setup
  store.dispatch(
    mutateCatVizState(
      generateCatVizInfo(store.getState().network) as CatVizState
    )
  );

  // camera state setup
  store.dispatch(
    setVisualizationDimensions(
      calcVizDim(regl, store.getState()) as unknown as VisualizationDimensions
    )
  );

  // tooltip setup
  store.dispatch(
    setTooltipState({
      ...store.getState().tooltip,
      use_hzome: args.use_hzome || false,
      tooltip_id: "#d3-tip_" + rootElementId.replace("#", ""),
    })
  );

  // row and col canvas positions setup
  const rowAndColCanvasPositions = calcRowAndColCanvasPositions(
    store.getState()
  );
  store.dispatch(setRowAndColCanvasPositions(rowAndColCanvasPositions));

  // labels offset dict setup
  const offset_dict: Record<string, any> = {};
  _.each(["row", "col"], function (inst_axis) {
    offset_dict[inst_axis] = calcTextOffsets(
      store.getState(),
      store.dispatch,
      inst_axis
    );
  });
  store.dispatch(
    setLabelsOffsetDict(offset_dict as LabelsState["offset_dict"])
  );

  // visualization setup
  const { visualizationParams, labelsParams: visualizationLabelsParams } =
    generateVisualizationParams(store.getState());
  store.dispatch(
    mutateVisualizationState({
      ...visualizationParams,
      rootElementId,
    })
  );

  // labels setup
  const labels_queue = makeLabelQueue(store.getState().labels);
  const label_queue_high = visualizationLabelsParams.lqh as
    | undefined
    | Record<string, string[]>;
  store.dispatch(
    setLabelsState({
      ...store.getState().labels,
      labels_queue: (label_queue_high && label_queue_high.length
        ? {
            ...merge(labels_queue, {
              high: label_queue_high,
            }),
          }
        : labels_queue) as LabelsState["labels_queue"],
      visible_labels:
        visualizationLabelsParams.visible_labels as LabelsState["visible_labels"],
      precalc: visualizationLabelsParams.labelsPrecalc,
    })
  );

  // node canvas pos
  store.dispatch(
    setNodeCanvasPos(calcMatArr(store.getState()) as NodeCanvasPos)
  );

  // matrix color parameters
  setCatVizMatrixColors(store.getState(), store.dispatch);

  // dendrogram state
  store.dispatch(
    setDendrogramState(
      genDendroPar(store.getState()) as unknown as DendrogramState
    )
  );
}

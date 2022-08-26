import { configureStore } from "@reduxjs/toolkit";
import matrixReducer from "../../state/reducers/matrixSlice";
import animationReducer from "../reducers/animation/animationSlice";
import arrsReducer from "../reducers/arrsSlice";
import categoriesReducer from "../reducers/categoriesSlice";
import catVizReducer from "../reducers/catVizSlice";
import dendrogramReducer from "../reducers/dendrogramSlice";
import downloadReducer from "../reducers/downloadSlice";
import interactionReducer from "../reducers/interaction/interactionSlice";
import labelsReducer from "../reducers/labels/labelsSlice";
import networkReducer from "../reducers/networkSlice";
import nodeCanvasPosReducer from "../reducers/nodeCanvasPosSlice";
import orderReducer from "../reducers/order/orderSlice";
import rowAndColCanvasPositionsReducer from "../reducers/rowAndColCanvasPositionsSlice";
import searchReducer from "../reducers/searchSlice";
import tooltipReducer from "../reducers/tooltip/tooltipSlice";
import uiReducer from "../reducers/uiSlice";
import visualizationReducer from "../reducers/visualization/visualizationSlice";

export const store = configureStore({
  reducer: {
    network: networkReducer,
    ui: uiReducer,
    matrix: matrixReducer,
    dendro: dendrogramReducer,
    download: downloadReducer,
    animation: animationReducer,
    order: orderReducer,
    cat_data: categoriesReducer,
    interaction: interactionReducer,
    tooltip: tooltipReducer,
    labels: labelsReducer,
    cat_viz: catVizReducer,
    rowAndColCanvasPositions: rowAndColCanvasPositionsReducer,
    visualization: visualizationReducer,
    node_canvas_pos: nodeCanvasPosReducer,
    search: searchReducer,
    arrs: arrsReducer,
  },
  middleware: [],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

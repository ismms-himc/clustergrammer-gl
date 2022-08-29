import { configureStore } from "@reduxjs/toolkit";
import matrixReducer from "../../state/reducers/matrixSlice.js";
import animationReducer from "../reducers/animation/animationSlice.js";
import arrsReducer from "../reducers/arrsSlice.js";
import categoriesReducer from "../reducers/categoriesSlice.js";
import catVizReducer from "../reducers/catVizSlice.js";
import dendrogramReducer from "../reducers/dendrogramSlice.js";
import downloadReducer from "../reducers/downloadSlice.js";
import interactionReducer from "../reducers/interaction/interactionSlice.js";
import labelsReducer from "../reducers/labels/labelsSlice.js";
import networkReducer from "../reducers/networkSlice.js";
import nodeCanvasPosReducer from "../reducers/nodeCanvasPosSlice.js";
import orderReducer from "../reducers/order/orderSlice.js";
import rowAndColCanvasPositionsReducer from "../reducers/rowAndColCanvasPositionsSlice.js";
import searchReducer from "../reducers/searchSlice.js";
import tooltipReducer from "../reducers/tooltip/tooltipSlice.js";
import uiReducer from "../reducers/uiSlice.js";
import visualizationReducer from "../reducers/visualization/visualizationSlice.js";

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

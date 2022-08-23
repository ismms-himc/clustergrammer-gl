import { Store } from "@reduxjs/toolkit";
import { set } from "lodash";
import { DrawConfig, Regl } from "regl";
import { RootState } from "../../state/store/store";
import { Axis } from "../../types/general";
import generate_cat_args_arrs from "./generateCatArgsArrs";
import makeCatPositionArray from "./makeCatPositionArray";

export type CatArrsAxis = Array<number[][]>;

export type CatArrsType = {
  row: CatArrsAxis;
  col: CatArrsAxis;
};

export type CatArrs = {
  inst: CatArrsType;
  new: CatArrsType;
};

export type CatArgs = {
  row: DrawConfig[];
  col: DrawConfig[];
};

export class CatArgsManager {
  #regl: Regl;
  #catArgs: CatArgs;
  #catArrs: CatArrs;

  constructor(regl: Regl, store: Store<RootState>) {
    const state = store.getState();
    this.#regl = regl;
    const { cat_args, cat_arrs } = this.generateCatArgsArrs(state);
    this.#catArgs = cat_args;
    this.#catArrs = cat_arrs as CatArrs;
  }

  getCatArgs() {
    return this.#catArgs;
  }

  getCatArrs() {
    return this.#catArrs;
  }

  generateCatArgsArrs(state: RootState) {
    const { cat_args, cat_arrs } = generate_cat_args_arrs(this.#regl, state);
    return { cat_args, cat_arrs };
  }

  regenerateCatArgsArrs(state: RootState) {
    const { cat_args, cat_arrs } = this.generateCatArgsArrs(state);
    this.#catArgs = cat_args;
    this.#catArrs = cat_arrs as CatArrs;
  }

  updateNewCatArrs(state: RootState, inst_axis: string, cat_index: number) {
    const newArray = makeCatPositionArray(
      state,
      inst_axis,
      state.order.new[inst_axis]
    );
    set(this.#catArrs, ["new", inst_axis, cat_index], newArray);
  }

  updateCatArgsAttribute(inst_axis: Axis, cat_index: number) {
    const newValue = {
      buffer: this.#regl.buffer(this.#catArrs.new[inst_axis][cat_index]),
      divisor: 1,
    };
    set(
      this.#catArgs,
      [inst_axis, cat_index, "attributes", "cat_pos_att_new"],
      newValue
    );
  }
}

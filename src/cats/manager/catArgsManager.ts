import { Store } from "@reduxjs/toolkit";
import { set } from "lodash";
import { DrawConfig, Regl } from "regl";
import { RootState } from "../../state/store/store";
import generate_cat_args_arrs from "./generateCatArgsArrs";
import makeCatPositionArray from "./makeCatPositionArray";

export type CatArrsAxis = Array<number[][]>;

export type CatArrsType = {
  [x: string]: CatArrsAxis;
  row: CatArrsAxis;
  col: CatArrsAxis;
};

export type CatArrs = {
  [x: string]: CatArrsType;
  inst: CatArrsType;
  new: CatArrsType;
};

export type CatArgs = {
  [x: string]: DrawConfig[];
  row: DrawConfig[];
  col: DrawConfig[];
};

export class CatArgsManager {
  #regl: Regl;
  #catArgs: CatArgs;
  #catArrs: CatArrs;

  constructor(regl: Regl, store: Store<RootState>) {
    this.#regl = regl;
    const { cat_args, cat_arrs } = this.generateCatArgsArrs(store);
    this.#catArgs = cat_args as CatArgs;
    this.#catArrs = cat_arrs as CatArrs;
  }

  getCatArgs() {
    return this.#catArgs;
  }

  getCatArrs() {
    return this.#catArrs;
  }

  generateCatArgsArrs(store: Store<RootState>) {
    const { cat_args, cat_arrs } = generate_cat_args_arrs(this.#regl, store);
    return { cat_args, cat_arrs };
  }

  regenerateCatArgsArrs(store: Store<RootState>) {
    const { cat_args, cat_arrs } = this.generateCatArgsArrs(store);
    this.#catArgs = cat_args as CatArgs;
    this.#catArrs = cat_arrs as CatArrs;
  }

  makeNewCatArrs(
    store: Store<RootState>,
    inst_axis: string,
    cat_index: number
  ) {
    const newArray = makeCatPositionArray(store, inst_axis);
    set(this.#catArrs, ["new", inst_axis, cat_index], newArray);
  }

  updateCatArgsAttribute(inst_axis: string, cat_index: number) {
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

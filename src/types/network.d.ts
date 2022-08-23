export type Opacity = "linear" | "log";
export type Ordering = "alpha" | "clust" | "rank" | "rank_var";
export type NRowSums = "all" | string | number;
export type Distribution = "cos" | string;

export type NetworkDataNode = {
  name: string;
  clust: number;
  rank: number;
  rankvar?: number;
  group?: number[];
  ini?: number;
};
export type NetworkDataView = {
  N_row_sum?: NRowSums;
  dist: Distribution;
  nodes: {
    row_nodes: NetworkDataNode[];
    col_nodes: NetworkDataNode[];
  };
};
export type NetworkDataLink = {
  source: number;
  target: number;
  value: number;
  value_up?: boolean;
  value_dn?: boolean;
};
export type NetworkMatrixColors = {
  pos: string;
  neg: string;
};
export type NetworkData = {
  row_nodes: NetworkDataNode[];
  col_nodes: NetworkDataNode[];
  links?: NetworkDataLink[];
  mat?: number[][];
  views: NetworkDataView[];
  matrix_colors?: NetworkMatrixColors;
};

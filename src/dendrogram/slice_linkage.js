module.exports = function slice_linkage(
  params,
  axis,
  dist_thresh,
  min_dist = 0
) {
  network = params.network;
  let clust_a;
  let clust_b;

  // // initialize group_links
  // network[axis + '_nodes'].forEach((x, i) => { x.group_links = i})

  // initialize group_links and dictionary
  network[axis + "_nodes"].forEach((x, i) => {
    x.group_links = i;
  });

  // the max individual cluster id
  max_clust_id = params.network[axis + "_nodes"].length;

  params.network.linkage[axis].forEach((x, i) => {
    if (x[2] > min_dist && x[2] < dist_thresh) {
      // get cluster that are being combined together
      clust_a = x[0];
      clust_b = x[1];

      new_clust_id = max_clust_id + i;

      // replace cluster ids with new cluster id - effectively merging clusters
      network[axis + "_nodes"].forEach((x, i) => {
        if (x.group_links == clust_a || x.group_links == clust_b) {
          x.group_links = new_clust_id;
        }
      });
    }
  });
};

module.exports = function slice_linkage(params, axis, dist_thresh){

  // console.log('slice_linkage', axis, dist_thresh)

  network = params.network
  let clust_a
  let clust_b

  // initialize group_links
  network[axis + '_nodes'].forEach((x, i) => { x.group_links = i})

  // the max individual cluster id
  max_clust_id = params.network[axis + '_nodes'].length

  params.network.linkage[axis].forEach((x, i) => {

    if (x[2] < dist_thresh){

      // console.log('less than dist_thresh', x[2])

      // get cluster that are being combined together
      clust_a = x[0]
      clust_b = x[1]

      new_clust_id = max_clust_id + i

      // replace old cluster ids with new cluster id
      // effectively merging clusters
      network[axis + '_nodes'].forEach((x, i) => {
        if (x.group_links == clust_a || x.group_links == clust_b){
          x.group_links = new_clust_id
        }
      })

    }

  })

  // console.log(params.network[axis + '_nodes'].map((x) => x.group_links))

}
module.exports = function ini_slice_linkage(params, axis, min_dist=0){

  console.log(axis, 'initialize slice linkage!!!!!!!!!!')

  network = params.network
  let clust_a
  let clust_b

  let group_dict = {}

  // initialize group_links and dictionary
  network[axis + '_nodes'].forEach((x, i) => {

    group_dict[i] = i
    x.group_links = i

  })

  // the max individual cluster id
  max_clust_id = params.network[axis + '_nodes'].length

  params.network.linkage[axis].forEach((x, i) => {

    if (x[2] < min_dist){

      // get cluster that are being combined together
      clust_a = x[0]
      clust_b = x[1]

      new_clust_id = max_clust_id + i

      // console.log(new_clust_id)

      // increment original cluster ids
      if (clust_a in group_dict){
        group_dict[clust_a] = new_clust_id
      } else {

        // increment new cluster values
        Object.entries(group_dict).forEach(([key,value]) => {
          if (clust_a == value){
            group_dict[key] = new_clust_id
          }
        })

      }

      if (clust_b in group_dict){
        group_dict[clust_b] = new_clust_id
      } else {

        // increment new cluster values
        Object.entries(group_dict).forEach(([key,value]) => {
          if (clust_b == value){
            group_dict[key] = new_clust_id
          }
        })

      }

      // // replace cluster ids with new cluster id - effectively merging clusters
      // network[axis + '_nodes'].forEach((x, i) => {
      //   if (x.group_links == clust_a || x.group_links == clust_b){
      //     x.group_links = new_clust_id
      //   }
      // })

    }

  })

  console.log(group_dict)

}
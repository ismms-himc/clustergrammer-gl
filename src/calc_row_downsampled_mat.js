module.exports = function calc_row_downsampled_mat(params, run_downsampling=false){

  // console.log('calc_row_downsampled_mat');

  var mat_data = params.mat_data;
  // var row_pos = params.row_positions;
  // var ds_mat = [];
  // var inst_pos;

  if (run_downsampling){
    /*
      Perform trivial downsampling (subsampling)
    */

    mat_data = params.mat_data;
    mat_data = mat_data.slice(0,5);

    // column downsampling
    var new_mat_data = []
    _.each(mat_data, function(inst_row){
      inst_row = inst_row.slice(0,3);
      new_mat_data.push(inst_row);
    });

    params.mat_data = new_mat_data;
    params.is_downsampled = true;
  }

  /*
    Working on actual downsampling
  */

  /*
    row_pos go from -0.5 to 0.5
  */

  // make 10 positions
  // var new_pos = _.range(-0.5, 0.5, 0.1);
  // console.log(new_pos.length);

  // mod_value = 0.1;

  // _.each(mat_data, function(inst_row, inst_index){

  //   inst_pos = row_pos[inst_index];

  //   ds_pos = Math.round(inst_pos/mod_value);

  //   console.log('inst_pos: ', inst_pos);
  //   console.log('ds_pos', ds_pos)
  //   console.log('\n');

  // });

}
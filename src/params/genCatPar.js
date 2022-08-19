import generate_cat_array from "../cats/generateCatArray";
import generate_cat_info from "../cats/generateCatInfo";
export default (function gen_cat_par(params) {
  const cat_data = {};
  cat_data.row = generate_cat_array(params, "row");
  cat_data.col = generate_cat_array(params, "col");
  cat_data.cat_num = {};
  cat_data.cat_num.row = cat_data.row.length;
  cat_data.cat_num.col = cat_data.col.length;
  const cat_room = {};
  cat_room.webgl = 0.0135;
  cat_room.x = cat_room.webgl;
  cat_room.y = cat_room.webgl;
  cat_data.cat_room = cat_room;
  cat_data.showing_color_picker = false;
  params.cat_data = cat_data;
  generate_cat_info(params);
});

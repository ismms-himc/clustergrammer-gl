import color_table from "./colorTable.js";
export default (function color_to_rgbs(hex_or_name, alpha = 1.0) {
  var max_val = 256;
  var inst_rgba;
  if (hex_or_name in color_table) {
    var inst_rgb = color_table[hex_or_name];
    inst_rgb.push(alpha);
    inst_rgba = [inst_rgb[0], inst_rgb[1], inst_rgb[2], alpha];
  } else {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex_or_name)) {
      c = hex_or_name.substring(1).split("");
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = "0x" + c.join("");
      var inst_r = (c >> 16) & 255;
      var inst_g = (c >> 8) & 255;
      var inst_b = c & 255;
      inst_rgba = [inst_r / max_val, inst_g / max_val, inst_b / max_val, alpha];
    } else {
      // bad hex_or_name, return black
      inst_rgba = [0, 0, 0, alpha];
    }
  }
  return inst_rgba;
});

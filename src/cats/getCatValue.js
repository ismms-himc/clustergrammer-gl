export default (function get_cat_value(unprocessed_value) {
  var super_string = ": ";
  if (typeof unprocessed_value === "string") {
    if (unprocessed_value.indexOf(super_string) > -1) {
      unprocessed_value = unprocessed_value.split(super_string)[1];
    }
  }
  var cat_value = parseFloat(unprocessed_value);
  return cat_value;
});

export const normal_name = function (d) {
  const inst_name = d.name.replace(/_/g, " ").split("#")[0];
  return inst_name;
};
export const is_supported_order = function (order) {
  return (
    order === "ini" ||
    order === "clust" ||
    order === "rank_var" ||
    order === "rank" ||
    order === "class" ||
    order === "alpha"
  );
};
export const has = function (obj, key) {
  return obj !== null && hasOwnProperty.call(obj, key);
};
export const property = function (key) {
  return function (obj) {
    return obj === null ? void 0 : obj[key];
  };
};
export const is_undefined = function (obj) {
  return obj === void 0;
};
export const extend = moduleExports.extend;
const moduleExports = {
  normal_name,
  is_supported_order,
  has,
  property,
  is_undefined,
  /* Mixes two objects in together, overwriting a target with a source.
   */
  extend: function (target, source) {
    target = target || {};
    for (const prop in source) {
      if (typeof source[prop] === "object") {
        target[prop] = this.extend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }
    return target;
  },
};
export default moduleExports;

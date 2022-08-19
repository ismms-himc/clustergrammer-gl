const ease = require("eases/cubic-in-out");

module.exports = function interp_fun(params) {
  var inst_ease = ease(
    (params.ani.time - params.ani.last_switch_time) / params.ani.ani_duration
  );

  return inst_ease;
};

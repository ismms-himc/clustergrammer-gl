const ease = require('eases/cubic-in-out')

module.exports = function interp_fun(params){
  inst_ease = ease((params.time - params.last_switch_time) / params.switchDuration);
  return inst_ease;
}
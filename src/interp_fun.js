const ease = require('eases/cubic-in-out')

module.exports = function interp_fun(params){
  inst_ease = ease((params.time - params.animation.last_switch_time) /
              params.animation.switch_duration);

  // console.log(inst_ease)
  return inst_ease;
}
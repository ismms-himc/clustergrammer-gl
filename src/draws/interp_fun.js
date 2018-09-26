const ease = require('eases/cubic-in-out')

module.exports = function interp_fun(params){
  var inst_ease = ease((params.animation.time - params.animation.last_switch_time) /
              params.animation.ani_duration);

  // console.log(inst_ease)
  return inst_ease;
}
function vec_dot_product(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product = product + vecA[i] * vecB[i];
  }
  return product;
}
function vec_magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum = sum + vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}
function vec_diff_value(vec, val) {
  const vec_sub = [];
  for (let i = 0; i < vec.length; i++) {
    vec_sub.push(vec[i] - val);
  }
  return vec_sub;
}
function vec_mean(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum = sum + vec[i];
  }
  const mean = sum / vec.length;
  return mean;
}
export const euclidean = function (v1, v2) {
  let total = 0;
  for (let i = 0; i < v1.length; i++) {
    total = total + Math.pow(v2[i] - v1[i], 2);
  }
  return Math.sqrt(total);
};
export const cosine = function (vecA, vecB) {
  const cos_sim =
    vec_dot_product(vecA, vecB) / (vec_magnitude(vecA) * vec_magnitude(vecB));
  const cos_dist = 1 - cos_sim;
  return cos_dist;
};
export const correlation = function (vecA, vecB) {
  const vecA_mean = vec_mean(vecA);
  const vecB_mean = vec_mean(vecB);
  const vecA_diff_mean = vec_diff_value(vecA, vecA_mean);
  const vecB_diff_mean = vec_diff_value(vecB, vecB_mean);
  const cor_sim =
    vec_dot_product(vecA_diff_mean, vecB_diff_mean) /
    (vec_magnitude(vecA_diff_mean) * vec_magnitude(vecB_diff_mean));
  const cor_diff = 1 - cor_sim;
  return cor_diff;
};
export default {
  euclidean,
  cosine,
  correlation,
};

// vectorMath.js — 벡터 유틸 (코사인 유사도, 유클리드 거리)
// 4차원 벡터: { F, W, D, E }

/** 벡터 덧셈 */
export function vecAdd(a, b) {
  return { F: a.F + b.F, W: a.W + b.W, D: a.D + b.D, E: a.E + b.E };
}

/** 벡터 뺄셈 */
export function vecSub(a, b) {
  return { F: a.F - b.F, W: a.W - b.W, D: a.D - b.D, E: a.E - b.E };
}

/** 스칼라 곱 */
export function vecScale(v, scalar) {
  return { F: v.F * scalar, W: v.W * scalar, D: v.D * scalar, E: v.E * scalar };
}

/** 범위 클램프 [min, max] */
export function vecClamp(v, min = 0, max = 1) {
  return {
    F: Math.max(min, Math.min(max, v.F)),
    W: Math.max(min, Math.min(max, v.W)),
    D: Math.max(min, Math.min(max, v.D)),
    E: Math.max(min, Math.min(max, v.E)),
  };
}

/** 내적 */
export function vecDot(a, b) {
  return a.F * b.F + a.W * b.W + a.D * b.D + a.E * b.E;
}

/** L2 노름 */
export function vecNorm(v) {
  return Math.sqrt(v.F ** 2 + v.W ** 2 + v.D ** 2 + v.E ** 2);
}

/** 코사인 유사도 [-1, 1] */
export function cosineSimilarity(a, b) {
  const normA = vecNorm(a);
  const normB = vecNorm(b);
  if (normA === 0 || normB === 0) return 0;
  return vecDot(a, b) / (normA * normB);
}

/** 유클리드 거리 */
export function euclideanDistance(a, b) {
  const diff = vecSub(a, b);
  return vecNorm(diff);
}

/** 유클리드 유사도 (0~1, 가까울수록 1) */
export function euclideanSimilarity(a, b, scale = 2) {
  const dist = euclideanDistance(a, b);
  return 1 / (1 + dist / scale);
}

/** 혼합 유사도 (코사인 70% + 유클리드 30%) */
export function hybridSimilarity(a, b) {
  return 0.7 * cosineSimilarity(a, b) + 0.3 * euclideanSimilarity(a, b);
}

// momentumEngine.js — GD 모멘텀 상태머신
// 파라미터: V(모멘텀), γ(감쇠율), η(학습률), ∇L(그래디언트)

import { vecAdd, vecSub, vecScale, vecClamp } from './vectorMath.js';

/**
 * 모멘텀 업데이트 함수
 * V_next = γ * V + η * ∇L
 * U_next = clamp(U + V_next, 0, 1)
 *
 * @param {Object} U  - 현재 유저 벡터 { F, W, D, E }
 * @param {Object} V  - 현재 모멘텀 벡터 { F, W, D, E }
 * @param {Object} I_t - 아이템 벡터 { F, W, D, E }
 * @param {number} feedbackScore - 피드백 스코어 (-1 ~ +1)
 * @param {number} gamma - 모멘텀 감쇠율 (기본 0.85)
 * @param {number} eta  - 학습률 (기본 0.1)
 * @returns {{ U: Object, V: Object }}
 */
export function update(U, V, I_t, feedbackScore, gamma = 0.85, eta = 0.1) {
  // 그래디언트: 아이템 방향으로 이동 (feedback 부호에 따라 ±)
  const grad = vecScale(vecSub(I_t, U), feedbackScore);
  const V_next = vecAdd(vecScale(V, gamma), vecScale(grad, eta));
  const U_next = vecClamp(vecAdd(U, V_next), 0, 1);
  return { U: U_next, V: V_next };
}

/**
 * 피드백 스코어 매핑
 * Right(LIKE) → +1.0
 * Left(NOPE)  → -1.0
 * Up(PREMIUM) → +0.5
 * Down(BASIC) → -0.5
 * LongPress   → 0 (벡터 불변)
 */
export const FEEDBACK = {
  LIKE:    +1.0,
  NOPE:    -1.0,
  PREMIUM: +0.5,
  BASIC:   -0.5,
  INSPECT:  0.0,
};

/**
 * 스와이프 방향 → 피드백 스코어 변환
 * @param {'right'|'left'|'up'|'down'|'longpress'} direction
 */
export function directionToFeedback(direction) {
  switch (direction) {
    case 'right':     return FEEDBACK.LIKE;
    case 'left':      return FEEDBACK.NOPE;
    case 'up':        return FEEDBACK.PREMIUM;
    case 'down':      return FEEDBACK.BASIC;
    case 'longpress': return FEEDBACK.INSPECT;
    default:          return 0;
  }
}

/**
 * 성의 온도 계산 (내부 전용, UI 수치 미노출)
 * U 벡터의 가중 평균 → [0, 100] 범위
 * W(따뜻함) 축 가중치 높게
 */
export function calcTemperature(U) {
  const temperature = (U.W * 0.4 + U.F * 0.3 + U.E * 0.2 + U.D * 0.1) * 100;
  return Math.round(Math.max(0, Math.min(100, temperature)));
}

/** Cold Start 초기 벡터 */
export const COLD_START = {
  male:     { F: 0.3, W: 0.3, D: 0.2, E: 0.2 },
  female:   { F: 0.4, W: 0.4, D: 0.3, E: 0.4 },
  teen:     { F: 0.2, W: 0.4, D: 0.6, E: 0.7 },
  thirties: { F: 0.5, W: 0.5, D: 0.6, E: 0.3 },
  fifties:  { F: 0.7, W: 0.6, D: 0.5, E: 0.4 },
  default:  { F: 0.5, W: 0.5, D: 0.5, E: 0.5 },
};

/** 초기 모멘텀 벡터 (0으로 시작) */
export const ZERO_VECTOR = { F: 0.0, W: 0.0, D: 0.0, E: 0.0 };

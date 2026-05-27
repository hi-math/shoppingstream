// useMomentum.js — 유저 상태 벡터 + 모멘텀 훅 (내부 연산 전용)

import { useState, useCallback } from 'react';
import { update, directionToFeedback, calcTemperature, COLD_START, ZERO_VECTOR } from '../engine/momentumEngine.js';

/**
 * useMomentum
 * 유저 선호 벡터(U)와 모멘텀(V)을 관리하는 훅.
 * 반환값에서 U 벡터 좌표는 UI에 절대 노출하지 않는다.
 *
 * @param {string} profile - Cold Start 프로필 키 ('male'|'female'|'teen'|'thirties'|'fifties'|'default')
 * @param {string} initialTag - 초기 활성 맥락 태그
 */
export default function useMomentum(profile = 'default', initialTag = '#생일') {
  const [state, setState] = useState({
    U: { ...COLD_START[profile] ?? COLD_START.default },
    V: { ...ZERO_VECTOR },
    activeTag: initialTag,
    gamma: 0.85,
    eta: 0.1,
    history: [], // { itemId, direction, timestamp }
  });

  /**
   * 스와이프 피드백 처리
   * @param {Object} item - 스와이프된 상품 (벡터 포함)
   * @param {'right'|'left'|'up'|'down'|'longpress'} direction
   */
  const applyFeedback = useCallback((item, direction) => {
    const feedbackScore = directionToFeedback(direction);

    setState((prev) => {
      if (feedbackScore === 0) return prev; // longpress는 벡터 불변

      const { U: U_next, V: V_next } = update(
        prev.U,
        prev.V,
        item.vector,
        feedbackScore,
        prev.gamma,
        prev.eta
      );

      return {
        ...prev,
        U: U_next,
        V: V_next,
        history: [
          ...prev.history,
          { itemId: item.id, direction, timestamp: Date.now() },
        ],
      };
    });
  }, []);

  /** 맥락 태그 변경 */
  const setActiveTag = useCallback((tag) => {
    setState((prev) => ({ ...prev, activeTag: tag }));
  }, []);

  /** 성의 온도 (0~100, 내부 계산값 — 수치 직접 표시 금지) */
  const temperature = calcTemperature(state.U);

  /** 벡터 리셋 (Cold Start 재진입) */
  const resetVector = useCallback((newProfile = 'default') => {
    setState((prev) => ({
      ...prev,
      U: { ...COLD_START[newProfile] ?? COLD_START.default },
      V: { ...ZERO_VECTOR },
      history: [],
    }));
  }, []);

  return {
    activeTag: state.activeTag,
    temperature,         // 0~100 (시각 게이지용, 수치 UI 노출 금지)
    history: state.history,
    applyFeedback,
    setActiveTag,
    resetVector,
    // NOTE: U, V 벡터 좌표는 의도적으로 미반환 (UI 노출 방지)
    _U: state.U,         // 내부 엔진 전용 (feedRanker에만 전달)
  };
}

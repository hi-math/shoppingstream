// useSwipeGesture.js — 4방향 스와이프 제스처 훅

import { useRef, useCallback } from 'react';

const THRESHOLD = 60;    // px — 스와이프 인식 최소 이동 거리
const VELOCITY_MIN = 0.3; // px/ms — 빠른 플릭 인식 속도

/**
 * useSwipeGesture
 * 터치/마우스 이벤트로 4방향 스와이프를 감지한다.
 *
 * @param {Function} onSwipe - ({ direction, deltaX, deltaY, velocity }) => void
 * @param {Object} options - { threshold, velocityMin }
 */
export default function useSwipeGesture(onSwipe, options = {}) {
  const threshold = options.threshold ?? THRESHOLD;
  const velocityMin = options.velocityMin ?? VELOCITY_MIN;

  const startRef = useRef(null);

  const handleStart = useCallback((clientX, clientY) => {
    startRef.current = { x: clientX, y: clientY, time: Date.now() };
  }, []);

  const handleEnd = useCallback((clientX, clientY) => {
    if (!startRef.current) return;

    const deltaX = clientX - startRef.current.x;
    const deltaY = clientY - startRef.current.y;
    const elapsed = Date.now() - startRef.current.time;
    const velocity = Math.sqrt(deltaX ** 2 + deltaY ** 2) / elapsed;
    startRef.current = null;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // 임계값 미달 및 속도 미달 → 무시
    if (Math.max(absX, absY) < threshold && velocity < velocityMin) return;

    let direction;
    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY < 0 ? 'up' : 'down';
    }

    onSwipe?.({ direction, deltaX, deltaY, velocity });
  }, [onSwipe, threshold, velocityMin]);

  // 터치 이벤트 핸들러
  const touchHandlers = {
    onTouchStart: (e) => {
      const t = e.touches[0];
      handleStart(t.clientX, t.clientY);
    },
    onTouchEnd: (e) => {
      const t = e.changedTouches[0];
      handleEnd(t.clientX, t.clientY);
    },
  };

  // 마우스 이벤트 핸들러 (데스크톱 테스트용)
  const mouseHandlers = {
    onMouseDown: (e) => handleStart(e.clientX, e.clientY),
    onMouseUp:   (e) => handleEnd(e.clientX, e.clientY),
  };

  return { touchHandlers, mouseHandlers };
}

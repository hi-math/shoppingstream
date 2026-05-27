// useLongPress.js — 꾹 누르기 감지 훅

import { useRef, useCallback } from 'react';

const DEFAULT_DELAY = 600; // ms

/**
 * useLongPress
 * 터치/마우스 롱프레스를 감지한다.
 * 벡터는 변경하지 않는다 (feedbackScore = 0).
 *
 * @param {Function} onLongPress - () => void
 * @param {Function} onPress     - () => void (짧은 탭)
 * @param {number}   delay       - 롱프레스 인식 시간 ms
 */
export default function useLongPress(onLongPress, onPress, delay = DEFAULT_DELAY) {
  const timerRef = useRef(null);
  const isLongRef = useRef(false);

  const start = useCallback(() => {
    isLongRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongRef.current = true;
      onLongPress?.();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const end = useCallback(() => {
    clear();
    if (!isLongRef.current) {
      onPress?.();
    }
  }, [clear, onPress]);

  const handlers = {
    onTouchStart: start,
    onTouchEnd:   end,
    onMouseDown:  start,
    onMouseUp:    end,
    onMouseLeave: clear,
  };

  return handlers;
}

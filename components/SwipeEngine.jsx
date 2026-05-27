// SwipeEngine.jsx — 4방향 스와이프 제스처 핸들러 + 버튼 UI

import React from 'react';

/**
 * SwipeEngine
 * 스와이프 버튼 UI (터치 제스처 병행).
 * 하단에 4개 버튼 오버레이로 표시된다.
 *
 * @param {Function} onSwipe - (direction: 'right'|'left'|'up'|'down') => void
 */
export default function SwipeEngine({ onSwipe }) {
  const buttons = [
    {
      direction: 'left',
      label: '✕',
      title: 'NOPE',
      bg: '#fff',
      color: '#999',
      border: '2px solid #E0E0E0',
      size: 52,
    },
    {
      direction: 'down',
      label: '↓',
      title: 'BASIC',
      bg: '#fff',
      color: '#6BB5FF',
      border: '2px solid #6BB5FF',
      size: 44,
    },
    {
      direction: 'up',
      label: '✦',
      title: 'PREMIUM',
      bg: '#fff',
      color: '#FFB347',
      border: '2px solid #FFB347',
      size: 44,
    },
    {
      direction: 'right',
      label: '♥',
      title: 'LIKE',
      bg: '#FF4081',
      color: '#fff',
      border: 'none',
      size: 52,
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 15,
      }}
    >
      {buttons.map(({ direction, label, title, bg, color, border, size }) => (
        <button
          key={direction}
          onClick={() => onSwipe?.(direction)}
          title={title}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border,
            backgroundColor: bg,
            color,
            fontSize: size > 48 ? 22 : 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

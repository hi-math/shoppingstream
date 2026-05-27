// ContextTagBar.jsx — 활성 맥락 태그 표시

import React from 'react';

const CONTEXT_TAGS = [
  '#생일', '#기념일', '#집들이', '#야근', '#졸업',
  '#취업', '#명절', '#고백', '#위로', '#일상감사',
];

/**
 * ContextTagBar
 * 상단에 맥락 태그 필을 가로 스크롤로 표시한다.
 *
 * @param {string}   activeTag    - 현재 선택된 태그
 * @param {Function} onTagSelect  - 태그 선택 콜백
 */
export default function ContextTagBar({ activeTag, onTagSelect }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 56, // 온도 게이지 공간 확보
        zIndex: 10,
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 2,
      }}
    >
      {CONTEXT_TAGS.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <button
            key={tag}
            onClick={() => onTagSelect?.(isActive ? null : tag)}
            style={{
              flexShrink: 0,
              padding: '4px 12px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
              backgroundColor: isActive ? '#FF4081' : 'rgba(255,255,255,0.85)',
              color: isActive ? '#fff' : '#333',
              boxShadow: isActive ? '0 2px 8px rgba(255,64,129,0.4)' : '0 1px 4px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export { CONTEXT_TAGS };

// StreamCard.jsx
// · 수직 drag → 부모(StreamScreen)에 콜백으로 위임 (YouTube Shorts 연동)
// · 오른쪽 drag → 상세 패널 연동 (기존 유지)

import React, { useState, useRef } from 'react';
import { localThumb } from '../data/localImages.js';

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg,#1a1a1a,#3a3a3a)',
  'linear-gradient(160deg,#2a2a2a,#4a4a4a)',
  'linear-gradient(160deg,#111,#333)',
  'linear-gradient(160deg,#222,#555)',
  'linear-gradient(160deg,#0a0a0a,#2a2a2a)',
  'linear-gradient(160deg,#1c1c1c,#3c3c3c)',
  'linear-gradient(160deg,#181818,#404040)',
  'linear-gradient(160deg,#202020,#484848)',
];

const V_THRESHOLD  = 50;   // 수직 판정 최소 이동(px)
const R_THRESHOLD  = 68;   // 오른쪽 판정 최소 이동(px)
const V_VELOCITY   = 0.3;  // 빠른 플릭 판정 (px/ms)
const MODE_LOCK_PX = 9;    // 방향 확정 임계값(px)

export default function StreamCard({
  item,
  isTop = false,
  liked = false,
  onLike,
  // 수직 (부모에 위임)
  onVertDragStart,
  onVertDrag,
  onVertDragCancel,
  onVertCommit,
  // 오른쪽
  onRightDragStart,
  onRightDrag,
  onRightDragCancel,
  onRightSwipeCommit,
  onSwipe,
}) {
  const [dx,       setDx]       = useState(0);
  const [mode,     setMode]     = useState(null); // 'v' | 'r' | 'x'
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const startRef    = useRef(null);
  const vertDragRef = useRef(0); // 수직 이동량 (렌더 없이 threshold 체크용)

  const colorIdx = parseInt(item.id, 10) % FALLBACK_GRADIENTS.length;

  /* ── 포인터 ── */
  const pDown = (e) => {
    if (!isTop) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    setDragging(true);
  };

  const pMove = (e) => {
    if (!dragging || !startRef.current) return;
    const rawX = e.clientX - startRef.current.x;
    const rawY = e.clientY - startRef.current.y;

    let m = mode;
    if (!m && (Math.abs(rawX) > MODE_LOCK_PX || Math.abs(rawY) > MODE_LOCK_PX)) {
      if (Math.abs(rawY) >= Math.abs(rawX)) {
        m = 'v';
        onVertDragStart?.();
      } else if (rawX > 0) {
        m = 'r';
        onRightDragStart?.();
      } else {
        m = 'x';
      }
      setMode(m);
    }

    if (m === 'v') {
      vertDragRef.current = rawY;
      onVertDrag?.(rawY);
    } else if (m === 'r') {
      const clamped = Math.max(0, rawX);
      setDx(clamped);
      onRightDrag?.(clamped);
    }
  };

  const pUp = () => {
    if (!dragging) return;
    setDragging(false);

    if (mode === 'v') {
      const dy      = vertDragRef.current;
      const elapsed = Date.now() - (startRef.current?.t ?? Date.now());
      const vel     = elapsed > 0 ? Math.abs(dy) / elapsed : 0;
      vertDragRef.current = 0;

      if (Math.abs(dy) > V_THRESHOLD || vel > V_VELOCITY) {
        onVertCommit?.(dy < 0 ? 'up' : 'down');
      } else {
        onVertDragCancel?.();
      }
    } else if (mode === 'r') {
      if (dx > R_THRESHOLD) {
        onRightSwipeCommit?.();
        setDx(820);
        setTimeout(() => onSwipe?.('right'), 265);
      } else {
        onRightDragCancel?.();
        setDx(0);
        onRightDrag?.(0);
      }
    }

    setMode(null);
    startRef.current = null;
  };

  /* ── 카드 자체 transform: 오른쪽 drag만 (수직은 부모 wrapper가 담당) ── */
  const cardTransform  = dx !== 0 ? `translateX(${dx}px)` : 'none';
  const cardTransition = dragging ? 'none' : 'transform 0.28s cubic-bezier(0.32,0.72,0,1)';

  /* ── 모의 통계 ── */
  const seed         = parseInt(item.id, 10);
  const mockLikes    = ((seed * 137 + 42) % 9000) + 500;
  const mockComments = ((seed * 23  +  7) % 900)  + 30;
  const shortName    = item.name.length > 30 ? item.name.slice(0, 28) + '…' : item.name;

  return (
    <div
      onPointerDown={pDown}
      onPointerMove={pMove}
      onPointerUp={pUp}
      onPointerCancel={pUp}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: imgError ? FALLBACK_GRADIENTS[colorIdx] : '#1A1A1A',
        transform: cardTransform,
        transition: cardTransition,
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* 상품 이미지 */}
      {!imgError && (
        <img
          src={localThumb(item.id)}
          alt={item.name}
          draggable={false}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      )}

      {/* 하단 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom,' +
            'rgba(0,0,0,0) 0%,rgba(0,0,0,0) 38%,' +
            'rgba(0,0,0,0.52) 68%,rgba(0,0,0,0.82) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 오른쪽 스와이프 힌트 */}
      {isTop && mode === 'r' && dx > 10 && (
        <div
          style={{
            position: 'absolute',
            top: '50%', left: 16,
            transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#fff', fontSize: 13, fontWeight: 700,
            opacity: Math.min(dx / R_THRESHOLD, 1) * 0.9,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 20 }}>›</span> 상세보기
        </div>
      )}

      {/* 우측 액션 버튼 */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 20,
          zIndex: 10,
        }}
      >
        <ActionBtn
          count={mockLikes + (liked ? 1 : 0)}
          onClick={onLike}
        >
          <HeartSvg filled={liked} />
        </ActionBtn>
        <ActionBtn count={mockComments} onClick={() => {}}>
          <CommentSvg />
        </ActionBtn>
        <ActionBtn label="공유" onClick={() => {}}>
          <ShareSvg />
        </ActionBtn>
      </div>

      {/* 하단 텍스트 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 62,
          padding: '0 18px 28px',
          pointerEvents: 'none',
        }}
      >
        <p style={{ margin:'0 0 4px', fontSize:11, fontWeight:700,
                    color:'rgba(255,255,255,0.65)', letterSpacing:1,
                    textTransform:'uppercase' }}>
          {item.brand}
        </p>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800,
                     color:'#fff', lineHeight:1.3,
                     textShadow:'0 1px 8px rgba(0,0,0,0.5)' }}>
          {shortName}
        </h3>
        <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.62)', lineHeight:1.5 }}>
          {item.tags.join(' · ')}
        </p>
      </div>
    </div>
  );
}

/* ── SVG 아이콘 ── */
function HeartSvg({ filled }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24"
      fill={filled ? '#fff' : 'none'}
      stroke="#fff" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'fill 0.18s ease, transform 0.18s ease',
               transform: filled ? 'scale(1.12)' : 'scale(1)', display:'block' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CommentSvg() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24"
      fill="none" stroke="#fff" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display:'block' }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function ShareSvg() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24"
      fill="none" stroke="#fff" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display:'block' }}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}

/* ── 액션 버튼 (YouTube Shorts 스타일) ── */
function ActionBtn({ children, count, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 5, padding: 0,
      }}
    >
      <div style={{
        width: 50, height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        {children}
      </div>
      {count != null && (
        <span style={{ fontSize:12, fontWeight:700, color:'#fff',
                       textShadow:'0 1px 4px rgba(0,0,0,0.7)', lineHeight:1 }}>
          {count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count}
        </span>
      )}
      {label && (
        <span style={{ fontSize:12, fontWeight:700, color:'#fff',
                       textShadow:'0 1px 4px rgba(0,0,0,0.7)', lineHeight:1 }}>
          {label}
        </span>
      )}
    </button>
  );
}

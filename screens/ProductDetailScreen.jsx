// ProductDetailScreen.jsx

import React, { useState, useRef, useCallback } from 'react';
import { localThumb } from '../data/localImages.js';

export default function ProductDetailScreen({
  item,
  onClose,           // 항상 스트림으로 돌아감
  onBack  = null,    // 히스토리 이전 상품 (없으면 null)
  historyTotal = 0,
  historyIdx   = 0,
}) {
  const [saved,    setSaved]    = useState(false);
  const [inCart,   setInCart]   = useState(false);
  const [imgSrc,   setImgSrc]   = useState(localThumb(item.id));
  const [imgError, setImgError] = useState(false);

  const hasDiscount = item.discount > 0 && item.originalPrice > item.price;

  /* ── 히어로 영역 스와이프 (스크롤 영역 밖이므로 충돌 없음) ── */
  const gestureRef  = useRef({ startX: 0, startY: 0, decided: false, isH: false });
  const [dragX, setDragX]       = useState(0);
  const [swiping, setSwiping]   = useState(false);

  const handlePointerDown = useCallback((e) => {
    gestureRef.current = { startX: e.clientX, startY: e.clientY, decided: false, isH: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const g  = gestureRef.current;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (!g.decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      g.decided = true;
      g.isH     = Math.abs(dx) > Math.abs(dy);
    }
    if (!g.isH) return;

    setDragX(dx);
    setSwiping(true);
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!swiping) return;
    const dx = e.clientX - gestureRef.current.startX;
    setDragX(0);
    setSwiping(false);

    if (dx > 80)        (onBack ?? onClose)();   // 오른쪽 → 히스토리 or 스트림
    else if (dx < -80)  onClose();               // 왼쪽 → 스트림
  }, [swiping, onBack, onClose]);

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        backgroundColor: '#0F0F0F', overflow: 'hidden',
      }}
    >
      {/* ── Hero 이미지 (스와이프 감지 영역) ── */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative', height: 380, flexShrink: 0,
          backgroundColor: imgError ? '#1A1A1A' : '#0A0A0A',
          overflow: 'hidden', touchAction: 'none',
          transform: swiping ? `translateX(${dragX * 0.25}px)` : 'none',
          transition: swiping ? 'none' : 'transform 0.2s ease',
          cursor: 'grab',
        }}
      >
        {!imgError && (
          <img
            src={imgSrc}
            alt={item.name}
            onError={() => {
              if (imgSrc !== item.thumbnail && item.thumbnail) setImgSrc(item.thumbnail);
              else setImgError(true);
            }}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        )}

        {/* 상단 그라디언트 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.6),transparent)',
          pointerEvents: 'none',
        }} />

        {/* 하단 그라디언트 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top,rgba(15,15,15,1),transparent)',
          pointerEvents: 'none',
        }} />

        {/* 히스토리 인디케이터 */}
        {historyTotal > 1 && (
          <div style={{
            position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5, zIndex: 10, pointerEvents: 'none',
          }}>
            {Array.from({ length: historyTotal }).map((_, i) => (
              <div key={i} style={{
                width: i === historyIdx ? 18 : 5, height: 5, borderRadius: 3,
                backgroundColor: i === historyIdx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.2s ease',
              }} />
            ))}
          </div>
        )}

        {/* 카테고리 배지 */}
        <span style={{
          position: 'absolute', top: 14, right: 14,
          padding: '4px 10px', borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          color: '#AAAAAA', fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
        }}>
          {item.category} · {item.categoryMedium}
        </span>

        {/* 할인 배지 */}
        {hasDiscount && (
          <span style={{
            position: 'absolute', bottom: 14, left: 14,
            padding: '4px 10px', borderRadius: 6,
            backgroundColor: '#F5F5F5', color: '#0A0A0A',
            fontSize: 12, fontWeight: 800, letterSpacing: 0.3,
          }}>
            -{item.discount}% SALE
          </span>
        )}

        {/* 스와이프 힌트 */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          fontSize: 11, color: 'rgba(255,255,255,0.3)',
          pointerEvents: 'none',
        }}>
          {onBack ? '← 이전  ·  오른쪽→스트림' : '← 스와이프 → 스트림'}
        </div>
      </div>

      {/* ── 스크롤 콘텐츠 ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ padding: '20px 20px 8px' }}>

          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 1.8, textTransform: 'uppercase' }}>
            {item.brand}
          </p>

          <h1 style={{ margin: '0 0 18px', fontSize: 19, fontWeight: 700, color: '#E8E8E8', lineHeight: 1.4 }}>
            {item.name}
          </h1>

          <div style={{ marginBottom: 20 }}>
            {hasDiscount && (
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#444', textDecoration: 'line-through' }}>
                {item.originalPrice.toLocaleString()}원
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#F5F5F5', letterSpacing: -0.5 }}>
                {item.price.toLocaleString()}
                <span style={{ fontSize: 15, fontWeight: 600, marginLeft: 3, color: '#AAA' }}>원</span>
              </span>
              {hasDiscount && (
                <span style={{ padding: '3px 8px', borderRadius: 6, backgroundColor: '#222', color: '#CCC', fontSize: 12, fontWeight: 700 }}>
                  {item.discount}% 할인
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                padding: '5px 12px', borderRadius: 6,
                border: '1px solid #2A2A2A', backgroundColor: '#1A1A1A',
                color: '#888', fontSize: 12, fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ padding: '16px 18px', borderRadius: 10, backgroundColor: '#1A1A1A', border: '1px solid #222', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#777', lineHeight: 1.75 }}>
              <strong style={{ color: '#CCC' }}>{item.brand}</strong>의{' '}
              {item.categoryMedium} 아이템입니다.{' '}
              {item.tags.slice(0, 2).join(', ')} 스타일에 어울리며,
              일상의 다양한 순간에 코디하기 좋습니다.
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '14px 18px', borderRadius: 10,
            backgroundColor: '#1A1A1A', border: '1px solid #222', marginBottom: 8,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, opacity: 0.5 }}>🚚</span>
            <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.6 }}>
              오늘 주문 시 <strong style={{ color: '#CCC' }}>내일 도착</strong> 가능
              <br />
              <span style={{ fontSize: 11, color: '#444' }}>무료배송 · 30일 이내 반품 가능</span>
            </p>
          </div>

          {item.productUrl && (
            <a href={item.productUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '13px 0', borderRadius: 10,
                border: '1px solid #2A2A2A', backgroundColor: '#1A1A1A',
                color: '#888', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 8,
              }}
            >
              <span style={{ fontSize: 15 }}>↗</span> 29cm에서 직접 보기
            </a>
          )}
        </div>
      </div>

      {/* ── 하단 CTA ── */}
      <div style={{
        flexShrink: 0, display: 'flex', gap: 10,
        padding: '12px 20px 18px',
        backgroundColor: '#0F0F0F', borderTop: '1px solid #1E1E1E',
      }}>
        <button
          onClick={() => setSaved(s => !s)}
          style={{
            width: 52, height: 52, borderRadius: 10,
            border: `1px solid ${saved ? '#F5F5F5' : '#2A2A2A'}`,
            backgroundColor: saved ? '#F5F5F5' : '#1A1A1A',
            color: saved ? '#0A0A0A' : '#888',
            fontSize: 20, cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          {saved ? '♥' : '♡'}
        </button>
        <button
          onClick={() => setInCart(c => !c)}
          style={{
            flex: 1, height: 52, borderRadius: 10, border: 'none',
            backgroundColor: inCart ? '#2A2A2A' : '#F5F5F5',
            color: inCart ? '#888' : '#0A0A0A',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {inCart ? '✓ 담았어요' : '🛒 장바구니 담기'}
        </button>
      </div>
    </div>
  );
}

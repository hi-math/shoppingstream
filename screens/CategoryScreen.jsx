// CategoryScreen.jsx — 카테고리별 상품 탐색

import React, { useState } from 'react';
import { localThumb } from '../data/localImages.js';
import { giftDataset } from '../data/gift_dataset.js';

const CATS = [
  { id: 'all',           label: '전체',    thumbId: null },
  { id: '여성의류',       label: '여성의류', thumbId: '3334217' },
  { id: '여성슈즈',       label: '여성슈즈', thumbId: '3202649' },
  { id: '여성가방',       label: '여성가방', thumbId: '3984529' },
  { id: '여성주얼리',     label: '주얼리',   thumbId: '3018840' },
  { id: '뷰티',          label: '뷰티',     thumbId: '3061006' },
  { id: '가구/인테리어',  label: '라이프',   thumbId: '1694981' },
];

const SORT_OPTIONS = ['추천순', '낮은가격', '높은가격', '할인율'];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}
function HeartOutlineIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16"
      fill={filled ? '#E8E8E8' : 'none'}
      stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function Thumb({ id, style }) {
  const [err, setErr] = useState(false);
  if (!id) return <div style={{ width: '100%', height: '100%', backgroundColor: '#1A1A1A' }} />;
  return !err ? (
    <img src={localThumb(id)} alt="" draggable={false} onError={() => setErr(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', ...style }} />
  ) : (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1A1A1A' }} />
  );
}

export default function CategoryScreen() {
  const [activeCat, setActiveCat]   = useState('all');
  const [activeSort, setActiveSort] = useState('추천순');
  const [liked, setLiked]           = useState(new Set());

  const toggleLike = id => setLiked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  // 필터
  let products = activeCat === 'all'
    ? [...giftDataset]
    : giftDataset.filter(p => p.category === activeCat);

  // 정렬
  if (activeSort === '낮은가격') products.sort((a, b) => a.price - b.price);
  else if (activeSort === '높은가격') products.sort((a, b) => b.price - a.price);
  else if (activeSort === '할인율') products.sort((a, b) => b.discount - a.discount);

  const activeLabel = CATS.find(c => c.id === activeCat)?.label ?? '전체';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0A' }}>

      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0 18px', height: 52,
        backgroundColor: '#0A0A0A', borderBottom: '1px solid #1A1A1A', flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#E8E8E8', letterSpacing: 0.5 }}>
            카테고리
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <SearchIcon />
        </button>
      </div>

      {/* ── 카테고리 탭 (원형 썸네일) ── */}
      <div style={{
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
        padding: '14px 12px 12px', borderBottom: '1px solid #1A1A1A',
        backgroundColor: '#0A0A0A', flexShrink: 0,
        gap: 0,
      }}>
        {CATS.map(cat => {
          const isActive = cat.id === activeCat;
          return (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
              flexShrink: 0, width: 68,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
                border: `2px solid ${isActive ? '#E8E8E8' : '#2A2A2A'}`,
                backgroundColor: '#1A1A1A',
                transition: 'border-color 0.15s ease',
              }}>
                <Thumb id={cat.thumbId} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 400,
                color: isActive ? '#E8E8E8' : '#555',
                whiteSpace: 'nowrap', letterSpacing: -0.2,
                transition: 'color 0.15s ease',
              }}>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 결과 수 + 정렬 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px', borderBottom: '1px solid #1A1A1A',
        backgroundColor: '#0A0A0A', flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: '#555' }}>
          <span style={{ color: '#E8E8E8', fontWeight: 700 }}>{activeLabel}</span>
          {' '}· {products.length}개
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setActiveSort(opt)} style={{
              padding: '4px 10px',
              border: `1px solid ${activeSort === opt ? '#888' : '#222'}`,
              borderRadius: 20, background: 'none', cursor: 'pointer',
              fontSize: 11,
              color: activeSort === opt ? '#E8E8E8' : '#444',
              fontWeight: activeSort === opt ? 700 : 400,
              transition: 'all 0.12s ease',
            }}>{opt}</button>
          ))}
        </div>
      </div>

      {/* ── 상품 그리드 ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1px', backgroundColor: '#1A1A1A',
          marginBottom: 0,
        }}>
          {products.map(item => (
            <div key={item.id} style={{
              backgroundColor: '#0F0F0F', padding: '0 0 14px',
              cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
                <Thumb id={item.id} />
                {item.discount > 0 && (
                  <div style={{
                    position: 'absolute', top: 8, left: 8, padding: '2px 6px',
                    backgroundColor: '#E8E8E8', borderRadius: 2,
                    fontSize: 10, fontWeight: 800, color: '#0A0A0A',
                  }}>-{item.discount}%</div>
                )}
                <button onClick={() => toggleLike(item.id)} style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                }}>
                  <HeartOutlineIcon filled={liked.has(item.id)} />
                </button>
              </div>
              <div style={{ padding: '8px 10px 0' }}>
                <p style={{
                  margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#888',
                  letterSpacing: 0.8, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{item.brand}</p>
                <p style={{
                  margin: '0 0 5px', fontSize: 11, color: '#666', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{item.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {item.discount > 0 && (
                    <span style={{ fontSize: 10, color: '#444', textDecoration: 'line-through' }}>
                      {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#E8E8E8' }}>
                    {item.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

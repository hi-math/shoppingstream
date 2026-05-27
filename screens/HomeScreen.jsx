// HomeScreen.jsx — 프로모션 + MOST LOVED

import React, { useState } from 'react';
import { localThumb } from '../data/localImages.js';
import { giftDataset } from '../data/gift_dataset.js';

/* ── 데이터 ── */
const MOST_LOVED_IDS = ['3334217','3984529','3202649','3018840','3061006','1694981'];
const MOST_LOVED = MOST_LOVED_IDS.map((id, i) => {
  const item = giftDataset.find(p => p.id === id) || giftDataset[i];
  return { ...item, rank: String(i + 1).padStart(2, '0') };
});

const HOT_DEALS = [...giftDataset]
  .filter(p => p.discount >= 20)
  .sort((a, b) => b.discount - a.discount)
  .slice(0, 10);

const NEW_IN = giftDataset.slice(-10).reverse();

/* ── 아이콘 ── */
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
function HeartOutlineIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill={filled ? '#E8E8E8' : 'none'}
      stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ── 공통 컴포넌트 ── */
function Thumb({ id, style }) {
  const [err, setErr] = useState(false);
  return !err ? (
    <img src={localThumb(id)} alt="" draggable={false} onError={() => setErr(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', ...style }} />
  ) : (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1A1A1A' }} />
  );
}

function SectionHeader({ title, sub, onMore }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '24px 18px 14px' }}>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: 10, color: '#444', letterSpacing: 2 }}>{sub}</p>
        <h2 style={{
          margin: 0, fontSize: 20, fontWeight: 800, color: '#E8E8E8', letterSpacing: -0.5,
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>{title}</h2>
      </div>
      {onMore && (
        <button onClick={onMore} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', padding: 0,
        }}>
          전체보기 <ArrowIcon />
        </button>
      )}
    </div>
  );
}

export default function HomeScreen() {
  const [liked, setLiked] = useState(new Set());
  const toggleLike = id => setLiked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#0A0A0A' }}>

      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0 18px', height: 52,
        backgroundColor: '#0A0A0A', borderBottom: '1px solid #1A1A1A',
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <SearchIcon />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{
            fontSize: 16, fontWeight: 800, color: '#E8E8E8', letterSpacing: 3,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            SHOPPING STREAM
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <BagIcon />
        </button>
      </div>

      {/* ── SUMMER SALE 히어로 배너 ── */}
      <div style={{
        position: 'relative', height: 200, backgroundColor: '#111',
        overflow: 'hidden', borderBottom: '1px solid #1A1A1A',
      }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', border: '1px solid #1E1E1E' }} />
        <div style={{ position: 'absolute', right: 20, top: 20, width: 160, height: 160, borderRadius: '50%', border: '1px solid #1A1A1A' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 160, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, #111, transparent)', zIndex: 1 }} />
          <Thumb id="3984529" style={{ objectPosition: 'center 20%' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, padding: '28px 24px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: '#555', letterSpacing: 3 }}>LIMITED TIME OFFER</p>
          <h1 style={{
            margin: '0 0 4px', fontSize: 34, fontWeight: 900, lineHeight: 1,
            color: '#E8E8E8', letterSpacing: -1.5, fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            SUMMER<br />SALE
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888', fontWeight: 600 }}>
            최대 <span style={{ color: '#E8E8E8' }}>55%</span> 할인
          </p>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            border: '1px solid #E8E8E8', borderRadius: 2, background: 'none',
            color: '#E8E8E8', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer',
          }}>
            SHOP NOW <ArrowIcon />
          </button>
        </div>
      </div>

      {/* ── 미니 배너 2개 ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', backgroundColor: '#1A1A1A', borderBottom: '8px solid #0A0A0A',
      }}>
        {[
          { label: 'NEW IN', sub: '신상품 입고', id: '3202649' },
          { label: 'BRAND PICK', sub: '이 주의 브랜드', id: '3018840' },
        ].map(({ label, sub, id }) => (
          <div key={label} style={{
            position: 'relative', height: 100, backgroundColor: '#0D0D0D', overflow: 'hidden', cursor: 'pointer',
          }}>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 90, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 50, background: 'linear-gradient(to right, #0D0D0D, transparent)', zIndex: 1 }} />
              <Thumb id={id} style={{ objectPosition: 'center 10%' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 2, padding: '18px 14px' }}>
              <p style={{ margin: '0 0 3px', fontSize: 10, color: '#444', letterSpacing: 1.5 }}>{label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#C8C8C8' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MOST LOVED ── */}
      <SectionHeader title="MOST LOVED" sub="RANKING" />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', backgroundColor: '#1A1A1A',
        border: '1px solid #1A1A1A', margin: '0 0 0',
      }}>
        {MOST_LOVED.map(item => (
          <div key={item.id} style={{ backgroundColor: '#0F0F0F', padding: '0 0 16px', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#1A1A1A', overflow: 'hidden' }}>
              <Thumb id={item.id} />
              <span style={{
                position: 'absolute', bottom: 8, left: 10,
                fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.22)',
                lineHeight: 1, fontFamily: 'Georgia, serif', letterSpacing: -1, pointerEvents: 'none',
              }}>{item.rank}</span>
            </div>
            <button onClick={() => toggleLike(item.id)} style={{
              position: 'absolute', top: 8, right: 8,
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <HeartOutlineIcon filled={liked.has(item.id)} />
            </button>
            <div style={{ padding: '10px 10px 0' }}>
              <p style={{
                margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: '#C8C8C8',
                letterSpacing: 0.8, textTransform: 'uppercase',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{item.brand}</p>
              <p style={{
                margin: '0 0 6px', fontSize: 12, color: '#666', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{item.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                {item.discount > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>{item.discount}%</span>}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E8E8E8' }}>{item.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── HOT DEAL ── */}
      <SectionHeader title="HOT DEAL" sub="SALE ITEMS" onMore={() => {}} />
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 18px 4px' }}>
        {HOT_DEALS.map(item => (
          <div key={item.id} style={{ flexShrink: 0, width: 130, backgroundColor: '#0F0F0F', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: 130, height: 173, overflow: 'hidden', position: 'relative' }}>
              <Thumb id={item.id} />
              <div style={{
                position: 'absolute', top: 8, left: 8, padding: '3px 7px',
                backgroundColor: '#E8E8E8', borderRadius: 2,
                fontSize: 11, fontWeight: 800, color: '#0A0A0A', letterSpacing: 0.3,
              }}>-{item.discount}%</div>
              <button onClick={() => toggleLike(item.id)} style={{
                position: 'absolute', top: 6, right: 6,
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              }}>
                <HeartOutlineIcon filled={liked.has(item.id)} />
              </button>
            </div>
            <div style={{ padding: '8px 8px 12px' }}>
              <p style={{
                margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#888',
                letterSpacing: 0.8, textTransform: 'uppercase',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{item.brand}</p>
              <p style={{
                margin: '0 0 4px', fontSize: 11, color: '#666', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{item.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#444', textDecoration: 'line-through' }}>{item.originalPrice.toLocaleString()}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#E8E8E8' }}>{item.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── NEW IN ── */}
      <SectionHeader title="NEW IN" sub="JUST ARRIVED" onMore={() => {}} />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', backgroundColor: '#1A1A1A',
        border: '1px solid #1A1A1A', marginBottom: 40,
      }}>
        {NEW_IN.map(item => (
          <div key={item.id} style={{ backgroundColor: '#0F0F0F', padding: '0 0 14px', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
              <Thumb id={item.id} />
              <div style={{
                position: 'absolute', top: 8, left: 8, padding: '2px 6px',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 2,
                fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 1,
              }}>NEW</div>
              <button onClick={() => toggleLike(item.id)} style={{
                position: 'absolute', top: 6, right: 6,
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              }}>
                <HeartOutlineIcon filled={liked.has(item.id)} />
              </button>
            </div>
            <div style={{ padding: '8px 10px 0' }}>
              <p style={{
                margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#C8C8C8',
                letterSpacing: 0.8, textTransform: 'uppercase',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{item.brand}</p>
              <p style={{
                margin: '0 0 4px', fontSize: 11, color: '#666', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{item.name}</p>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#E8E8E8' }}>{item.price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

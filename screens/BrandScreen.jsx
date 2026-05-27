// BrandScreen.jsx — 신세계 스타일: 텍스트 중심, 이모지 없음

import React from 'react';

const BRANDS = [
  { id: 'loewe',     name: 'LOEWE',          desc: '스페인 럭셔리 패션 하우스' },
  { id: 'toteme',    name: 'TOTEME',          desc: '스칸디나비안 미니멀리즘' },
  { id: 'aesop',     name: 'AESOP',           desc: '프리미엄 스킨케어' },
  { id: 'sn',        name: 'STUDIO NICHOLSON',desc: '컨템포러리 테일러드' },
  { id: 'acne',      name: 'ACNE STUDIOS',    desc: '스웨덴 럭셔리 브랜드' },
  { id: 'cos',       name: 'COS',             desc: '모던 클래식 디자인' },
  { id: 'arket',     name: 'ARKET',           desc: '스칸디나비안 라이프스타일' },
  { id: 'muji',      name: 'MUJI',            desc: '미니멀 일상용품' },
  { id: 'margaret',  name: 'MARGARET HOWELL', desc: '영국 미니멀리스트' },
  { id: 'lemaire',   name: 'LEMAIRE',         desc: '파리지앵 실루엣' },
];

const ALPHA_GROUPS = ['A–C', 'D–F', 'G–I', 'J–L', 'M–O', 'P–R', 'S–U', 'V–Z'];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="#888" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}

export default function BrandScreen() {
  const [selected, setSelected] = React.useState(null);
  const [activeAlpha, setActiveAlpha] = React.useState('A–C');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0A' }}>

      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', height: 52,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1A1A1A',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#E8E8E8', letterSpacing: 0.5 }}>
          브랜드
        </span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <SearchIcon />
        </button>
      </div>

      {/* ── 알파벳 필터 ── */}
      <div style={{
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
        borderBottom: '1px solid #1A1A1A',
        flexShrink: 0,
        backgroundColor: '#111',
      }}>
        {ALPHA_GROUPS.map(g => {
          const isActive = g === activeAlpha;
          return (
            <button
              key={g}
              onClick={() => setActiveAlpha(g)}
              style={{
                flexShrink: 0,
                padding: '10px 14px',
                border: 'none', background: 'none',
                fontSize: 12, fontWeight: isActive ? 700 : 400,
                color: isActive ? '#E8E8E8' : '#444',
                borderBottom: isActive ? '2px solid #E8E8E8' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* ── 브랜드 리스트 ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {BRANDS.map((brand, i) => {
          const isActive = selected === brand.id;
          return (
            <button
              key={brand.id}
              onClick={() => setSelected(isActive ? null : brand.id)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: 'none',
                borderBottom: '1px solid #141414',
                backgroundColor: isActive ? '#161616' : 'transparent',
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer',
                transition: 'background-color 0.12s ease',
              }}
            >
              {/* 브랜드 이니셜 */}
              <div style={{
                width: 40, height: 40,
                borderRadius: 2,
                backgroundColor: '#1A1A1A',
                border: `1px solid ${isActive ? '#333' : '#1E1E1E'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800,
                  color: isActive ? '#C8C8C8' : '#3A3A3A',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: -0.5,
                }}>
                  {brand.name.charAt(0)}
                </span>
              </div>

              {/* 텍스트 */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{
                  margin: '0 0 2px',
                  fontSize: 13, fontWeight: 700,
                  color: isActive ? '#E8E8E8' : '#C8C8C8',
                  letterSpacing: 0.3,
                }}>
                  {brand.name}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#444' }}>
                  {brand.desc}
                </p>
              </div>

              <span style={{ fontSize: 14, color: '#2A2A2A' }}>›</span>
            </button>
          );
        })}

        {/* 선택 브랜드 안내 */}
        {selected && (
          <div style={{
            margin: '0 20px 24px',
            padding: '18px 20px',
            borderRadius: 4,
            border: '1px solid #1E1E1E',
            backgroundColor: '#111',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.7 }}>
              스트림에서 이 브랜드 상품을<br />추천받아보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

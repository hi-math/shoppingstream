// BottomNavBar.jsx — 신세계 스타일: 레이블 없음, 중앙 브랜드 버튼

import React from 'react';

/* ── SVG 아이콘 ── */
function MenuIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function HeartIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function PersonIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function ClockIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );
}

// 탭 순서: home(≡) · category(heart) · stream(중앙) · brand(clock) · my(person)
const TABS = [
  { id: 'home',     Icon: MenuIcon   },
  { id: 'category', Icon: HeartIcon  },
  { id: 'stream',   isBrand: true    },
  { id: 'brand',    Icon: ClockIcon  },
  { id: 'my',       Icon: PersonIcon },
];

export default function BottomNavBar({ activeTab, onTabPress }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        height: 60,
        backgroundColor: '#111',
        borderTop: '1px solid #1E1E1E',
        display: 'flex', alignItems: 'center',
        zIndex: 100,
      }}
    >
      {TABS.map(({ id, Icon, isBrand }) => {
        const isActive = id === activeTab;

        if (isBrand) {
          return (
            <button
              key={id}
              onClick={() => onTabPress?.(id)}
              style={{
                flex: 1, height: '100%',
                border: 'none', backgroundColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 44, height: 44,
                borderRadius: 22,
                backgroundColor: isActive ? '#F0F0F0' : '#1E1E1E',
                border: `1px solid ${isActive ? '#F0F0F0' : '#2A2A2A'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                <span style={{
                  fontSize: 15, fontWeight: 800,
                  color: isActive ? '#0A0A0A' : '#555',
                  letterSpacing: -1,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  lineHeight: 1,
                }}>
                  SS
                </span>
              </div>
            </button>
          );
        }

        const color = isActive ? '#E8E8E8' : '#3A3A3A';
        return (
          <button
            key={id}
            onClick={() => onTabPress?.(id)}
            style={{
              flex: 1, height: '100%',
              border: 'none', backgroundColor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Icon color={color} />
            {isActive && (
              <div style={{
                position: 'absolute', bottom: 0,
                width: 16, height: 2,
                borderRadius: '2px 2px 0 0',
                backgroundColor: '#E8E8E8',
              }}/>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export { TABS };

// MyScreen.jsx — 신세계 마이페이지 스타일 다크 테마
// 벡터 좌표, 성의 온도 수치는 이 화면에 절대 노출하지 않는다.

import React from 'react';

/* ── 인라인 SVG 아이콘 ── */
function HeartSm({ color = '#888' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function TruckSm({ color = '#888' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v4h-7V8z"/>
      <circle cx="5.5"  cy="18.5" r="2"/>
      <circle cx="18.5" cy="18.5" r="2"/>
    </svg>
  );
}
function ChatSm({ color = '#888' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

/* ── 주문 단계 아이콘 ── */
function OrderIcon({ color = '#444' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="13" y2="14"/>
    </svg>
  );
}
function BoxIcon({ color = '#444' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
function TruckIcon({ color = '#444' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v4h-7V8z"/>
      <circle cx="5.5"  cy="18.5" r="2"/>
      <circle cx="18.5" cy="18.5" r="2"/>
    </svg>
  );
}
function CheckIcon({ color = '#444' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );
}

const ORDER_STEPS = [
  { label: '주문/결제', Icon: OrderIcon, count: 0 },
  { label: '상품준비중', Icon: BoxIcon,   count: 0 },
  { label: '배송준비중', Icon: BoxIcon,   count: 0 },
  { label: '배송중',    Icon: TruckIcon, count: 0 },
  { label: '배송완료',  Icon: CheckIcon, count: 0 },
];

const MENU_SECTIONS = [
  {
    title: '나의 쇼핑정보',
    items: ['주문/배송 조회', '취소/반품/교환 조회', '결제수단 관리', '정기배송 조회'],
  },
  {
    title: '나의 혜택정보',
    items: ['포인트 조회', '쿠폰 내역', '멤버십 혜택'],
  },
  {
    title: '나의 활동정보',
    items: ['상품리뷰', '상품문의', '최근 본 상품'],
  },
  {
    title: '앱 정보',
    items: ['알림 설정', '도움말 & 문의', '앱 버전 v0.2.0'],
  },
];

const DIV = () => (
  <div style={{ height: 1, backgroundColor: '#1A1A1A', margin: '0' }} />
);

export default function MyScreen() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#0A0A0A' }}>

      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 18px',
        height: 52,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1A1A1A',
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#E8E8E8', letterSpacing: 0.5 }}>
            마이페이지
          </span>
        </div>
      </div>

      {/* ── 프로필 ── */}
      <div style={{
        padding: '20px 20px 18px',
        backgroundColor: '#111',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: '#2A2A2A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 20, fontWeight: 800,
            color: '#888',
            fontFamily: 'Georgia, serif',
          }}>
            K
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 1px', fontSize: 11, color: '#555', letterSpacing: 1 }}>WELCOME</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#E8E8E8' }}>
            김선물님{' '}
            <span style={{ fontSize: 12, fontWeight: 400, color: '#555' }}>다음달 등급 ›</span>
          </p>
        </div>
        <button style={{
          padding: '7px 14px',
          borderRadius: 4,
          border: '1px solid #333',
          backgroundColor: 'transparent',
          display: 'flex', alignItems: 'center', gap: 6,
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 12, color: '#888', letterSpacing: 0.3 }}>멤버십</span>
          <svg viewBox="0 0 40 14" width="28" height="10">
            {[0,4,8,12,16,20,24,28,32,36].map(x => (
              <rect key={x} x={x} y="0" width="2" height="14" fill="#444" rx="1"/>
            ))}
          </svg>
        </button>
      </div>

      {/* ── 빠른 액션 ── */}
      <div style={{
        backgroundColor: '#111',
        borderTop: '1px solid #1A1A1A',
        borderBottom: '8px solid #0A0A0A',
        display: 'flex',
      }}>
        {[
          { label: '찜', Icon: HeartSm },
          { label: '배송지 관리', Icon: TruckSm },
          { label: '채팅상담', Icon: ChatSm },
        ].map(({ label, Icon }, i, arr) => (
          <button
            key={label}
            style={{
              flex: 1, padding: '14px 0',
              border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              borderRight: i < arr.length - 1 ? '1px solid #1A1A1A' : 'none',
            }}
          >
            <Icon />
            <span style={{ fontSize: 13, color: '#888' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── 포인트/쿠폰 2×2 그리드 ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        backgroundColor: '#1A1A1A',
        marginBottom: 8,
      }}>
        {[
          { value: '0P',     label: 'S.I.포인트' },
          { value: '5,000P', label: 'e포인트'    },
          { value: '0장',    label: '쿠폰'       },
          { value: '0개',    label: '리뷰'       },
        ].map(({ value, label }) => (
          <div key={label} style={{
            backgroundColor: '#111',
            padding: '16px 0',
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#E8E8E8' }}>
              {value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── 주문/배송 조회 ── */}
      <div style={{ backgroundColor: '#111', padding: '18px 20px 20px', marginBottom: 8 }}>
        <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#C8C8C8' }}>
          주문/배송 조회
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {ORDER_STEPS.map(({ label, Icon, count }, i) => (
            <React.Fragment key={label}>
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, flex: 1,
              }}>
                <Icon color="#3A3A3A" />
                <span style={{ fontSize: 10, color: '#555', textAlign: 'center', lineHeight: 1.3 }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>{count}</span>
              </div>
              {i < ORDER_STEPS.length - 1 && (
                <span style={{ fontSize: 12, color: '#2A2A2A', flexShrink: 0 }}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 메뉴 섹션들 ── */}
      {MENU_SECTIONS.map(({ title, items }) => (
        <div key={title} style={{ backgroundColor: '#111', marginBottom: 8 }}>
          <div style={{ padding: '16px 20px 10px' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#E8E8E8' }}>{title}</p>
          </div>
          <div style={{ height: 1, backgroundColor: '#1E1E1E', margin: '0 20px' }} />
          {items.map(item => (
            <button
              key={item}
              style={{
                width: '100%', padding: '14px 20px',
                border: 'none', borderBottom: '1px solid #1A1A1A',
                backgroundColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 14, color: '#888' }}>{item}</span>
              <span style={{ fontSize: 14, color: '#333' }}>›</span>
            </button>
          ))}
        </div>
      ))}

      {/* 로그아웃 */}
      <div style={{ padding: '16px 20px 32px', backgroundColor: '#111' }}>
        <button style={{
          width: '100%', padding: '13px',
          borderRadius: 4, border: '1px solid #222',
          backgroundColor: 'transparent',
          fontSize: 13, color: '#444', cursor: 'pointer',
        }}>
          로그아웃
        </button>
      </div>

    </div>
  );
}

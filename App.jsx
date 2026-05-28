// App.jsx — 앱 루트 엔트리

import React, { useState, useCallback, useRef } from 'react';
import BottomNavBar        from './components/BottomNavBar.jsx';
import HomeScreen          from './screens/HomeScreen.jsx';
import StreamScreen        from './screens/StreamScreen.jsx';
import CategoryScreen      from './screens/CategoryScreen.jsx';
import BrandScreen         from './screens/BrandScreen.jsx';
import MyScreen            from './screens/MyScreen.jsx';
import ProductDetailScreen from './screens/ProductDetailScreen.jsx';

const SCREENS = {
  home:     HomeScreen,
  stream:   StreamScreen,
  category: CategoryScreen,
  brand:    BrandScreen,
  my:       MyScreen,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('stream');

  /* ── 홈 → 상세 히스토리 (최대 10개) ── */
  const [homeHistory,    setHomeHistory]    = useState([]); // Item[]
  const [homeHistIdx,    setHomeHistIdx]    = useState(0);  // 현재 보고 있는 인덱스
  const [homeDetailOpen,    setHomeDetailOpen]    = useState(false);
  const [homeDetailMounted, setHomeDetailMounted] = useState(false);
  const [homeDetailDragX,   setHomeDetailDragX]   = useState(0);
  const [isDraggingHome,    setIsDraggingHome]     = useState(false);
  const [homeExitDir,       setHomeExitDir]        = useState(null); // 'left' | null
  const homeGestureRef  = useRef({ startX: 0, startY: 0, tracking: false });
  const homeTimerRef    = useRef(null);

  /* ── 홈 상품 클릭 → 상세 열기 ── */
  const openHomeDetail = useCallback((item) => {
    clearTimeout(homeTimerRef.current);
    setHomeHistory(prev => {
      const deduped = prev.filter(p => p.id !== item.id);
      const next = [...deduped, item].slice(-10); // 최신 10개 유지
      setHomeHistIdx(next.length - 1);
      return next;
    });
    setHomeDetailMounted(true);
    setHomeDetailOpen(true);
  }, []);

  /* ── 상세 닫기 (히스토리 뒤로 or 완전 닫기) ── */
  const closeHomeDetail = useCallback(() => {
    setHomeDetailOpen(false);
    homeTimerRef.current = setTimeout(() => setHomeDetailMounted(false), 300);
  }, []);

  /* ── Pointer 핸들러 ── */
  const handleHomePointerDown = useCallback((e) => {
    homeGestureRef.current = { startX: e.clientX, startY: e.clientY, tracking: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handleHomePointerMove = useCallback((e) => {
    const dx = e.clientX - homeGestureRef.current.startX;
    const dy = e.clientY - homeGestureRef.current.startY;
    if (!homeGestureRef.current.tracking) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) return;
      homeGestureRef.current.tracking = true;
    }
    setHomeDetailDragX(dx);
    setIsDraggingHome(true);
  }, []);

  const handleHomePointerUp = useCallback(() => {
    if (!isDraggingHome) return;
    setIsDraggingHome(false);

    if (homeDetailDragX > 80) {
      // 오른쪽 스와이프 → 히스토리 뒤로 or 닫기
      setHomeDetailDragX(0);
      if (homeHistIdx > 0) {
        setHomeHistIdx(i => i - 1);
      } else {
        closeHomeDetail();
      }
    } else if (homeDetailDragX < -80) {
      // 왼쪽 스와이프 → 스트림으로
      setHomeDetailDragX(0);
      setHomeExitDir('left');
      homeTimerRef.current = setTimeout(() => {
        setHomeDetailOpen(false);
        setHomeDetailMounted(false);
        setHomeExitDir(null);
        setActiveTab('stream');
      }, 280);
    } else {
      setHomeDetailDragX(0);
    }
  }, [homeDetailDragX, isDraggingHome, homeHistIdx, closeHomeDetail]);

  /* ── 상세 transform ── */
  const homeDetailItem = homeHistory[homeHistIdx] ?? null;

  const homeDetailTransform = homeExitDir === 'left'
    ? 'translateX(-100%)'
    : homeDetailOpen
      ? isDraggingHome ? `translateX(${homeDetailDragX}px)` : 'translateX(0)'
      : 'translateX(100%)';

  const homeDetailTransition = isDraggingHome
    ? 'none'
    : 'transform 0.28s cubic-bezier(0.32,0.72,0,1)';

  /* ── 렌더 ── */
  const Screen = SCREENS[activeTab] ?? StreamScreen;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 모바일 프레임 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 430,
          height: '100%',
          backgroundColor: '#111',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* 화면 영역 */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 60,
            overflow: 'hidden',
          }}
        >
          <Screen
            {...(activeTab === 'home' ? { onProductClick: openHomeDetail } : {})}
          />

          {/* 홈 상세 오버레이 */}
          {homeDetailMounted && homeDetailItem && (
            <div
              onPointerDown={handleHomePointerDown}
              onPointerMove={handleHomePointerMove}
              onPointerUp={handleHomePointerUp}
              onPointerCancel={handleHomePointerUp}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 40,
                transform: homeDetailTransform,
                transition: homeDetailTransition,
                willChange: 'transform',
              }}
            >
              {/* 히스토리 인디케이터 */}
              {homeHistory.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: 14, left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex', gap: 4,
                  zIndex: 10,
                }}>
                  {homeHistory.map((_, i) => (
                    <div key={i} style={{
                      width: i === homeHistIdx ? 16 : 4,
                      height: 4, borderRadius: 2,
                      backgroundColor: i === homeHistIdx
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(255,255,255,0.25)',
                      transition: 'width 0.2s ease',
                    }} />
                  ))}
                </div>
              )}
              <ProductDetailScreen item={homeDetailItem} onClose={closeHomeDetail} />
            </div>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </div>
    </div>
  );
}

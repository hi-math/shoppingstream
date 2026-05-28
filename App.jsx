// App.jsx

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
  const [detailHistory, setDetailHistory] = useState([]);
  const [detailIdx,     setDetailIdx]     = useState(0);

  /* ── 상세 페이지 스와이프 상태 ── */
  const [detailDragX,    setDetailDragX]    = useState(0);
  const [isDraggingDet,  setIsDraggingDet]  = useState(false);
  const [detailExiting,  setDetailExiting]  = useState(false); // 왼쪽 퇴장 중
  const detailGestureRef = useRef({ startX: 0, startY: 0, decided: false, isH: false });
  const detailTimerRef   = useRef(null);

  const isDetail          = activeTab === 'detail';
  const currentDetailItem = detailHistory[detailIdx] ?? null;

  /* ── 상품 열기 ── */
  const openDetail = useCallback((item) => {
    setDetailHistory(prev => {
      const deduped = prev.filter(p => p.id !== item.id);
      const next    = [...deduped, item].slice(-10);
      setDetailIdx(next.length - 1);
      return next;
    });
    setDetailDragX(0);
    setIsDraggingDet(false);
    setDetailExiting(false);
    setActiveTab('detail');
  }, []);

  /* ── 스트림으로 닫기 (왼쪽 퇴장 애니메이션 후) ── */
  const closeDetail = useCallback(() => {
    setDetailExiting(true);
    setIsDraggingDet(false);
    setDetailDragX(0);
    clearTimeout(detailTimerRef.current);
    detailTimerRef.current = setTimeout(() => {
      setDetailExiting(false);
      setActiveTab('stream');
    }, 280);
  }, []);

  /* ── 히스토리 이전 or 스트림 ── */
  const backDetail = useCallback(() => {
    setDetailDragX(0);
    setIsDraggingDet(false);
    if (detailIdx > 0) setDetailIdx(i => i - 1);
    else closeDetail();
  }, [detailIdx, closeDetail]);

  /* ── Pointer 핸들러 (touch-action: pan-y 와 함께 사용) ── */
  const handleDetPointerDown = useCallback((e) => {
    detailGestureRef.current = { startX: e.clientX, startY: e.clientY, decided: false, isH: false };
  }, []);

  const handleDetPointerMove = useCallback((e) => {
    const g  = detailGestureRef.current;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (!g.decided) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      g.decided = true;
      g.isH     = Math.abs(dx) > Math.abs(dy);
      if (g.isH) {
        // 수평으로 확정됐을 때만 포인터 캡처
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
      }
    }
    if (!g.isH) return;

    setDetailDragX(dx);
    setIsDraggingDet(true);
  }, []);

  const handleDetPointerUp = useCallback((e) => {
    if (!isDraggingDet) return;
    const dx = e.clientX - detailGestureRef.current.startX;
    if (dx > 80)       backDetail();
    else if (dx < -80) closeDetail();
    else { setDetailDragX(0); setIsDraggingDet(false); }
  }, [isDraggingDet, backDetail, closeDetail]);

  const handleDetPointerCancel = useCallback(() => {
    setDetailDragX(0);
    setIsDraggingDet(false);
  }, []);

  /* ── 상세 transform ── */
  const detailTransform = detailExiting
    ? 'translateX(-100%)'
    : isDraggingDet
      ? `translateX(${detailDragX}px)`
      : 'translateX(0)';

  const detailTransition = isDraggingDet
    ? 'none'
    : 'transform 0.28s cubic-bezier(0.32,0.72,0,1)';

  const Screen = SCREENS[activeTab] ?? StreamScreen;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        backgroundColor: '#0A0A0A',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%', maxWidth: 430, height: '100%',
          backgroundColor: '#111', overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 60, overflow: 'hidden' }}>

          {/* 상세 페이지 (홈에서 열린 경우) */}
          {isDetail && currentDetailItem && (
            <div
              onPointerDown={handleDetPointerDown}
              onPointerMove={handleDetPointerMove}
              onPointerUp={handleDetPointerUp}
              onPointerCancel={handleDetPointerCancel}
              style={{
                position: 'absolute', inset: 0,
                transform: detailTransform,
                transition: detailTransition,
                willChange: 'transform',
                touchAction: 'pan-y', // 수직 스크롤은 브라우저가 처리
                zIndex: 10,
              }}
            >
              <ProductDetailScreen
                item={currentDetailItem}
                onClose={closeDetail}
                onBack={detailIdx > 0 ? backDetail : null}
                historyTotal={detailHistory.length}
                historyIdx={detailIdx}
              />
            </div>
          )}

          {/* 나머지 탭 화면 */}
          {!isDetail && (
            <Screen
              {...(activeTab === 'home' ? { onProductClick: openDetail } : {})}
            />
          )}
        </div>

        <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </div>
    </div>
  );
}

// App.jsx

import React, { useState, useCallback } from 'react';
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

  // 홈 → 상세 히스토리 (최대 10개)
  const [detailHistory, setDetailHistory] = useState([]);
  const [detailIdx,     setDetailIdx]     = useState(0);

  const isDetail          = activeTab === 'detail';
  const currentDetailItem = detailHistory[detailIdx] ?? null;

  const openDetail = useCallback((item) => {
    setDetailHistory(prev => {
      const deduped = prev.filter(p => p.id !== item.id);
      const next    = [...deduped, item].slice(-10);
      setDetailIdx(next.length - 1);
      return next;
    });
    setActiveTab('detail');
  }, []);

  // 상세 → 스트림으로 항상 돌아감
  const closeDetail = useCallback(() => setActiveTab('stream'), []);

  // 히스토리 내 이전 상품 (없으면 스트림)
  const backDetail = useCallback(() => {
    if (detailIdx > 0) setDetailIdx(i => i - 1);
    else closeDetail();
  }, [detailIdx, closeDetail]);

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
        {/* 화면 영역 */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 60, overflow: 'hidden' }}>
          {isDetail && currentDetailItem ? (
            <ProductDetailScreen
              item={currentDetailItem}
              onClose={closeDetail}
              onBack={backDetail}
              historyTotal={detailHistory.length}
              historyIdx={detailIdx}
            />
          ) : (
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

// App.jsx — 앱 루트 엔트리

import React, { useState } from 'react';
import BottomNavBar from './components/BottomNavBar.jsx';
import HomeScreen     from './screens/HomeScreen.jsx';
import StreamScreen   from './screens/StreamScreen.jsx';
import CategoryScreen from './screens/CategoryScreen.jsx';
import BrandScreen    from './screens/BrandScreen.jsx';
import MyScreen       from './screens/MyScreen.jsx';

const SCREENS = {
  home:     HomeScreen,
  stream:   StreamScreen,
  category: CategoryScreen,
  brand:    BrandScreen,
  my:       MyScreen,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('stream');

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
          <Screen />
        </div>

        {/* 하단 네비게이션 */}
        <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      </div>
    </div>
  );
}

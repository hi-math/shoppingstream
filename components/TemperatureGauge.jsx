// TemperatureGauge.jsx — 성의 온도 게이지 (스트림 내부 전용, 수치 미노출)

import React from 'react';

/**
 * TemperatureGauge
 * 유저 선호 벡터에서 계산한 "성의 온도"를 막대 형태로만 시각화한다.
 * 수치(숫자)는 절대 표시하지 않는다.
 *
 * @param {number} value  - 0~100 사이의 내부 온도값
 * @param {string} style  - 인라인 스타일 override
 */
export default function TemperatureGauge({ value = 50, style }) {
  // 온도에 따른 색상 그라디언트
  const getColor = (v) => {
    if (v < 30) return '#6BB5FF';   // 차가움 — 파란색
    if (v < 60) return '#FFB347';   // 보통   — 주황색
    return '#FF4444';               // 뜨거움 — 붉은색
  };

  const clampedValue = Math.max(0, Math.min(100, value));
  const fillHeight = `${clampedValue}%`;
  const color = getColor(clampedValue);

  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 8,
        height: 120,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden="true"  // 보조기술에 숫자 미노출
    >
      {/* 채워지는 막대 (아래에서 위로) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: fillHeight,
          backgroundColor: color,
          borderRadius: 4,
          transition: 'height 0.5s ease, background-color 0.5s ease',
        }}
      />
      {/* 불꽃 아이콘 (최상단, 온도 높을 때 강조) */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 14,
          opacity: clampedValue > 70 ? 1 : 0.4,
          transition: 'opacity 0.3s ease',
        }}
      >
        🔥
      </div>
    </div>
  );
}

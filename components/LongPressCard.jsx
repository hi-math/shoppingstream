// LongPressCard.jsx — 꾹 누르기 시 상품 정보 카드 노출

import React from 'react';

/**
 * LongPressCard
 * 상품을 꾹 누를 때 하단에서 슬라이드 업되는 정보 카드.
 * 가격, 태그, 빠른 저장 버튼을 표시한다.
 *
 * @param {Object}   item      - 상품 데이터 (name, price, tags, brand)
 * @param {boolean}  visible   - 노출 여부
 * @param {Function} onSave    - 빠른 저장(찜) 콜백
 * @param {Function} onCart    - 장바구니 추가 콜백
 * @param {Function} onClose   - 닫기 콜백
 */
export default function LongPressCard({ item, visible, onSave, onCart, onClose }) {
  if (!item) return null;

  return (
    <>
      {/* 배경 딤 */}
      {visible && (
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 20,
          }}
        />
      )}

      {/* 정보 카드 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          backgroundColor: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '20px 24px 32px',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* 핸들 바 */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#E0E0E0',
            margin: '0 auto 16px',
          }}
        />

        {/* 브랜드 */}
        <p style={{ margin: '0 0 4px', fontSize: 12, color: '#999' }}>
          {item.brand}
        </p>

        {/* 상품명 */}
        <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>
          {item.name}
        </h2>

        {/* 가격 */}
        <p style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#FF4081' }}>
          {item.price.toLocaleString()}원
        </p>

        {/* 태그 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '4px 10px',
                borderRadius: 14,
                backgroundColor: '#FFF0F5',
                color: '#FF4081',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onSave}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 12,
              border: '2px solid #FF4081',
              backgroundColor: '#fff',
              color: '#FF4081',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ♡ 찜하기
          </button>
          <button
            onClick={onCart}
            style={{
              flex: 2,
              padding: '14px 0',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#FF4081',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🛒 장바구니 담기
          </button>
        </div>
      </div>
    </>
  );
}

// StreamScreen.jsx
// · 수직 스와이프: 현재/다음 카드 wrapper 두 개를 동시에 움직임 (YouTube Shorts 방식)
//   - 현재 카드: translateY(dragY)
//   - 다음 카드: translateY(calc(100% + dragY))  →  손을 떼면 동시에 스냅
// · 오른쪽 스와이프: 상세 패널이 왼쪽에서 따라옴 (기존 유지)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import StreamCard          from '../components/StreamCard.jsx';
import ProductDetailScreen from './ProductDetailScreen.jsx';
import useMomentum         from '../hooks/useMomentum.js';
import { rankFeed }        from '../engine/feedRanker.js';

export default function StreamScreen() {
  const { applyFeedback, _U } = useMomentum('default', '#생일');

  const [feed,     setFeed]     = useState([]);
  const seenIdsRef = useRef([]);   // ref로 관리 → stale closure 없음
  const [likedIds, setLikedIds] = useState(new Set());

  /* ──────────────────────────────────────────
   * 수직 스와이프 상태
   * ────────────────────────────────────────── */
  const [vertDragY,   setVertDragY]   = useState(0);
  const [vertDir,     setVertDir]     = useState(null);   // 'up' | 'down'
  const [isDraggingV, setIsDraggingV] = useState(false);
  const [isExitingV,  setIsExitingV]  = useState(false);  // commit 애니메이션 중
  const [skipTrans,   setSkipTrans]   = useState(false);   // 리셋 시 transition 억제
  const vertTimerRef  = useRef(null);

  /* ──────────────────────────────────────────
   * 오른쪽 드래그 / 상세 패널 상태
   * ────────────────────────────────────────── */
  const [rightDragX,      setRightDragX]      = useState(0);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [detailOpen,      setDetailOpen]      = useState(false);
  const [detailMounted,   setDetailMounted]   = useState(false);
  const [detailItem,      setDetailItem]      = useState(null);
  const unmountTimerRef = useRef(null);

  /* ── 피드 로드 ── */
  const loadFeed = useCallback((U, seen) => {
    const ranked = rankFeed(U, null, seen, 20); // 한 번에 20개 로드
    // 랭킹은 유지하되 약간 셔플 — 상위 절반에서 랜덤 순서
    const shuffled = [...ranked].sort(() => Math.random() - 0.5);
    setFeed(prev => [...prev, ...shuffled]);
  }, []);

  // feed.length가 3 미만일 때만 리필 (마운트 포함 — 중복 방지를 위해 첫 useEffect 제거)
  useEffect(() => {
    if (feed.length < 3) {
      const seen = seenIdsRef.current;
      const nextSeen = seen.length > 300 ? [] : seen;
      if (seen.length > 300) seenIdsRef.current = [];
      loadFeed(_U, nextSeen);
    }
  }, [feed.length]); // eslint-disable-line

  /* ──────────────────────────────────────────
   * 수직 드래그 콜백
   * ────────────────────────────────────────── */
  const handleVertDragStart = useCallback(() => {
    setIsDraggingV(true);
  }, []);

  const handleVertDrag = useCallback((dy) => {
    setVertDragY(dy);
    setVertDir(dy < 0 ? 'up' : 'down');
  }, []);

  const handleVertDragCancel = useCallback(() => {
    setIsDraggingV(false);
    setVertDragY(0);
    clearTimeout(vertTimerRef.current);
    // vertDir는 transition 후 정리
    vertTimerRef.current = setTimeout(() => setVertDir(null), 320);
  }, []);

  const handleVertCommit = useCallback((direction) => {
    setIsDraggingV(false);   // transition 활성화
    setIsExitingV(true);     // % 기반 exit transform으로 전환
    clearTimeout(vertTimerRef.current);

    vertTimerRef.current = setTimeout(() => {
      const topItem = feed[0];
      if (topItem) applyFeedback(topItem, direction === 'up' ? 'right' : 'left');

      // transition 비활성화 후 상태 리셋 (점프 방지)
      setSkipTrans(true);
      setIsExitingV(false);
      setVertDragY(0);
      setFeed(prev => prev.slice(1));
      if (topItem) { seenIdsRef.current = [...seenIdsRef.current, topItem.id]; }

      // 2 프레임 후 transition 재활성화
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setSkipTrans(false);
          setVertDir(null);
        })
      );
    }, 320);
  }, [feed, applyFeedback]);

  /* ──────────────────────────────────────────
   * 오른쪽 드래그 콜백 (기존 유지)
   * ────────────────────────────────────────── */
  const handleRightDragStart = useCallback(() => {
    clearTimeout(unmountTimerRef.current);
    setDetailMounted(true);
    setIsDraggingRight(true);
  }, []);

  const handleRightDrag = useCallback((dx) => {
    setRightDragX(dx);
  }, []);

  const handleRightDragCancel = useCallback(() => {
    setIsDraggingRight(false);
    setRightDragX(0);
    unmountTimerRef.current = setTimeout(() => setDetailMounted(false), 310);
  }, []);

  const handleRightSwipeCommit = useCallback(() => {
    const topItem = feed[0];
    if (!topItem) return;
    setDetailItem(topItem);
    setDetailOpen(true);
    setIsDraggingRight(false);
  }, [feed]);

  // 오른쪽 스와이프 후 카드 정리 (detail은 commit에서 이미 처리)
  const handleSwipe = useCallback((direction) => {
    if (direction === 'right') {
      const topItem = feed[0];
      if (!topItem) return;
      seenIdsRef.current = [...seenIdsRef.current, topItem.id];
      setFeed(prev => prev.slice(1));
    }
  }, [feed]);

  /* ── 좋아요 ── */
  const handleLike = useCallback((itemId) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  }, []);

  /* ── 상세 닫기 ── */
  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    unmountTimerRef.current = setTimeout(() => {
      setDetailMounted(false);
      setDetailItem(null);
    }, 310);
  }, []);

  /* ──────────────────────────────────────────
   * 수직 transform 계산
   *
   * isDraggingV → transition 없음 (실시간 추적)
   * isExitingV  → % 기반으로 퇴장/진입
   * idle/cancel → translateY(0) or translateY(100%)
   * ────────────────────────────────────────── */
  const currentCardTransform = isExitingV
    ? `translateY(${vertDir === 'up' ? -100 : 100}%)`
    : `translateY(${vertDragY}px)`;

  const nextCardTransform = isExitingV
    ? 'translateY(0)'
    : isDraggingV
      ? vertDir === 'up'
        ? `translateY(calc(100% + ${vertDragY}px))`   // 아래서 올라옴
        : `translateY(calc(-100% + ${vertDragY}px))`  // 위서 내려옴
      : 'translateY(100%)'; // idle: 화면 아래 대기

  const vertTransition = (isDraggingV || skipTrans)
    ? 'none'
    : 'transform 0.32s cubic-bezier(0.32,0.72,0,1)';

  /* ── 오른쪽 드래그 / 상세 패널 transform (기존 유지) ── */
  const detailTransform = detailOpen
    ? 'translateX(0)'
    : isDraggingRight
      ? `translateX(calc(-100% + ${rightDragX}px))`
      : 'translateX(-100%)';

  const detailTransition = isDraggingRight
    ? 'none'
    : 'transform 0.28s cubic-bezier(0.32,0.72,0,1)';

  const shownItem   = detailItem ?? feed[0] ?? null;
  const currentCard = feed[0] ?? null;
  const nextCard    = feed[1] ?? null;

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: '#111',
        overflow: 'hidden',
      }}
    >
      {/* ── 다음 카드 (아래/위에서 따라옴) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          transform: nextCardTransform,
          transition: vertTransition,
          willChange: 'transform',
        }}
      >
        {nextCard ? (
          <StreamCard
            key={nextCard.id}
            item={nextCard}
            isTop={false}
            liked={likedIds.has(nextCard.id)}
            onLike={() => handleLike(nextCard.id)}
          />
        ) : (
          <div style={{ height: '100%', backgroundColor: '#111' }} />
        )}
      </div>

      {/* ── 현재 카드 ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          transform: currentCardTransform,
          transition: vertTransition,
          willChange: 'transform',
        }}
      >
        {currentCard ? (
          <StreamCard
            key={currentCard.id}
            item={currentCard}
            isTop={true}
            liked={likedIds.has(currentCard.id)}
            onLike={() => handleLike(currentCard.id)}
            onVertDragStart={handleVertDragStart}
            onVertDrag={handleVertDrag}
            onVertDragCancel={handleVertDragCancel}
            onVertCommit={handleVertCommit}
            onRightDragStart={handleRightDragStart}
            onRightDrag={handleRightDrag}
            onRightDragCancel={handleRightDragCancel}
            onRightSwipeCommit={handleRightSwipeCommit}
            onSwipe={handleSwipe}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* ── 상세 패널 (기존 유지) ── */}
      {detailMounted && shownItem && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            transform: detailTransform,
            transition: detailTransition,
            willChange: 'transform',
          }}
        >
          <ProductDetailScreen item={shownItem} onClose={closeDetail} />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, backgroundColor: '#111', color: '#555',
    }}>
      <span style={{ fontSize: 52 }}>🎁</span>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
        새로운 선물을 불러오는 중…
      </p>
    </div>
  );
}

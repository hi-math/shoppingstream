// feedRanker.js — U 벡터 기반 피드 정렬

import { hybridSimilarity } from './vectorMath.js';
import giftDataset from '../data/gift_dataset.js';

/**
 * 유저 벡터 U 기준으로 상품 피드를 정렬한다.
 * @param {Object} U - 유저 벡터 { F, W, D, E }
 * @param {string|null} activeTag - 현재 활성 맥락 태그 (예: "#생일")
 * @param {string[]} seenIds - 이미 본 상품 ID 목록
 * @param {number} limit - 반환할 상품 수 (기본 10)
 * @returns {Array} 정렬된 상품 배열 (유사도 포함)
 */
export function rankFeed(U, activeTag = null, seenIds = [], limit = 10) {
  const candidates = giftDataset.filter((item) => !seenIds.includes(item.id));

  const scored = candidates.map((item) => {
    let score = hybridSimilarity(U, item.vector);

    // 활성 태그 매칭 보너스
    if (activeTag && item.tags.includes(activeTag)) {
      score += 0.15;
    }

    return { ...item, _score: Math.min(score, 1) };
  });

  // 유사도 내림차순 정렬 후 상위 limit개 반환
  return scored.sort((a, b) => b._score - a._score).slice(0, limit);
}

/**
 * 랜덤 셔플 (Cold Start 또는 다양성 주입용)
 * @param {string[]} seenIds
 * @param {number} limit
 */
export function shuffleFeed(seenIds = [], limit = 10) {
  const candidates = giftDataset.filter((item) => !seenIds.includes(item.id));
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * 태그 필터 피드
 * @param {string} tag
 * @param {Object} U
 * @param {number} limit
 */
export function tagFilteredFeed(tag, U, limit = 10) {
  const filtered = giftDataset.filter((item) => item.tags.includes(tag));
  const scored = filtered.map((item) => ({
    ...item,
    _score: hybridSimilarity(U, item.vector),
  }));
  return scored.sort((a, b) => b._score - a._score).slice(0, limit);
}

/**
 * 전체 피드 (331개) 점수 순 반환
 */
export function fullRankedFeed(U) {
  return giftDataset
    .map((item) => ({ ...item, _score: hybridSimilarity(U, item.vector) }))
    .sort((a, b) => b._score - a._score);
}

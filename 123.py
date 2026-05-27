"""
29cm 상품 이미지 다운로더
- CSV의 image_url 컬럼에 있는 이미지를 product_id.확장자 형식으로 저장
- 같은 URL이 여러 product_id에서 쓰이면, 한 번만 받고 각 product_id로 복사
- 이미 받은 파일은 건너뜀 (재실행 안전)

사용법:
    1) 이 스크립트를 CSV와 같은 폴더에 두기
    2) 터미널/명령프롬프트에서:
        python download_29cm_images.py
    3) 같은 폴더에 "images/" 폴더가 생기고 그 안에 저장됨
"""

import csv
import os
import sys
import time
import shutil
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# ===== 설정 =====
CSV_FILE = "29cm_products_2026-05-27.csv"  # 같은 폴더에 두기
OUTPUT_DIR = "images"                        # 저장 폴더
DELAY_SEC = 0.15                             # 요청 간 대기 (서버 부담 줄이기)
RETRY = 3                                    # 실패 시 재시도 횟수
TIMEOUT = 20                                 # 초

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.29cm.co.kr/",
}


def ext_from_url(url: str) -> str:
    path = urlparse(url).path
    ext = os.path.splitext(path)[1].lower()
    if ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        return ext
    return ".jpg"


def download(url: str, dst: Path) -> bool:
    for attempt in range(1, RETRY + 1):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=TIMEOUT) as resp:
                data = resp.read()
            dst.write_bytes(data)
            return True
        except (HTTPError, URLError, TimeoutError) as e:
            if attempt < RETRY:
                time.sleep(1.0 * attempt)
            else:
                print(f"  실패 [{url}]: {e}")
                return False
        except Exception as e:
            print(f"  예외 [{url}]: {e}")
            return False
    return False


def main():
    base = Path(__file__).parent.resolve()
    csv_path = base / CSV_FILE
    out_dir = base / OUTPUT_DIR
    out_dir.mkdir(exist_ok=True)

    if not csv_path.exists():
        print(f"CSV를 찾을 수 없습니다: {csv_path}")
        sys.exit(1)

    # CSV 읽기
    rows = []
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for r in reader:
            pid = (r.get("product_id") or "").strip()
            url = (r.get("image_url") or "").strip()
            if pid and url:
                rows.append((pid, url))

    print(f"총 {len(rows)}개 상품")
    unique_urls = sorted(set(u for _, u in rows))
    print(f"고유 이미지 URL {len(unique_urls)}개")
    print(f"저장 위치: {out_dir}\n")

    # URL -> 캐시 경로 (고유 URL은 임시 폴더에 1번만 받음)
    cache_dir = out_dir / "_cache"
    cache_dir.mkdir(exist_ok=True)

    url_to_cache = {}
    ok_dl, fail_dl = 0, 0

    for i, url in enumerate(unique_urls, 1):
        ext = ext_from_url(url)
        # 캐시 키: url의 마지막 파일명 부분
        cache_name = os.path.basename(urlparse(url).path) or f"img_{i}{ext}"
        cache_path = cache_dir / cache_name
        url_to_cache[url] = cache_path

        if cache_path.exists() and cache_path.stat().st_size > 0:
            ok_dl += 1
            continue

        print(f"[{i}/{len(unique_urls)}] {url}")
        if download(url, cache_path):
            ok_dl += 1
        else:
            fail_dl += 1
        time.sleep(DELAY_SEC)

    print(f"\n다운로드 완료: 성공 {ok_dl}, 실패 {fail_dl}")
    print("product_id별 파일 복사 중...")

    ok_cp, missing = 0, 0
    for pid, url in rows:
        src = url_to_cache.get(url)
        if not src or not src.exists():
            missing += 1
            continue
        ext = ext_from_url(url)
        dst = out_dir / f"{pid}{ext}"
        if not dst.exists():
            shutil.copy2(src, dst)
        ok_cp += 1

    print(f"product_id별 저장: {ok_cp}개 (누락 {missing})")
    print(f"\n완료. images/ 폴더 확인하세요. 캐시는 images/_cache/ 에 있습니다.")


if __name__ == "__main__":
    main()
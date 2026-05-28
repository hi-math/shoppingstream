// 1회성 R2 업로드 스크립트 — 실행 후 삭제해도 됨
// 사용: node upload-to-r2.mjs

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUCKET = 'shoppinstream';
const SRC_DIR = path.join(__dirname, 'dist');
const CONCURRENCY = 5; // 동시 업로드 수

const files = fs.readdirSync(SRC_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
console.log(`총 ${files.length}개 이미지 업로드 시작 (동시 ${CONCURRENCY}개)\n`);

async function uploadFile(fileName, index, total) {
  const filePath = path.join(SRC_DIR, fileName);
  return new Promise((resolve) => {
    try {
      execSync(
        `wrangler r2 object put "${BUCKET}/${fileName}" --file "${filePath}" --remote`,
        { stdio: 'pipe' }
      );
      console.log(`[${index}/${total}] OK: ${fileName}`);
      resolve({ ok: true, name: fileName });
    } catch (err) {
      console.log(`[${index}/${total}] FAILED: ${fileName}`);
      resolve({ ok: false, name: fileName });
    }
  });
}

async function main() {
  let success = 0, failed = 0;
  const failedFiles = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((f, j) => uploadFile(f, i + j + 1, files.length))
    );
    for (const r of results) {
      if (r.ok) success++;
      else { failed++; failedFiles.push(r.name); }
    }
  }

  console.log(`\n완료! 성공: ${success}, 실패: ${failed}`);
  if (failedFiles.length > 0) {
    console.log('실패 파일:', failedFiles.join(', '));
  }
}

main().catch(console.error);

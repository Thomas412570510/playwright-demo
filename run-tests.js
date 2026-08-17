const { spawnSync } = require('child_process');

// 1. 執行 Playwright 測試
console.log('--- 開始執行自動化測試 ---');
const testProcess = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });

// 2. 無論測試成功或失敗，都強制執行轉檔腳本
console.log('\n--- 準備進行影片轉檔 ---');
spawnSync('node', ['convert-video.js'], { stdio: 'inherit', shell: true });

// 3. 把原本測試的成功/失敗狀態回傳給系統
process.exit(testProcess.status);

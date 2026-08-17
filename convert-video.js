const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

// 告訴 fluent-ffmpeg 引擎在哪裡
ffmpeg.setFfmpegPath(ffmpegStatic);

const testResultsDir = path.join(__dirname, 'test-results');

if (!fs.existsSync(testResultsDir)) {
  console.log('找不到 test-results 資料夾。請先執行 npx playwright test。');
  process.exit(0);
}

// 遞迴尋找所有的 .webm 檔案
function findWebmFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findWebmFiles(filePath));
    } else if (filePath.endsWith('.webm')) {
      results.push(filePath);
    }
  });
  
  return results;
}

const webmFiles = findWebmFiles(testResultsDir);

if (webmFiles.length === 0) {
  console.log('沒有找到任何 .webm 影片檔。');
  process.exit(0);
}

console.log(`找到 ${webmFiles.length} 個影片，準備開始轉檔為 .mp4...`);

// 轉檔函數
function convertFile(webmPath) {
  return new Promise((resolve, reject) => {
    const mp4Path = webmPath.replace('.webm', '.mp4');
    
    // 如果已經存在 mp4 就跳過
    if (fs.existsSync(mp4Path)) {
      console.log(`[跳過] 已存在: ${mp4Path}`);
      return resolve();
    }

    console.log(`[轉檔中] ${webmPath} -> .mp4`);
    
    ffmpeg(webmPath)
      .output(mp4Path)
      .on('end', () => {
        console.log(`[完成] ${mp4Path}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`[失敗] ${webmPath}:`, err.message);
        reject(err);
      })
      .run();
  });
}

// 依序轉換所有檔案
async function run() {
  for (const file of webmFiles) {
    try {
      await convertFile(file);
    } catch (e) {
      // 忽略錯誤繼續下一個
    }
  }
  console.log('🎉 所有影片轉檔完成！您可以直接點擊 .mp4 播放了。');
}

run();

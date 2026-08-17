const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 啟動特製錄製器中... (已強制開啟全時截圖與軌跡追蹤)');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  // 開始啟動追蹤，這會自動在每個動作「截圖 (snapshots)」
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  
  const page = await context.newPage();
  
  console.log('--------------------------------------------------');
  console.log('✅ 已喚醒 Playwright Inspector！');
  console.log('👉 請在彈出的視窗中操作，您的每一次點擊都會被自動截圖紀錄。');
  console.log('👉 操作完畢後，請直接關閉瀏覽器，系統會自動將紀錄存檔。');
  console.log('--------------------------------------------------');
  
  let isSaved = false;

  // 監聽視窗關閉事件，確保一定會存檔
  page.on('close', async () => {
    if (!isSaved) {
      isSaved = true;
      console.log('📦 偵測到視窗關閉，正在打包您的操作截圖...');
      try {
        // 確保專屬資料夾存在
        const tracesDir = path.join(__dirname, 'manual-traces');
        if (!fs.existsSync(tracesDir)) {
          fs.mkdirSync(tracesDir);
        }

        // 自動計算是第幾個腳本
        const files = fs.readdirSync(tracesDir);
        const traceCount = files.filter(f => f.startsWith('trace-') && f.endsWith('.zip')).length + 1;
        const fileName = `trace-${traceCount}.zip`;
        const filePath = path.join(tracesDir, fileName);

        await context.tracing.stop({ path: filePath });
        await browser.close();
        console.log(`🎉 截圖軌跡存檔完成！`);
        console.log(`📁 檔案已安全存放至專屬資料夾: manual-traces/${fileName}`);
      } catch (e) {
        console.log('儲存時發生錯誤:', e.message);
      }
    }
  });

  try {
    // 開啟錄製器 (會停在這裡直到視窗關閉)
    await page.pause();
  } catch (err) {
    // 視窗手動關閉時可能會丟出錯誤，可以直接忽略
  }
})();

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
  console.log('👉 【重要】操作完畢後，請點擊 Inspector 錄製器上面的「Resume (播放鍵 ▶️)」來結束錄製。');
  console.log('👉 【警告】千萬不要直接按 X 關閉瀏覽器，否則系統來不及存檔！');
  console.log('--------------------------------------------------');
  
  try {
    // 開啟錄製器 (會停在這裡，直到按下 Resume 按鈕)
    await page.pause();

    // 當使用者按下 Resume，程式會走到這裡，此時瀏覽器還沒關閉，可以安全存檔
    console.log('📦 偵測到錄製結束，正在打包您的操作截圖...');
    
    const tracesDir = path.join(__dirname, 'manual-traces');
    if (!fs.existsSync(tracesDir)) {
      fs.mkdirSync(tracesDir);
    }

    const files = fs.readdirSync(tracesDir);
    const traceCount = files.filter(f => f.startsWith('trace-') && f.endsWith('.zip')).length + 1;
    const fileName = `trace-${traceCount}.zip`;
    const filePath = path.join(tracesDir, fileName);

    await context.tracing.stop({ path: filePath });
    console.log(`🎉 截圖軌跡存檔完成！`);
    console.log(`📁 檔案已安全存放至專屬資料夾: manual-traces/${fileName}`);

  } catch (err) {
    console.log('❌ 存檔失敗！您似乎直接點擊 X 關閉了瀏覽器，導致系統來不及將截圖打包。');
    console.log('💡 下次請記得點擊 Inspector 視窗上的「Resume (播放鍵 ▶️)」來正確結束錄製喔！');
  } finally {
    await browser.close().catch(() => {});
  }
})();

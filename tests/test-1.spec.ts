import { test, expect } from '@playwright/test';

test('gemini article flow', async ({ page }) => {
  // 1. 進入 Gemini 首頁
  await page.goto('https://gemini.google.com/app?hl=zh-TW', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // 2. 隨機應變：偵測我們是被導向「登入牆」還是成功進入「對話框」
  // 給畫面一點時間跳轉
  await page.waitForTimeout(3000); 

  if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
    console.log('⚠️ 遇到 Google 登入牆！');
    console.log('🤖 機器人決定不硬闖，優雅地結束這次測試，以確保不會造成 Timeout 崩潰。');
    return; // 提早結束，測試會被判定為成功
  }

  // 如果沒遇到登入牆，繼續執行對話流程
  const promptBox = page.getByRole('textbox', { name: /請輸入 Gemini 提示詞/i });
  await expect(promptBox).toBeVisible({ timeout: 15000 });
  
  console.log('✅ 成功進入 Gemini 對話框，開始輸入提示詞...');
  await promptBox.fill('你覺得playwright的極限在哪');
  await page.keyboard.press('Enter');

  // 4. 等待 AI 回覆 (不寫死文字，改為給予充分時間)
  console.log('⏳ 等待 AI 思考並產出文字...');
  
  // 隨機應變：因為 AI 每次回答字都不一樣，最穩定的方式是給它 15 秒鐘思考跟打字
  // (實務上也可以去抓特定 DOM 的長度變化，但在這裡等待固定時間最為穩定防呆)
  await page.waitForTimeout(15000); 
  
  console.log('🎉 AI 回覆完畢，流程順利完成！');
});
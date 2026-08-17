import { test, expect } from '@playwright/test';

test('gemini article flow', async ({ page }) => {
  // 1. 進入 Gemini 首頁
  await page.goto('https://gemini.google.com/app?hl=zh-TW', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // 2. 輸入提示詞
  const promptBox = page.getByRole('textbox', { name: /請輸入 Gemini 提示詞/i });
  await expect(promptBox).toBeVisible({ timeout: 30000 });
  await promptBox.fill('你覺得playwright的極限在哪');
  
  // 3. 送出提示詞 (按下 Enter 鍵)
  await page.keyboard.press('Enter');

  // 等待 AI 思考並產出文字 (因為我們沒有登入，這裡一定會等不到而 Timeout 失敗)
  const mechanism = page.getByText(/運作機制： Playwright 放棄了 Selenium/i).first();
  await expect(mechanism).toBeVisible({ timeout: 30000 });
  await mechanism.click();

  const browserContext = page.getByText(/由於每個 Browser Context 都是獨立的行程/i).first();
  await expect(browserContext).toBeVisible({ timeout: 30000 });
  await browserContext.click();

  const heading = page.getByRole('heading', {
    name: /瀏覽器與網路環境極限：動態渲染與反爬蟲機制/i,
  }).first();
  await expect(heading).toBeVisible({ timeout: 30000 });
  await heading.click();

  const finalText = page.getByText(/它不是萬能的爬蟲工具：/i).first();
  await expect(finalText).toBeVisible({ timeout: 30000 });
  await finalText.click();
});
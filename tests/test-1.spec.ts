import { test, expect } from '@playwright/test';

test('自動化待辦事項操作 (TodoMVC)', async ({ page }) => {
  // 1. 進入公開的測試網站 (無須登入)
  await page.goto('https://demo.playwright.dev/todomvc/');

  // 2. 找到輸入框
  const newTodo = page.getByPlaceholder('What needs to be done?');

  // 3. 快速輸入兩個待辦事項
  await newTodo.fill('學習 Playwright 自動化');
  await page.keyboard.press('Enter');
  
  await newTodo.fill('讓工作效率翻倍');
  await page.keyboard.press('Enter');

  // 4. 檢查是不是成功新增了兩筆？
  await expect(page.getByTestId('todo-title')).toHaveText([
    '學習 Playwright 自動化',
    '讓工作效率翻倍'
  ]);

  // 5. 點擊第一個待辦事項旁邊的「完成勾選框」
  await page.locator('.toggle').first().click();

  // 6. 檢查左下角的計數器，確認剩下 1 個未完成
  const todoCount = page.getByTestId('todo-count');
  await expect(todoCount).toContainText('1 item left');
});
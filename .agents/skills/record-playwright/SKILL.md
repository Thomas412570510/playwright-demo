---
name: record-playwright
description: Playwright 企業級擴充技能包 (極致隔離建置版)。包含自動安裝 VSCode 擴充、子資料夾專案隔離、指令無縫轉發器、注入截圖神器與轉檔引擎。當使用者要求「安裝環境」或「建置專案」時觸發。
---

# 🚀 Playwright 企業級擴充技能包 (極致隔離建置版)

## 🛠️ 第一階段：AI 自動安裝與極致隔離建置指令
當使用者在全新的空白資料夾中呼叫此技能，要求升級或安裝環境時，Agent **必須主動執行**以下安裝步驟：

1. **安裝 VSCode 官方擴充套件**：執行終端機指令 `code --install-extension ms-playwright.playwright`，幫使用者自動安裝 VSCode 左側的 Playwright 測試面板。
2. **建立隔離區與初始化**：
   - 在專案根目錄建立一個子資料夾：`playwright-tests/`。
   - **進入 `playwright-tests/` 資料夾內**，執行 Playwright 官方初始化指令建立基礎環境（例如 `npm create playwright@latest . --quiet --browser=chromium --lang=TypeScript`）。
3. **安裝進階依賴與引擎 (限隔離區內)**：
   - 在 `playwright-tests/` 內執行 `npm install ffmpeg-static fluent-ffmpeg`。
   - 將本技能庫 `scripts/` 資料夾底下的 `record-session.js` 與 `convert-video.js` 複製到 **`playwright-tests/`** 內。
4. **環境防護與配置魔改 (限隔離區內)**：
   - 修改 `playwright-tests/package.json`，在 `"scripts"` 中加入 `"codegen": "node record-session.js"`。
   - 修改 `playwright-tests/playwright.config.ts`，強制將 `use` 區塊改為：`trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `video: 'on'`。
   - 在 `playwright-tests/` 內生成 `.env` 與 `.env.example` 檔案（包含 ACCOUNT / PASSWORD 範例），並確保該目錄的 `.gitignore` 已忽略 `.env` 與 `manual-traces/`。
5. **VSCode 智慧連結**：在**根目錄**建立 `.vscode/settings.json`：
   ```json
   {
     "playwright.configPath": "playwright-tests/playwright.config.ts"
   }
   ```
6. **⭐ 建立指令無縫轉發器 (Proxy)**：在**根目錄**建立一個 `package.json`：
   ```json
   {
     "name": "playwright-enterprise-wrapper",
     "scripts": {
       "codegen": "cd playwright-tests && npm run codegen",
       "test": "cd playwright-tests && npm run test"
     }
   }
   ```
7. **完成回報與防呆提醒**：安裝完畢後向使用者回報。**【重要】** 必須提醒使用者：雖然裝了 VSCode 擴充功能，但請**不要**使用面板上的「Record new」按鈕，因為它會跳過防護網。請務必在根目錄直接下指令 `npm run codegen` 或對 AI 說「我要錄腳本」。

*(註：人機協作除錯 SOP 已升格至系統全域 Rule：`SOP-Directive.md` 內。)*

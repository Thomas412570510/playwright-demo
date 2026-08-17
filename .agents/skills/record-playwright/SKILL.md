---
name: record-playwright
description: Playwright 企業級擴充技能包 (雙資料夾極致隔離版)。包含自動安裝 VSCode 擴充、子資料夾專案隔離、指令無縫轉發器、注入截圖神器與轉檔引擎，並強制啟動人機協作除錯 SOP。當使用者要求「安裝環境」或「錄製腳本」時觸發。
---

# 🚀 Playwright 企業級擴充技能包 (極致隔離版)

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

---

## 🧠 第二階段：人機協作自動化測試 SOP (最高指令)
**【⚠️ 觸發條件】**：當專案安裝完畢，且使用者說出 **「我要錄腳本」** 時，Agent 必須嚴格按照以下 SOP 推進流程，絕對不可偏離。

### 1. 錄製階段
1. **[Agent]** 接收指令後，立刻在**根目錄**為使用者執行轉發引擎：`npm run codegen`。
2. **[使用者]** 開始在彈出的網頁上手動點擊錄製。
3. **[系統]** 在背景自動拍下每一步的截圖並打包成 `trace.zip`。

### 2. 測試與抓蟲階段
4. **[Agent]** 拿到錄好的腳本後，立刻啟動機器人進行自動化測試（於**根目錄**執行 `npm run test`）。
5. **[判定點] 測試過程中是否有報錯？**
   * 🚨 **如果「有報錯」：**
      1. 系統在崩潰瞬間，自動產出「急救截圖」與「崩潰軌跡」。
      2. **[看圖抓蟲]**：Agent 拿到急救截圖分析錯誤並修改腳本，然後重新測試。（本迴圈最多執行 **3 次**）
      3. **[看影片抓蟲]**：若看圖 3 次皆失敗，Agent 必須調閱「影片檔 (.mp4)」進行動態分析並修改腳本，然後重新測試。（本迴圈最多執行 **3 次**）
      4. **[最終回報]**：若共 6 次嘗試皆無法解決，Agent 必須停止嘗試，並直接向使用者回報「錯誤訊息 + (錯誤急救截圖) + 影片檔」，交由人類決策。
   * ✅ **如果「無報錯」：**
      1. 腳本順利跑完，進入下一步。

### 3. 確認與隱私收尾
6. **[Agent]** 確認腳本運行完美。
7. **[Agent]** 依據使用者的額外指示修改腳本（若有）。
8. **[Agent]** 進行安全收尾，將腳本中出現的私人資訊（如帳號密碼）抽離，寫進 `playwright-tests/.env` 檔中保護起來。
9. **[流程結束]** 完美收工！🎉

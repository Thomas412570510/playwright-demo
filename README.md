# Playwright 企業級自動化測試架構

這是一個經過深度優化、專為高穩定度與快速除錯打造的 Playwright 自動化專案。
本專案內建了「人類手動錄製輔助」與「機器人崩潰急救系統」，讓腳本的開發與除錯變得極度簡單且安全。

## 🌟 核心特色功能 (Features)

### 1. 🤖 具備「動態判斷」的智慧腳本
跳脫死板的錄製回放。以 `test-1.spec.ts` 為例，腳本內建了網址偵測邏輯 (`page.url().includes('login')`)。當遇到突發的登入牆或同意條款時，腳本會「看懂」畫面並自動判斷是否需要點擊同意，大幅提升跨帳號、跨環境的自動化穩定度。

### 2. 🎬 人類專屬：全時截圖錄製神器 (`npm run codegen`)
我們自創了一支客製化的啟動外掛 `record-session.js`，取代了官方陽春的錄影指令。
- **全時監控**：在您手動錄製腳本時，強迫底層追蹤引擎拍下您的每一次點擊與畫面變動。
- **自動歸檔**：錄製完畢並按下 Inspector 的 Resume (▶️) 後，系統會自動把截圖打包，免去繁瑣的檔案管理。
- **自動流水號**：軌跡檔會安全存放至專屬的 `manual-traces/` 資料夾，並自動命名為 `trace-1.zip`、`trace-2.zip`。

### 3. 🚨 機器人專屬：崩潰急救防護網
在 `playwright.config.ts` 中，我們設定了最強大的自動除錯防線。當機器人執行 `npm run test` 且發生非預期崩潰時：
- 🎥 **自動錄影**：留下完整的錄影，並透過 `convert-video.js` 無縫轉為通用的 `.mp4` 格式。
- 📷 **急救截圖**：在腳本報錯死掉的瞬間，自動拍下 `.png` 截圖 (`screenshot: 'only-on-failure'`)。
- 📦 **黑盒子軌跡**：保留出錯當下包含所有網路狀態與 DOM 的 `trace.zip` (`trace: 'retain-on-failure'`)。
所有急救檔案皆會整齊存放在 `test-results/` 中。

### 4. 🪶 隨插即用的輕量化免安裝環境
- 移除了容易引發跨平台環境衝突的 `dotenv`。
- 內建 `ffmpeg-static` 與 `fluent-ffmpeg` 轉檔引擎，不需在 Windows 系統層級手動安裝任何影音軟體。

---

## 🚀 快速上手指南

### 步驟一：在新電腦上建置環境
請在終端機依序輸入以下 4 行標準起手式指令：
```bash
# 1. 下載專案
git clone https://github.com/Thomas412570510/playwright-demo.git

# 2. 安裝依賴套件 (若公司網路擋 SSL 請保留後方參數)
npm install --strict-ssl=false

# 3. 安裝 Playwright 專屬瀏覽器 (極重要！)
npx playwright install chromium

# 4. 用 VSCode 開啟專案
code .
```

### 步驟二：日常開發與除錯指令
- **錄製新腳本 (附帶全自動截圖存檔)**：
  ```bash
  npm run codegen
  ```
  *(💡 錄完後，請務必點擊 Inspector 上的 ▶️ Resume 鍵來結束並存檔。)*

- **執行所有自動化測試 (自動轉檔 MP4 與產出急救包)**：
  ```bash
  npm run test
  ```

- **觀看黑盒子軌跡檔 (Trace Viewer 截圖檢視)**：
  ```bash
  # 請將檔名替換為您想查看的 zip
  npx playwright show-trace manual-traces/trace-1.zip
  ```

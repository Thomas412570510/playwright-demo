# 🎭 Playwright Enterprise Automation & Video Pipeline

[![Playwright](https://img.shields.io/badge/Playwright-v1.62-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()

> 企業級端到端（E2E）自動化測試解決方案，整合 **即時錄影轉檔 (.webm ➔ .mp4)**、**崩潰現場黑盒子軌跡追蹤 (Trace Viewer)** 與 **智慧例外防護** 機制。

---

## 🌟 核心特色 (Core Highlights)

- 🎬 **自訂全時錄製神器 (`npm run codegen`)**  
  封裝專屬的 `record-session.js`，啟動 Playwright Inspector 時強制啟用全時畫面快照（Snapshots）與事件軌跡追蹤。錄製完成後按下 Resume（▶️），系統自動依流水號歸檔至 `manual-traces/`。

- 🎥 **自動轉檔管線 (Video Transcoding)**  
  內建 `ffmpeg-static` 與 `fluent-ffmpeg` 轉檔引擎，測試結束後自動掃描 `test-results/`，將瀏覽器錄製的 WebM 影片一鍵轉換為可在任何播放器播放的 MP4 格式，無需本機預先安裝全域 FFmpeg。

- 🚨 **崩潰急救黑盒子 (Failure Diagnostics)**  
  在 `playwright.config.ts` 內建三道防護：
  1. `screenshot: 'only-on-failure'`：發生錯誤時精準捕捉崩潰當下 DOM 畫面。
  2. `trace: 'retain-on-failure'`：保存包含網路封包、Console 日誌、DOM 狀態的完整 ZIP 軌跡檔。
  3. `video: 'on'`：保留每場測試的動態影像。

- 🤖 **動態自適應腳本架構**  
  支援登入牆（Google SSO / Login Gate）自動偵測與條件分支，防止測試因偶發跳轉或驗證碼而超時卡死。

---

## 📂 目錄結構 (Project Structure)

```text
playwright-demo/
├── .agents/                    # 專案專屬 Agent 規則與 Skills 定義
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI 自動化測試腳本
├── manual-traces/              # 手動錄製的 Trace 追蹤歸檔 (.zip)
├── tests/                      # 測試腳本目錄
│   ├── test-1.spec.ts          # Gemini 流程動態測試
│   └── test-2.spec.ts          # Playwright 官方文件導航冒煙測試
├── .env.example                # 環境變數範例檔
├── convert-video.js            # WebM 轉 MP4 自動轉檔腳本
├── package.json                # 專案相依性與 NPM Scripts
├── playwright.config.ts        # Playwright 全域設定檔
├── record-session.js           # 增強版錄製器 (含全時快照與自動打包)
├── run-tests.js                # 測試執行調度器 (執行測試 + 觸發轉檔)
└── README.md                   # 專案技術說明文件
```

---

## 🚀 快速上手 (Quick Start)

### 1. 安裝環境需求

本專案支援 Node.js 18+ 與 Windows / macOS / Linux 環境：

```bash
# 1. 複製專案庫
git clone https://github.com/Thomas412570510/playwright-demo.git
cd playwright-demo

# 2. 安裝相依套件 (若公司環境驗證憑證受限可加上 --strict-ssl=false)
npm install

# 3. 安裝 Playwright 專用 Chromium 瀏覽器核心
npx playwright install chromium

# 4. 設定環境變數
cp .env.example .env
```

---

## 💻 常用指令 (NPM Scripts)

| 指令 | 說明 |
| :--- | :--- |
| `npm run test` | **執行所有測試**，並在執行完畢後自動將錄影轉換為 `.mp4` |
| `npm run test:headed` | 以**有頭瀏覽器 (GUI 畫面)** 模式執行測試，便於即時觀察 |
| `npm run codegen` | 啟動**特製錄影器**，自動記錄所有動作快照並輸出至 `manual-traces/` |
| `npm run convert-video` | 手動對 `test-results/` 底下的所有 `.webm` 進行轉檔 |
| `npm run show-report` | 開啟 Playwright 官方生成的 HTML 測試診斷報告 |

---

## 🔍 除錯與軌跡檢視 (Diagnostics)

### 檢視手動錄製的軌跡檔
手動錄製結束後，可使用 Playwright 內建的 Trace Viewer 查看完整時序圖與 DOM 變化：

```bash
npx playwright show-trace manual-traces/trace-1.zip
```

### 檢視自動測試崩潰軌跡
若自動測試失敗，進入 `test-results/` 目錄並開啟對應案例的 `trace.zip`：

```bash
npx playwright show-trace test-results/<測試案例資料夾>/trace.zip
```

---

## 🛡️ 安全注意事項 (Security)

- **請勿將真實帳號密碼提交至 Git**：專案已將 `.env` 列入 `.gitignore`。
- 本地開發請在 `.env` 中設定 `BASE_URL`、`TEST_USER_ID` 與 `TEST_USER_PWD`。
- CI/CD 執行時請透過 GitHub Repository Secrets 注入敏感變數。

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權。

# 🐾 毛孩找家 — 動物領養平台

這是一個以 **Docker Compose** 整合 **Angular（前端）+ Node.js（後端 API）+ PostgreSQL（資料庫）** 的動物領養平台初始專案空殼。啟動後即可開啟首頁，並即時從後端 API 與 PostgreSQL 讀取預設的待領養毛孩資料。

---

## 系統架構與預設埠號

| 服務 | 技術棧 | 容器名稱 | 預設網址 / Port |
| --- | --- | --- | --- |
| **前端 (Frontend)** | Angular 22 + Nginx | `animal-adoption-frontend` | [http://localhost:4200](http://localhost:4200) |
| **後端 (Backend)** | Node.js 20 + Express | `animal-adoption-backend` | [http://localhost:3000](http://localhost:3000) |
| **資料庫 (Database)** | PostgreSQL 16 | `animal-adoption-db` | `localhost:5432` |

> Nginx 會在容器內自動將 `/api/*` 反向代理轉發至後端 `http://backend:3000/api/*`，因此前後端不會有 CORS 跨網域問題。

---

## 一、事前準備（首次使用必看）

只需要安裝 **Git** 與 **Docker** 即可啟動本系統，**不需要手動安裝 Node.js、Angular CLI 或 PostgreSQL**。

### 1. 安裝 Git
- **Windows**：前往 [Git 官網](https://git-scm.com/download/win) 下載安裝檔，一路按 Next 完成即可。
- **macOS**：打開「終端機 (Terminal)」執行 `xcode-select --install`（或透過 [Homebrew](https://brew.sh/) 執行 `brew install git`）。
- **Ubuntu / Debian**：執行 `sudo apt update && sudo apt install -y git`。

### 2. 安裝並啟動 Docker
- **Windows / macOS**：
  1. 前往 [Docker Desktop 官網](https://www.docker.com/products/docker-desktop/) 下載對應版本（Windows 選 AMD64 / ARM64；Mac 依晶片選 Apple Silicon 或 Intel）。
  2. 安裝完成後**務必開啟 Docker Desktop 應用程式**，等待畫面左下角出現 **Engine running（綠燈）**。
  3. *(僅 Windows)* 若提示需要更新 WSL 2，請依畫面指示或以系統管理員身分開啟 PowerShell 執行 `wsl --install` 後重開機。
- **Linux**：請依 [Docker 官方文件](https://docs.docker.com/engine/install/) 安裝 Docker Engine 與 `docker-compose-plugin`。

安裝完成後，打開終端機（Windows 可用 PowerShell 或 Git Bash）確認指令可用：

```bash
docker --version
docker compose version
```

---

## 二、快速啟動系統（3 步驟）

### 步驟 1：取得專案程式碼

```bash
git clone <你的專案 Git 網址>
cd animal-adoption-platform
```

### 步驟 2：（選用）建立環境變數檔

專案已內建預設值，若想自訂資料庫帳密或 Port，可先複製範本：

- **macOS / Linux / Git Bash**：
  ```bash
  cp .env.example .env
  ```
- **Windows PowerShell**：
  ```powershell
  Copy-Item .env.example .env
  ```

### 步驟 3：建置並啟動所有容器

在專案根目錄（有 `docker-compose.yml` 的資料夾）執行：

```bash
docker compose up --build
```

> 第一次啟動會需要下載基礎映像檔並編譯 Angular 前端，約需 1～3 分鐘。  
> 若想在背景執行（不佔用終端機視窗），可加上 `-d`：
> ```bash
> docker compose up -d --build
> ```

---

## 三、驗證系統是否成功啟動

當終端機看到 `animal-adoption-backend` 顯示 `Backend API listening on http://0.0.0.0:3000` 且前端也啟動完成後，打開瀏覽器確認：

1. **前端首頁**：[http://localhost:4200](http://localhost:4200)
   - 右上角狀態列應顯示綠色的 **「PostgreSQL 已連線」**。
   - 頁面下方會顯示 4 隻預設的待領養毛孩卡片（豆漿、阿財、橘子、麻糬）。
2. **後端健康檢查 API**：[http://localhost:3000/api/health](http://localhost:3000/api/health)
   - 回傳 `"status": "ok"` 與 `"database": "connected"`。
3. **動物列表 API**：[http://localhost:3000/api/animals](http://localhost:3000/api/animals)
   - 回傳 PostgreSQL `animals` 資料表的 JSON 資料。

---

## 四、常用 Docker 管理指令

| 目的 | 指令 |
| --- | --- |
| 背景啟動系統 | `docker compose up -d` |
| 重新建置並啟動（修改程式或 Dockerfile 後） | `docker compose up -d --build` |
| 查看各服務運行狀態 | `docker compose ps` |
| 即時查看所有服務 log | `docker compose logs -f` |
| 停止並移除容器（**保留**資料庫資料） | `docker compose down` |
| 停止容器並**清空資料庫**（重新執行 `init.sql`） | `docker compose down -v` |

---

## 五、專案目錄結構

```text
animal-adoption-platform/
├── backend/                  # Node.js + Express 後端 API
│   ├── src/
│   │   ├── db.js             # PostgreSQL 連線池設定
│   │   └── index.js          # API 路由 (/api/health, /api/animals)
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql              # PostgreSQL 初始化建表與預設測試資料
├── frontend/                 # Angular 22 前端專案
│   ├── src/app/
│   │   ├── app.component.*   # 首頁畫面與 API 串接邏輯
│   │   └── app.config.ts     # HttpClient 設定
│   ├── Dockerfile            # 多階段建置並交由 Nginx 提供服務
│   ├── nginx.conf            # 前端靜態檔與 /api/ 反向代理設定
│   ├── proxy.conf.json       # 本機開發用的 API proxy 設定
│   └── package.json
├── .env.example              # 環境變數範本
├── docker-compose.yml        # 一鍵編排 db + backend + frontend
└── README.md
```

---

## 六、常見問題排解 (Troubleshooting)

1. **出現 `Cannot connect to the Docker daemon` 或類似錯誤**  
   → 請確認電腦上的 **Docker Desktop** 已經開啟並完成啟動（左下角顯示綠燈）。
2. **出現 `port is already allocated`（Port 4200 / 3000 / 5432 已被佔用）**  
   → 表示電腦上已有其他程式佔用了該 Port。可先執行 `cp .env.example .env`（或 `Copy-Item .env.example .env`），修改 `.env` 裡的 `FRONTEND_PORT`、`BACKEND_PORT` 或 `POSTGRES_PORT` 後再重新 `docker compose up -d`。
3. **修改了 `database/init.sql` 但資料庫內容沒更新**  
   → PostgreSQL 的 `init.sql` 只會在**第一次建立資料庫 volume** 時執行。請先執行 `docker compose down -v` 清除舊的 volume，再重新 `docker compose up --build`。

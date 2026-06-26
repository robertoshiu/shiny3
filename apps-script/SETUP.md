# ShinyLogic 聯絡表單後端 — 部署指南

> 技術背景：`Code.gs` 是一個 Google Apps Script Web app，container-bound 到一個 Google Sheet。
> 每次表單提交都會在 Sheet 新增一列，並寄送通知信到 `NOTIFY_EMAIL`。

---

## 部署步驟

### 1. 建立 Google 試算表

前往 [Google Sheets](https://sheets.google.com) 建立一個新的試算表。
名稱可自訂（例如 `ShinyLogic Inquiries`）。這份試算表就是所有諮詢紀錄的永久存檔。

### 2. 開啟 Apps Script 編輯器

在試算表頂部選單：**擴充功能 (Extensions)** → **Apps Script**。
刪除編輯器中的預設內容（`function myFunction() {}`），貼上 `Code.gs` 的全部內容，然後按儲存（Ctrl+S / Cmd+S）。

### 3. 設定通知信箱

在 `Code.gs` 頂端找到：

```js
var NOTIFY_EMAIL = 'roberto.hsu@gmail.com';
```

改成你想要收到通知信的 Gmail 信箱，然後再次儲存。

### 4. 部署為 Web App

1. 點選右上角 **Deploy** → **New deployment**
2. 類型（Type）選 **Web app**
3. **Execute as**：選 **Me（你自己的帳號）**
4. **Who has access**：選 **Anyone**（無需登入即可提交表單）
5. 按 **Deploy**
6. 第一次部署時 Google 會要求授權，點選「允許」以開放存取試算表與寄送 Email 的權限

> ⚠️ **【嚴重警告】「Who has access」必須選 Anyone，絕對不能選 "Anyone with Google account"**
>
> 這是最常見的隱性失敗原因，且**不會產生任何可見的錯誤訊息**：
>
> - **Anyone with Google account** 會在每次請求前強制導向 Google 登入頁。
>   因為網站使用 `fetch mode:"no-cors"` 提交表單，該登入導向會讓提交**靜默失敗**：
>   頁面仍正常顯示成功訊息，但 Sheet 沒有任何新資料、也不會寄出通知信——**每一筆詢問單都無聲消失**。
> - 如果 **「Anyone」選項是灰色或不存在**，表示你的帳號是 **Workspace（組織）帳號**，且管理員封鎖了公開 Web app。
>   解法二擇一：改用個人 **@gmail.com 帳號**重做整個 Apps Script（`NOTIFY_EMAIL` 仍可填任何信箱），
>   或請 Workspace 管理員開放「允許使用者部署公開 Web app」的權限。

### 5. 複製 Web App URL 並填入表單

部署完成後會出現一個 Web app URL，格式類似：

```
https://script.google.com/macros/s/AKfycby.../exec
```

將此 URL 貼到 `src/pages/contact.html` 的 form 標籤：

```html
<form ... data-endpoint="貼這裡">
```

### 6. 測試

- **健康檢查（必須用無痕 / 私密瀏覽視窗）**：開啟一個**無痕視窗**（確保已登出 Google 的狀態），
  直接輸入 `/exec` URL。必須看到：
  ```
  {"ok":true,"service":"shinylogic-contact","sheet":"Inquiries"}
  ```
  如果出現 **Google 登入頁面**，代表「Who has access」設定不是 **Anyone**——
  回到步驟 4，按照下方「重新部署」說明修正設定後再試一次。
  **唯有無痕視窗回傳 `ok:true` JSON，表單才算真正上線。**
- **端對端測試**：到網站實際送出一次表單，確認：
  - Google Sheet 新增一列資料（含時間戳記）
  - `NOTIFY_EMAIL` 信箱收到通知信

---

## 重要注意事項

### fetch `mode: "no-cors"` 與樂觀成功

瀏覽器使用 `fetch` 搭配 `mode: "no-cors"` 發送表單，因為 Apps Script 無法回傳 CORS headers。
這表示：

- 頁面**無法讀取**伺服器的回應內容（成功或失敗都看不到 response body）
- 頁面在送出後**樂觀顯示成功訊息**，只有網路中斷才能偵測到錯誤
- Quota 超額或伺服器例外**會靜默失敗**（用戶看到成功，但資料沒有寫入）

**Google Sheet 是唯一的真實來源（source of truth）**，請定期確認 Sheet 有正常寫入。

### Honeypot 反垃圾機制

表單中有一個對使用者隱藏的 `botcheck` 欄位。真實使用者不會填寫它；自動化機器人通常會填入值。
`Code.gs` 偵測到 `botcheck` 有值時，會靜默丟棄提交（回傳 `{ok:true}` 讓機器人沒有反饋訊號）。

### Gmail 寄件配額

使用個人 Gmail 帳號（consumer account）每天約可寄送 **100 封**通知信。
超過配額後，`MailApp.sendEmail` 會**靜默失敗**——資料仍會寫入 Sheet，但不會寄出通知信。
如需更高配額，可升級至 Google Workspace 帳號（每日可達 1,500 封）。

### 隱私與資料管控

所有諮詢資料儲存在**帳號擁有者的 Google 試算表**中。
帳號擁有者即為資料控制者（data controller），需自行遵守適用的隱私法規（例如 GDPR、個資法）。
資料不會傳輸到 Google 生態系以外的第三方服務。

### 重新部署（修改程式碼或存取設定）

需要更新程式碼，**或**需要修正「Who has access」等部署設定時，一律走以下流程以**保留同一個 `/exec` URL**：

1. **Deploy** → **Manage deployments**
2. 找到現有的 Web app 部署，點選 ✏️ 編輯圖示
3. Version 選 **New version**
4. 按 **Deploy**

直接儲存 `.gs` 檔案不會自動更新已部署的 Web app。

> ⚠️ **不要按「New deployment」**——那會產生**全新的 `/exec` URL**，
> 你必須把新 URL 重新貼回 `contact.html` 的 `data-endpoint` 並重新部署網站。
> 只有走「Manage deployments → 編輯現有部署 → New version」才能同時更新內容並保留原 URL。

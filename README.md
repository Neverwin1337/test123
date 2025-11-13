# 🎓 學生管理系統 API

基於 Express.js 和 MySQL 的完整學生管理系統後端 API，包含身份認證、權限控制和數據加密功能。

[![Tests Passing](https://img.shields.io/badge/tests-18%2F18%20passing-brightgreen)]()
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-blue)]()
[![MySQL](https://img.shields.io/badge/mysql-8.0-orange)]()

---

## 📚 文檔導航

| 文檔 | 描述 |
|------|------|
| [API.md](./API.md) | **API 接口文檔** - 詳細的接口說明、請求/響應格式 |
| [STRUCTURE.md](./STRUCTURE.md) | **代碼結構文檔** - 項目架構、文件組織、技術棧 |
| [WORKFLOW.md](./WORKFLOW.md) | **代碼流程文檔** - 各功能的執行流程圖和數據流 |

---

## ✨ 主要功能

### 🔐 安全特性
- ✅ **AES 數據加密**: 使用 MySQL AES_ENCRYPT/AES_DECRYPT 加密敏感數據
- ✅ **Signed Cookies**: 防止 Cookie 篡改的簽名機制
- ✅ **權限控制**: 基於角色的訪問控制（RBAC）
- ✅ **Master Key**: 超級管理員繞過機制

### 👥 用戶管理
- ✅ 學生管理（CRUD）
- ✅ 員工管理（CRUD）
- ✅ 家長管理（CRUD）
- ✅ 多類型登入（員工/學生/Master）

### 📊 業務功能
- ✅ 成績管理（ARO 角色專屬）
- ✅ 紀律記錄管理（DRO 角色專屬）
- ✅ 課程管理
- ✅ 學生-家長關聯

---

## 🚀 快速開始

### 1. 環境要求

- Node.js >= 14.0.0
- MySQL 8.0
- Yarn 或 npm

### 2. 安裝依賴

```bash
yarn install
# 或
npm install
```

### 3. 配置數據庫

創建 `src/config.js`:

```javascript
export default {
  PORT: 3000,
  DB_HOST: "your-mysql-host",
  DB_USER: "root",
  DB_PASSWORD: "your-password",
  DB_NAME: "polyu",
  AES_KEY: "your-aes-encryption-key",
  COOKIE_SECRET: "your-cookie-secret",
  MASTER_KEY: "your-master-key"
};
```

### 4. 初始化數據庫

```bash
# 執行 SQL 結構文件
mysql -u root -p < comp3335.sql

# （可選）導入測試數據
mysql -u root -p polyu < testdata.sql
```

### 5. 啟動服務器

```bash
yarn start
# 或
npm start
```

服務器將在 `http://localhost:3000` 啟動。

### 6. 運行測試

```bash
yarn test
# 或
npm test
```

---

## 📖 API 使用示例

### 🔑 Master Key 登入

```bash
curl -X POST http://localhost:3000/api/auth/master/login \
  -H "Content-Type: application/json" \
  -d '{"masterKey": "polyusecretkeyforTest"}' \
  -c cookies.txt
```

### 👨‍💼 員工登入

```bash
curl -X POST http://localhost:3000/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email": "huang@staff.com", "password": "staff01!"}' \
  -c cookies.txt
```

### 👨‍🎓 獲取學生列表

```bash
curl -X GET http://localhost:3000/api/students \
  -b cookies.txt
```

### 📊 添加成績（需要 ARO 角色）

```bash
curl -X POST http://localhost:3000/api/grades/AddGrading \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "student_id": 1,
    "course_id": 1,
    "term": "2024春",
    "grade": "95",
    "comments": "表現優秀"
  }'
```

更多示例請查看 [API.md](./API.md)

---

## 🏗️ 項目結構

```
database/
├── src/
│   ├── controllers/       # 業務邏輯控制器
│   ├── routes/           # API 路由定義
│   ├── middleware/       # 認證和權限中間件
│   ├── config.js         # 配置文件
│   ├── db.js            # 數據庫連接
│   └── index.js         # 應用入口
├── migrations/          # 數據庫遷移腳本
├── comp3335.sql        # 數據庫表結構
├── testdata.sql        # 測試數據
├── test-api.js         # API 測試腳本
└── package.json        # 項目配置
```

詳細結構請查看 [STRUCTURE.md](./STRUCTURE.md)

---

## 🛡️ 權限系統

### 用戶類型

| 類型 | 登入方式 | 權限範圍 |
|------|---------|---------|
| **Master** | Master Key | 所有權限（繞過檢查） |
| **Staff** | Email + Password | 根據 role 不同 |
| **Student** | Email + Password | 只能訪問自己的數據 |

### 員工角色

| 角色 | 權限 |
|------|------|
| **ARO** | Academic Records Officer - 成績管理 |
| **DRO** | Disciplinary Records Officer - 紀律記錄管理 |
| **其他** | 普通員工權限 |

---

## 🔐 數據加密

### 加密字段

系統使用 MySQL AES_ENCRYPT/AES_DECRYPT 加密以下敏感數據：

- ✅ 密碼 (password)
- ✅ 郵箱 (email)
- ✅ 電話 (phone)
- ✅ 身份證號 (identification_number)
- ✅ 地址 (address)
- ✅ 成績 (grade)
- ✅ 評語 (comments)
- ✅ 紀律描述 (descriptions)

### Cookie 安全

```javascript
{
  httpOnly: true,              // 防止 XSS
  signed: true,                // 防止篡改
  sameSite: 'strict',          // 防止 CSRF
  secure: process.env.NODE_ENV === 'production'  // HTTPS only
}
```

---

## 🧪 測試

項目包含完整的自動化測試腳本：

```bash
yarn test
```

### 測試覆蓋範圍

- ✅ Master Key 登入
- ✅ 員工登入
- ✅ 學生登入
- ✅ 數據查詢（學生/成績/紀律/員工/家長/課程）
- ✅ 權限控制（學生只能訪問自己）
- ✅ 角色權限（ARO/DRO）
- ✅ 未登入訪問攔截

**測試結果**: 18/18 通過 ✅

---

## 📊 數據庫設計

### 核心表結構

```
students (學生表)
  ├─ id, password, name, gender
  ├─ identification_number (加密)
  ├─ address (加密)
  ├─ email (加密)
  ├─ phone (加密)
  └─ guardian_id (外鍵)

staffs (員工表)
  ├─ id, password, name, gender
  ├─ role (ARO/DRO/其他)
  ├─ department
  └─ email (加密)

grades (成績表)
  ├─ student_id (外鍵)
  ├─ course_id (外鍵)
  ├─ term, grade (加密)
  └─ comments (加密)

disciplinary_records (紀律表)
  ├─ student_id (外鍵)
  ├─ staff_id (外鍵)
  ├─ date
  └─ descriptions (加密)
```

---

## 🛠️ 技術棧

### 後端框架
- **Express.js** - Web 應用框架
- **Knex.js** - SQL 查詢構建器
- **mysql2** - MySQL 數據庫驅動

### 安全
- **cookie-parser** - Cookie 解析和簽名
- **MySQL AES** - 數據庫層加密

### 開發工具
- **Node.js** - JavaScript 運行環境
- **node-fetch** - HTTP 客戶端（測試）
- **ESM** - ES6 模塊系統

---

## 📝 開發指南

### 添加新 API 端點

1. 在 `src/controllers/` 創建控制器函數
2. 在 `src/routes/` 定義路由
3. 在 `src/index.js` 註冊路由
4. 更新 API 文檔

### 添加新權限

1. 在 `src/middleware/auth.js` 添加中間件
2. 在路由中使用新中間件
3. 更新文檔

### 數據加密/解密

```javascript
// 加密 - INSERT
INSERT INTO table (email) 
VALUES (AES_ENCRYPT(?, ?))
參數: [email, config.AES_KEY]

// 解密 - SELECT
SELECT CAST(AES_DECRYPT(email, ?) AS CHAR) as email
FROM table
參數: [config.AES_KEY]
```

---

## ⚠️ 生產環境配置

部署到生產環境前，請務必修改以下配置：

```javascript
// src/config.js
export default {
  AES_KEY: "強密碼-至少32字符",
  COOKIE_SECRET: "強密碼-至少32字符",
  MASTER_KEY: "強密碼-至少32字符",
  
  // 啟用 HTTPS
  // secure: true (在 Cookie 配置中)
};
```

### 安全檢查清單

- [ ] 修改所有默認密鑰
- [ ] 啟用 HTTPS
- [ ] 設置環境變量而非硬編碼
- [ ] 配置防火牆規則
- [ ] 定期備份數據庫
- [ ] 啟用 MySQL SSL 連接
- [ ] 設置 rate limiting
- [ ] 配置日誌監控

---

## 🐛 故障排除

### Cookie 未保存
- 確保設置了 `COOKIE_SECRET`
- 檢查客戶端是否支持 Cookie

### 數據解密失敗
- 確認 `AES_KEY` 與加密時一致
- 檢查數據庫字段類型為 `BLOB`

### 權限被拒絕
- 確認已登入並有正確的 Cookie
- 檢查用戶角色是否符合要求

---

## 📄 許可證

本項目僅供學習和開發使用。

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📞 聯繫方式

如有問題，請查看文檔或創建 Issue。

---

**🎉 祝你使用愉快！**

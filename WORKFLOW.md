# 🔄 代碼流程文檔

詳細說明系統各個功能的執行流程和數據流轉。

---

## 🔐 1. 員工登入流程

```
客戶端請求
  ↓
POST /api/auth/staff/login
Body: { email, password }
  ↓
路由: src/routes/auth.js
  ↓
控制器: authController.staffLogin
  ├─ 1. 驗證參數 (email, password)
  ├─ 2. 查詢數據庫並解密
  │    SELECT id, name, role,
  │    CAST(AES_DECRYPT(email, KEY) AS CHAR) as email,
  │    CAST(AES_DECRYPT(password, KEY) AS CHAR) as pwd
  │    FROM staffs
  ├─ 3. 查找匹配的 email
  ├─ 4. 驗證密碼
  ├─ 5. 設置 Signed Cookies
  │    - userId (httpOnly, signed)
  │    - userType = "staff"
  └─ 6. 返回成功響應
       { success: true, data: { id, name, role } }
```

---

## 👨‍🎓 2. 學生訪問自己數據流程

```
客戶端請求
  ↓
GET /api/students/:id
Cookie: userId=1; userType=student
  ↓
路由: src/routes/student.js
  ↓
中間件鏈
  ├─ authenticate
  │    ├─ 檢查 Master Key (Header)
  │    ├─ 檢查 Signed Cookies
  │    └─ 設置 req.userId, req.userType
  │
  └─ requireSelfOrStaff
       ├─ Master Key → 通過
       ├─ Staff → 通過
       └─ Student → 檢查 ID 是否匹配
            if (req.params.id !== req.userId)
              return 403 "只能訪問自己的資料"
  ↓
控制器: getStudentById
  ├─ 查詢數據庫（解密）
  │    SELECT *, 
  │    CAST(AES_DECRYPT(email, KEY) AS CHAR) as email
  │    FROM students WHERE id = ?
  └─ 返回成功響應
```

---

## 📊 3. ARO 添加成績流程

```
客戶端請求
  ↓
POST /api/grades/AddGrading
Cookie: userId=5; userType=staff
Body: { student_id, course_id, term, grade, comments }
  ↓
路由: src/routes/aro.js
  ↓
中間件鏈
  ├─ authenticate
  │    └─ 驗證登入狀態
  │
  └─ requireRole("ARO")
       ├─ 檢查 Master Key → 通過
       ├─ 檢查 userType === "staff"
       ├─ 查詢員工角色
       │    SELECT role FROM staffs WHERE id = req.userId
       └─ 驗證 role === "ARO"
            if (role !== "ARO")
              return 403 "需要ARO角色"
  ↓
控制器: addGrade
  ├─ 驗證參數
  ├─ 插入數據庫（加密）
  │    INSERT INTO grades (
  │      student_id, course_id, term,
  │      grade, comments
  │    ) VALUES (
  │      ?, ?,?, 
  │      AES_ENCRYPT(?, KEY),
  │      AES_ENCRYPT(?, KEY)
  │    )
  └─ 返回成功響應
       { success: true, data: { id } }
```

---

## ➕ 4. 添加學生完整流程

```
1. 客戶端發送請求
   POST /api/students
   Body: { password, last_name, email, ... }

2. Express 接收請求
   ↓
3. 路由匹配
   router.post("/", authenticate, requireStaff, addStudent)
   ↓
4. authenticate 中間件
   ├─ 檢查 Master Key
   ├─ 檢查 Signed Cookies
   └─ 設置 req.userId, req.userType
   ↓
5. requireStaff 中間件
   └─ 驗證 userType === "staff"
   ↓
6. addStudent 控制器
   ├─ 提取請求數據
   ├─ 驗證必填字段
   ├─ 執行插入（加密敏感數據）
   │    INSERT INTO students (
   │      password, email, phone, ...
   │    ) VALUES (
   │      AES_ENCRYPT(?, KEY),
   │      AES_ENCRYPT(?, KEY),
   │      AES_ENCRYPT(?, KEY),
   │      ...
   │    )
   └─ 返回新 ID
   ↓
7. 客戶端接收響應
```

---

## 🔄 5. 更新學生信息流程

```
1. 發送更新請求
   POST /api/students/edit/:id
   Body: { last_name, email, ... }

2. 通過權限驗證
   authenticate → requireSelfOrStaff

3. editStudent 控制器
   ├─ 提取 ID 和更新數據
   ├─ 動態構建 UPDATE 語句
   │    UPDATE students SET
   │      last_name = ?,
   │      email = AES_ENCRYPT(?, KEY),
   │      ...
   │    WHERE id = ?
   └─ 返回成功響應

4. 客戶端接收響應
```

---

## 🔐 6. 數據加密流程

### 寫入（加密）

```
明文數據
  ↓
控制器接收: email = "user@example.com"
  ↓
SQL 語句: INSERT INTO table (email)
          VALUES (AES_ENCRYPT(?, ?))
  ↓
參數綁定: [email, AES_KEY]
  ↓
MySQL 執行: AES_ENCRYPT('user@example.com', 'key')
  ↓
存儲格式: <Buffer a1 b2 c3 ...> (二進制)
  ↓
數據庫保存加密數據
```

### 讀取（解密）

```
數據庫查詢
  ↓
SQL 語句: SELECT 
          CAST(AES_DECRYPT(email, ?) AS CHAR) as email
          FROM table
  ↓
參數綁定: [AES_KEY]
  ↓
MySQL 執行: 
  AES_DECRYPT(<Buffer>, 'key') → 二進制
  CAST(... AS CHAR) → 'user@example.com'
  ↓
控制器接收: email = "user@example.com"
  ↓
返回給客戶端: { email: "user@example.com" }
```

---

## 🛡️ 7. 權限控制流程圖

```
                    請求進入
                       ↓
              ┌────────────────┐
              │  authenticate  │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    Master Key?   Cookie OK?   Cookie 無效
         │            │            │
         ↓            ↓            ↓
      通過 ✓        通過 ✓       拒絕 ✗
         │            │         (401)
         └────────────┤
                      │
              ┌───────▼────────┐
              │  權限中間件     │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    requireStaff  requireRole  requireSelfOrStaff
         │            │            │
         ↓            ↓            ↓
    檢查員工身份   檢查角色      檢查ID匹配
         │            │            │
         ↓            ↓            ↓
      通過/拒絕     通過/拒絕     通過/拒絕
         │            │            │
         └────────────┴────────────┘
                      │
              ┌───────▼────────┐
              │   控制器執行    │
              └────────────────┘
```

---

## 📝 8. 完整請求生命週期

```
1. 客戶端發送 HTTP 請求
   ├─ URL: http://localhost:3000/api/students
   ├─ Method: GET
   ├─ Headers: Cookie: userId=1; userType=staff
   └─ Body: (可選)

2. Express 接收請求
   └─ app.use(express.json())  // 解析 JSON
   └─ app.use(cookieParser())   // 解析 Cookie

3. 路由匹配
   └─ app.use("/api/students", studentRoutes)

4. 中間件執行（順序執行）
   ├─ authenticate
   ├─ requireStaff / requireRole / requireSelfOrStaff
   └─ 任一中間件可以中斷請求（return）

5. 控制器執行
   ├─ try { ... }
   ├─   數據庫操作
   ├─   返回響應: res.json({ success, data })
   └─ catch (error) { ... }
        返回錯誤: res.status(500).json({ success: false })

6. 響應返回客戶端
   └─ HTTP Response
        Status: 200 / 400 / 401 / 403 / 500
        Body: JSON
        Headers: Set-Cookie (可選)
```

---

## 🔄 9. Master Key 繞過流程

```
請求包含 Master Key
  ↓
Header: x-master-key = "polyusecretkeyforTest"
  ↓
authenticate 中間件
  ├─ 檢查 req.headers['x-master-key']
  ├─ if (masterKey === config.MASTER_KEY)
  │    req.isMaster = true
  │    return next()  // 直接通過
  └─ 否則繼續檢查 Cookie
  ↓
所有權限中間件
  ├─ if (req.isMaster) return next()  // 直接通過
  └─ 否則檢查正常權限
  ↓
控制器執行
```

---

## 📊 10. 錯誤處理流程

```
控制器執行
  ↓
try {
  ├─ 參數驗證
  │    if (!required) → 400 錯誤
  │
  ├─ 數據庫操作
  │    await db.raw(...)
  │
  └─ 返回成功響應
       res.json({ success: true, ... })
}
catch (error) {
  └─ 捕獲異常
       res.status(500).json({
         success: false,
         message: error.message
       })
}
```

---

## 🧪 11. 測試流程

```
test-api.js 執行
  ↓
1. Master Key 登入
   └─ 保存 Cookies
  ↓
2. 測試各種查詢
   ├─ GET /api/students (帶 Cookie)
   ├─ GET /api/grades (帶 Cookie)
   └─ ...
  ↓
3. 測試員工登入
   ├─ POST /api/auth/staff/login
   └─ 保存新 Cookies
  ↓
4. 測試學生登入
   ├─ POST /api/auth/student/login
   └─ 保存新 Cookies
  ↓
5. 測試權限控制
   ├─ 學生訪問自己數據 → 應該成功
   ├─ 學生訪問他人數據 → 應該失敗 (403)
   └─ 學生訪問成績管理 → 應該失敗 (403)
  ↓
6. 測試角色權限
   ├─ 創建 ARO 員工 (Master Key)
   ├─ ARO 登入
   ├─ ARO 訪問成績 → 應該成功
   ├─ ARO 訪問紀律 → 應該失敗 (403)
   └─ ...
  ↓
7. 統計測試結果
   └─ 通過/失敗/成功率
```

---

## 🔑 關鍵流程總結

| 流程 | 入口 | 中間件 | 控制器 | 特點 |
|------|------|--------|--------|------|
| 員工登入 | POST /auth/staff/login | 無 | staffLogin | 設置 Cookie |
| 學生登入 | POST /auth/student/login | 無 | studentLogin | 設置 Cookie |
| 查詢學生 | GET /students/:id | authenticate + requireSelfOrStaff | getStudentById | 解密數據 |
| 添加學生 | POST /students | authenticate + requireStaff | addStudent | 加密數據 |
| 添加成績 | POST /grades/AddGrading | authenticate + requireRole("ARO") | addGrade | 角色檢查 |
| 添加紀律 | POST /disciplinary/AddDisciplinary | authenticate + requireRole("DRO") | addDisciplinaryRecord | 角色檢查 |

---

## 📌 注意事項

1. **所有中間件按順序執行**，任一中間件可以中斷請求
2. **Master Key 可繞過所有權限檢查**，僅用於測試和管理
3. **敏感數據必須加密存儲**，查詢時必須解密
4. **Signed Cookies 防止篡改**，使用 `req.signedCookies` 讀取
5. **錯誤統一處理**，使用 try-catch 捕獲異常

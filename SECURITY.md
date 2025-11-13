# 🔒 安全機制文檔

## Cookie安全

### ✅ 已實現嘅保護

#### 1. **Signed Cookies（簽名Cookie）**
```javascript
res.cookie("userId", staff.id, {
  signed: true,  // 用HMAC簽名，防止篡改
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
});
```

**防護效果：**
- ✅ 防止用戶修改cookie內容
- ✅ 如果cookie被改過，簽名驗證會失敗
- ✅ 需要`COOKIE_SECRET`密鑰先可以偽造

**工作原理：**
```
原始cookie: userId=123
簽名後: userId=s:123.HMAC_SIGNATURE
        ↑      ↑
      內容   用COOKIE_SECRET生成嘅簽名
```

如果黑客改咗內容：
```
userId=s:999.HMAC_SIGNATURE  ❌ 簽名唔match，會被拒絕
```

---

#### 2. **httpOnly Flag**
```javascript
httpOnly: true  // JavaScript讀唔到呢個cookie
```

**防護效果：**
- ✅ 防XSS攻擊偷cookie
- ✅ `document.cookie`讀唔到
- ✅ 淨係HTTP請求會自動帶上

---

#### 3. **sameSite='strict'**
```javascript
sameSite: 'strict'  // 跨站請求唔會帶cookie
```

**防護效果：**
- ✅ 防CSRF攻擊
- ✅ 如果喺其他網站發請求，唔會帶cookie
- ✅ 淨係同源請求先會有cookie

**例子：**
```html
<!-- 黑客網站 evil.com -->
<form action="http://yoursite.com/api/students/edit/1" method="POST">
  <!-- 呢個POST request唔會帶cookie，因為sameSite='strict' ✅ -->
</form>
```

---

#### 4. **secure Flag（生產環境）**
```javascript
secure: process.env.NODE_ENV === 'production'  // 生產環境用HTTPS
```

**防護效果：**
- ✅ 生產環境淨係透過HTTPS傳cookie
- ✅ 防中間人攻擊偷cookie
- 🔧 開發環境用HTTP都得

---

## 登入安全

### 員工登入
```javascript
// ✅ 用ID + 密碼
const staff = await db("staffs").where({ id }).first();
if (!staff || staff.password !== password) {
  return res.status(401).json({ message: "账号或密码错误" });
}
```

### 學生登入
```javascript
// ✅ 用Email + 密碼
// Email加密存儲，登入時解密比對
const students = await db.raw(
  `SELECT id, password, 
   CAST(AES_DECRYPT(email, ?) AS CHAR) as decrypted_email
   FROM students`,
  [config.AES_KEY]
);
const student = students[0].find(s => s.decrypted_email === email);
```

**優點：**
- ✅ Email係加密存儲嘅，保護私隱
- ✅ 用Email登入更加安全同方便
- ✅ 密碼明文比對（建議之後改用bcrypt hash）

---

## 數據加密

### MySQL AES加密
```javascript
// 加密
AES_ENCRYPT(data, key)

// 解密
CAST(AES_DECRYPT(encrypted_data, key) AS CHAR)
```

**加密嘅字段：**
- `students.email` ✅
- `students.phone` ✅
- `students.address` ✅
- `students.identification_number` ✅
- `guardians.email` ✅
- `guardians.phone` ✅
- `staffs.email` ✅
- `staffs.phone` ✅
- `staffs.address` ✅
- `staffs.identification_number` ✅
- `grades.grade` ✅
- `grades.comments` ✅
- `disciplinary_records.descriptions` ✅

---

## 權限控制

### 三層驗證
```javascript
router.post("/AddGrading",
  authenticate,        // 1. 驗證登咗入未
  requireRole("ARO"),  // 2. 驗證有冇ARO role
  addGrade             // 3. 執行操作
);
```

### Role驗證
```javascript
export const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    const staff = await db("staffs").where({ id: req.user.id }).first();
    
    if (!staff || staff.role !== requiredRole) {
      return res.status(403).json({ 
        message: `淨係${requiredRole}先可以做呢個操作` 
      });
    }
    next();
  };
};
```

---

## 🔴 仍需改善嘅地方

### 1. 密碼儲存
**現狀：** 明文儲存 ❌
```javascript
if (staff.password !== password) { ... }
```

**建議：** 用bcrypt hash
```javascript
const bcrypt = require('bcrypt');

// 註冊時
const hashedPassword = await bcrypt.hash(password, 10);

// 登入時
const isMatch = await bcrypt.compare(password, staff.password);
```

---

### 2. Rate Limiting（速率限制）
**現狀：** 冇限制 ❌

**建議：** 加速率限制防暴力破解
```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 5, // 最多5次嘗試
  message: '嘗試次數太多，請15分鐘後再試'
});

router.post("/staff/login", loginLimiter, staffLogin);
```

---

### 3. JWT Token（可選）
**現狀：** 用Cookie ✅（已經好安全）

**如果要做API分離：** 可以用JWT
```javascript
const jwt = require('jsonwebtoken');

// 生成token
const token = jwt.sign(
  { id: staff.id, type: 'staff', role: staff.role },
  config.JWT_SECRET,
  { expiresIn: '24h' }
);

// 驗證token
const decoded = jwt.verify(token, config.JWT_SECRET);
```

---

## 配置要求

### config.js必須設置
```javascript
export default {
  AES_KEY: "至少32字符嘅強密碼",
  COOKIE_SECRET: "至少32字符嘅強密碼",
  // ... 其他配置
};
```

⚠️ **重要：**
- `AES_KEY`同`COOKIE_SECRET`**必須唔同**
- 用強隨機密碼，唔好用簡單嘅字串
- 放喺`.gitignore`入面，**唔好commit到git**

### 生成強密碼
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或者用online工具
https://www.grc.com/passwords.htm
```

---

## 安全檢查清單

### 已實現 ✅
- [x] Cookie簽名驗證
- [x] httpOnly防XSS
- [x] sameSite防CSRF
- [x] secure flag（生產環境HTTPS）
- [x] 敏感數據AES加密
- [x] Role權限控制
- [x] Email登入驗證

### 建議改善 🔧
- [ ] 密碼bcrypt hash
- [ ] Rate limiting防暴力破解
- [ ] 登入日誌記錄
- [ ] 雙因素驗證（2FA）
- [ ] 密碼強度檢查
- [ ] 密碼過期機制
- [ ] Session timeout

---

## 攻擊場景測試

### ❌ 場景1：篡改Cookie
```javascript
// 黑客嘗試改cookie
document.cookie = "userId=999";
```
**結果：** 簽名唔match，被拒絕 ✅

### ❌ 場景2：XSS偷Cookie
```javascript
// XSS攻擊
<script>alert(document.cookie)</script>
```
**結果：** httpOnly保護，讀唔到 ✅

### ❌ 場景3：CSRF攻擊
```html
<!-- 其他網站發惡意請求 -->
<img src="http://yoursite.com/api/students/1" />
```
**結果：** sameSite='strict'，cookie唔會帶上 ✅

### ❌ 場景4：SQL注入
```javascript
// 用raw query
db.raw("SELECT * FROM students WHERE email = ?", [email])
```
**結果：** 用parameterized query，防SQL注入 ✅

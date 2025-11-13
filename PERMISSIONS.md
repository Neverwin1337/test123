# 權限控制系統

## 用戶類型

### 1. 員工 (Staff)
- 登入方式：Email + 密碼
- 根據role有唔同權限

### 2. 學生 (Student)
- 登入方式：Email + 密碼
- 淨係可以睇同改自己嘅資料

---

## Role權限

### ARO (Academic Records Officer) - 成績管理員
**可以管理嘅嘢：**
- ✅ 攞晒所有成績
- ✅ 攞單個成績
- ✅ 加成績
- ✅ 改成績
- ✅ 刪成績

**API路徑：** `/api/grades`

---

### DRO (Disciplinary Records Officer) - 紀律記錄管理員
**可以管理嘅嘢：**
- ✅ 攞晒所有紀律記錄
- ✅ 攞單個紀律記錄
- ✅ 加紀律記錄
- ✅ 改紀律記錄
- ✅ 刪紀律記錄

**API路徑：** `/api/disciplinary`

---

## 學生權限

學生登入之後可以：
- ✅ 睇自己嘅資料 `GET /api/students/:id`
- ✅ 改自己嘅資料 `POST /api/students/edit/:id`
- ✅ 睇自己嘅成績 `GET /api/students/grade/:id`
- ✅ 睇自己嘅紀律記錄 `GET /api/students/disciplinary/:id`

學生**唔可以**：
- ❌ 睇其他學生嘅資料
- ❌ 攞晒所有學生
- ❌ 加學生
- ❌ 管理成績
- ❌ 管理紀律記錄

---

## 錯誤信息

### 未登入
```json
{
  "success": false,
  "message": "未登入"
}
```

### 權限唔夠
```json
{
  "success": false,
  "message": "權限唔夠"
}
```

### Role唔啱
```json
{
  "success": false,
  "message": "淨係ARO先可以做呢個操作"
}
```

或

```json
{
  "success": false,
  "message": "淨係DRO先可以做呢個操作"
}
```

### 學生想睇人哋嘅嘢
```json
{
  "success": false,
  "message": "淨係可以睇自己嘅資料"
}
```

---

## 測試例子

### 1. ARO登入同管理成績
```bash
# 登入
curl -X POST http://localhost:3000/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email": "aro@staff.com", "password": "aro123"}' \
  -c cookies.txt

# 加成績（淨係ARO role先得）
curl -X POST http://localhost:3000/api/grades/AddGrading \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "student_id": 1,
    "course_id": 1,
    "term": "2024春季",
    "grade": "A",
    "comments": "好叻"
  }'
```

### 2. DRO登入同管理紀律記錄
```bash
# 登入
curl -X POST http://localhost:3000/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dro@staff.com", "password": "dro123"}' \
  -c cookies.txt

# 加紀律記錄（淨係DRO role先得）
curl -X POST http://localhost:3000/api/disciplinary/AddDisciplinary \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "student_id": 1,
    "date": "2024-01-01",
    "staff_id": 2,
    "descriptions": "遲到"
  }'
```

### 3. 學生登入同睇自己嘅嘢
```bash
# 登入（用Email + 密碼）
curl -X POST http://localhost:3000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "student123"}' \
  -c cookies.txt

# 睇自己嘅資料
curl http://localhost:3000/api/students/1 \
  -b cookies.txt

# 睇自己嘅成績
curl http://localhost:3000/api/students/grade/1 \
  -b cookies.txt
```

---

## 實現細節

### Middleware層次

1. **authenticate** - 驗證用戶登咗入未
2. **requireRole(role)** - 驗證員工有冇指定嘅role
3. **requireSelfOrStaff** - 驗證係員工或者學生自己

### 例子

```javascript
// 淨係ARO先可以加成績
router.post("/AddGrading", 
  authenticate,           // 先驗證登咗入未
  requireRole("ARO"),     // 再驗證係咪ARO
  addGrade                // 最後先執行function
);

// 學生可以睇自己嘅成績，員工可以睇所有學生嘅成績
router.get("/grade/:id",
  authenticate,           // 先驗證登咗入未
  requireSelfOrStaff,     // 驗證係員工或者學生自己
  getStudentGrades        // 執行function
);
```

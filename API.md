# API 文档

## 启动服务

```bash
npm start      # 正常启动
npm run dev    # 开发模式（自动重启）
```

服务运行在端口: 3000

---

## 学生管理 (Students)

**基础路径**: `/api/students`

### 获取所有学生
- **GET** `/api/students`
- 响应: `{ success: true, data: [...] }`

### 获取单个学生
- **GET** `/api/students/:id`
- 响应: `{ success: true, data: {...} }`

### 添加学生
- **POST** `/api/students`
- 请求体:
```json
{
  "last_name": "张",
  "first_name": "三",
  "gender": "男",
  "identification_number": "123456789",
  "address": "地址",
  "email": "email@example.com",
  "phone": "12345678",
  "enrollment_year": 2024,
  "guardian_id": 1,
  "guardian_relation": "父亲"
}
```

### 编辑学生
- **POST** `/api/students/edit/:id`
- 请求体: 同添加学生（字段可选）

### 获取学生成绩
- **GET** `/api/students/grade/:id`
- 响应: `{ success: true, data: [...] }`

### 获取学生纪律记录
- **GET** `/api/students/disciplinary/:id`
- 响应: `{ success: true, data: [...] }`

---

## 成绩管理 (Grades)

**基础路径**: `/api/grades`

### 获取所有成绩
- **GET** `/api/grades`

### 获取单个成绩
- **GET** `/api/grades/:id`

### 添加成绩
- **POST** `/api/grades/AddGrading`
- 请求体:
```json
{
  "student_id": 1,
  "course_id": 1,
  "term": "2024春季",
  "grade": "A",
  "comments": "表现优秀"
}
```

### 编辑成绩
- **POST** `/api/grades/EditGrading`
- 请求体:
```json
{
  "id": 1,
  "student_id": 1,
  "course_id": 1,
  "term": "2024春季",
  "grade": "A+",
  "comments": "更新的评语"
}
```

### 删除成绩
- **DELETE** `/api/grades/DeleteGrading/:id`

---

## 纪律记录 (Disciplinary Records)

**基础路径**: `/api/disciplinary`

### 获取所有纪律记录
- **GET** `/api/disciplinary`

### 获取单个纪律记录
- **GET** `/api/disciplinary/:id`

### 添加纪律记录
- **POST** `/api/disciplinary/AddDisciplinary`
- 请求体:
```json
{
  "student_id": 1,
  "date": "2024-01-01",
  "staff_id": 1,
  "descriptions": "迟到"
}
```

### 编辑纪律记录
- **POST** `/api/disciplinary/EditDisciplinary`
- 请求体:
```json
{
  "id": 1,
  "student_id": 1,
  "date": "2024-01-01",
  "staff_id": 1,
  "descriptions": "更新的描述"
}
```

### 删除纪律记录
- **DELETE** `/api/disciplinary/DeleteDisciplinary/:id`

---

## 监护人管理 (Guardians)

**基础路径**: `/api/guardians`

### 获取所有监护人
- **GET** `/api/guardians`

### 获取单个监护人
- **GET** `/api/guardians/:id`

### 添加监护人
- **POST** `/api/guardians`
- 请求体:
```json
{
  "last_name": "李",
  "first_name": "四",
  "email": "guardian@example.com",
  "phone": "87654321"
}
```

### 编辑监护人
- **PUT** `/api/guardians/:id`
- 请求体: 同添加监护人（字段可选）

### 删除监护人
- **DELETE** `/api/guardians/:id`

---

## 员工管理 (Staffs)

**基础路径**: `/api/staffs`

### 获取所有员工
- **GET** `/api/staffs`

### 获取单个员工
- **GET** `/api/staffs/:id`

### 添加员工
- **POST** `/api/staffs`
- 请求体:
```json
{
  "password": "password123",
  "last_name": "王",
  "first_name": "五",
  "gender": "女",
  "identification_number": "987654321",
  "address": "员工地址",
  "email": "staff@example.com",
  "phone": "11112222",
  "department": "教务处",
  "role": "教师"
}
```

### 编辑员工
- **PUT** `/api/staffs/:id`
- 请求体: 同添加员工（字段可选）

### 删除员工
- **DELETE** `/api/staffs/:id`

---

## 课程管理 (Courses)

**基础路径**: `/api/courses`

### 获取所有课程
- **GET** `/api/courses`

### 获取单个课程
- **GET** `/api/courses/:id`

### 添加课程
- **POST** `/api/courses`
- 请求体:
```json
{
  "course_name": "数学"
}
```

### 编辑课程
- **PUT** `/api/courses/:id`
- 请求体:
```json
{
  "course_name": "高等数学"
}
```

### 删除课程
- **DELETE** `/api/courses/:id`

---

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {...} 或 [...]
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 状态码
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器错误

## 数据加密
敏感字段（身份证号、地址、邮箱、电话、成绩、评语等）在数据库中使用AES-256-CBC加密存储。

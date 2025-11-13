# 项目结构说明

## 目录结构

```
src/
├── controllers/                 # 业务逻辑层
│   ├── studentController.js     # 学生管理控制器
│   ├── gradeController.js       # 成绩管理控制器
│   ├── disciplinaryController.js # 纪律管理控制器
│   ├── guardianController.js    # 监护人管理控制器
│   ├── staffController.js       # 员工管理控制器
│   └── courseController.js      # 课程管理控制器
│
├── routes/                      # 路由层
│   ├── student.js               # 学生路由
│   ├── aro.js                   # 成绩路由 (Academic Records)
│   ├── dro.js                   # 纪律路由 (Disciplinary Records)
│   ├── guardian.js              # 监护人路由
│   ├── staff.js                 # 员工路由
│   └── course.js                # 课程路由
│
├── utils/                       # 工具函数
│   └── crypto.js                # 加密/解密工具
│
├── config.js                    # 配置文件（敏感信息）
├── config.example.js            # 配置示例
├── db.js                        # 数据库连接配置
└── index.js                     # 应用入口
```

## Controller 层职责

每个Controller负责：
- 接收请求参数
- 数据验证
- 数据库操作（通过Knex）
- 加密/解密敏感数据
- 返回统一格式响应

### Controller 标准函数

#### studentController.js
- `getAllStudents()` - 获取所有学生
- `getStudentById()` - 获取单个学生
- `addStudent()` - 添加学生
- `editStudent()` - 编辑学生
- `getStudentGrades()` - 获取学生成绩
- `getStudentDisciplinaryRecords()` - 获取学生纪律记录

#### gradeController.js
- `getAllGrades()` - 获取所有成绩
- `getGradeById()` - 获取单个成绩
- `addGrade()` - 添加成绩
- `editGrade()` - 编辑成绩
- `deleteGrade()` - 删除成绩

#### disciplinaryController.js
- `getAllDisciplinaryRecords()` - 获取所有纪律记录
- `getDisciplinaryRecordById()` - 获取单个纪律记录
- `addDisciplinaryRecord()` - 添加纪律记录
- `editDisciplinaryRecord()` - 编辑纪律记录
- `deleteDisciplinaryRecord()` - 删除纪律记录

#### guardianController.js
- `getAllGuardians()` - 获取所有监护人
- `getGuardianById()` - 获取单个监护人
- `addGuardian()` - 添加监护人
- `editGuardian()` - 编辑监护人
- `deleteGuardian()` - 删除监护人

#### staffController.js
- `getAllStaffs()` - 获取所有员工
- `getStaffById()` - 获取单个员工
- `addStaff()` - 添加员工
- `editStaff()` - 编辑员工
- `deleteStaff()` - 删除员工

#### courseController.js
- `getAllCourses()` - 获取所有课程
- `getCourseById()` - 获取单个课程
- `addCourse()` - 添加课程
- `editCourse()` - 编辑课程
- `deleteCourse()` - 删除课程

## Routes 层职责

每个Route文件负责：
- 定义HTTP方法和路径
- 导入对应Controller函数
- 将请求映射到Controller

### 路由规范

```javascript
// 标准CRUD路由
router.get("/", getAll);           // 获取所有资源
router.get("/:id", getById);       // 获取单个资源
router.post("/", add);             // 创建资源
router.put("/:id", edit);          // 更新资源
router.delete("/:id", del);        // 删除资源
```

## 工具函数

### crypto.js
- `encrypt(text)` - AES-256-CBC 加密
- `decrypt(text)` - AES-256-CBC 解密

用于保护敏感信息：
- 身份证号 (identification_number)
- 地址 (address)
- 邮箱 (email)
- 电话 (phone)
- 成绩 (grade)
- 评语 (comments)
- 纪律描述 (descriptions)

## 数据流

```
HTTP请求
   ↓
index.js (路由挂载)
   ↓
routes/*.js (路由分发)
   ↓
controllers/*.js (业务逻辑)
   ↓
db.js (Knex查询)
   ↓
MySQL数据库
   ↓
响应返回
```

## 响应格式统一

### 成功响应
```javascript
{
  success: true,
  data: {...} 或 [...]
}
```

### 失败响应
```javascript
{
  success: false,
  message: "错误描述"
}
```

## HTTP状态码

- `200` OK - GET/PUT/DELETE成功
- `201` Created - POST创建成功
- `400` Bad Request - 请求参数错误
- `404` Not Found - 资源不存在
- `500` Internal Server Error - 服务器错误

## 数据库表关系

```
students (学生)
  ├─ has many grades (成绩)
  ├─ has many disciplinary_records (纪律记录)
  └─ belongs to guardian (监护人)

guardians (监护人)
  └─ has many students (学生)

staffs (员工)
  └─ has many disciplinary_records (纪律记录)

courses (课程)
  └─ has many grades (成绩)

grades (成绩)
  ├─ belongs to student (学生)
  └─ belongs to course (课程)

disciplinary_records (纪律记录)
  ├─ belongs to student (学生)
  └─ belongs to staff (员工)
```

# 数据库管理系统

基于 Express + Knex + MySQL 的学生信息管理系统

## 项目结构

```
database/
├── src/
│   ├── controllers/        # 控制器层（业务逻辑）
│   │   ├── studentController.js
│   │   ├── gradeController.js
│   │   ├── disciplinaryController.js
│   │   ├── guardianController.js
│   │   ├── staffController.js
│   │   └── courseController.js
│   ├── routes/            # 路由层
│   │   ├── student.js
│   │   ├── aro.js         # 成绩路由
│   │   ├── dro.js         # 纪律路由
│   │   ├── guardian.js
│   │   ├── staff.js
│   │   └── course.js
│   ├── utils/             # 工具函数
│   │   └── crypto.js      # 加密解密工具
│   ├── config.js          # 配置文件
│   ├── db.js              # 数据库连接
│   └── index.js           # 入口文件
├── comp3335.sql           # 数据库结构
├── package.json
├── API.md                 # API文档
└── README.md
```

## 技术栈

- **后端框架**: Express 5.x
- **数据库**: MySQL
- **查询构建器**: Knex.js
- **加密**: Node.js crypto (AES-256-CBC)

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库
编辑 `src/config.js`:
```javascript
export default {
    AES_KEY: "your-secret-key",
    PORT: 3000,
    DB_HOST: "localhost",
    DB_USER: "root",
    DB_PASSWORD: "password",
    DB_DATABASE: "database_name",
}
```

### 3. 导入数据库结构
```bash
mysql -u root -p < comp3335.sql
```

### 4. 启动服务
```bash
npm start       # 生产模式
npm run dev     # 开发模式（自动重启）
```

## 架构设计

### 三层架构
1. **Routes 路由层**: 定义API端点，调用Controller
2. **Controllers 控制器层**: 处理业务逻辑，数据验证
3. **Database 数据层**: Knex查询构建器访问MySQL

### 数据加密
敏感信息使用AES-256-CBC加密:
- 学生: identification_number, address, email, phone
- 监护人: email, phone
- 员工: identification_number, address, email, phone
- 成绩: grade, comments
- 纪律: descriptions

## API端点

详见 [API.md](./API.md)

### 核心模块
- `/api/students` - 学生管理
- `/api/grades` - 成绩管理
- `/api/disciplinary` - 纪律记录
- `/api/guardians` - 监护人管理
- `/api/staffs` - 员工管理
- `/api/courses` - 课程管理

## 代码规范

### Controller规范
- 所有异步函数使用 async/await
- 统一错误处理 try-catch
- 统一响应格式 `{ success, data/message }`
- 参数验证在Controller层完成

### Routes规范
- 仅负责路由定义
- 直接调用Controller函数
- 使用RESTful风格（GET/POST/PUT/DELETE）

### 命名规范
- 文件名: camelCase (studentController.js)
- 函数名: camelCase (getAllStudents)
- 常量: UPPER_SNAKE_CASE (AES_KEY)

## 数据库表结构

- **students** - 学生信息
- **guardians** - 监护人信息
- **staffs** - 员工信息
- **courses** - 课程信息
- **grades** - 成绩记录
- **disciplinary_records** - 纪律记录

## 开发指南

### 添加新功能
1. 在 `controllers/` 创建controller文件
2. 在 `routes/` 创建对应路由文件
3. 在 `index.js` 中挂载路由
4. 更新 `API.md` 文档

### 测试API
使用Postman或curl测试:
```bash
# 获取所有学生
curl http://localhost:3000/api/students

# 添加学生
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"last_name":"张","first_name":"三"}'
```

// 引入必要的模块
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors'); // 引入 CORS 模块
const saltRounds = 10;

// 设置数据库连接配置
const dbConfig = {
    host: 'localhost',
    user: 'root', // 替换数据库用户名
    password: '123456', 
    database: 'user_register_information_schema' 
};

// 创建数据库连接
const db = mysql.createConnection(dbConfig);

// 连接数据库
db.connect(err => {
    if (err) {
        console.error('数据库连接失败: ', err);
        return;
    }
    console.log('成功连接到数据库');
});

// 初始化 Express 应用
const app = express();

// 使用 bodyParser 中间件解析请求体
app.use(bodyParser.json());
app.use(cors());

// 设置路由处理用户注册
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // 这里应该有密码哈希处理的逻辑
    if (!(username && password)) {
        return res.status(400).send("Username and password are required");
    }
    
    // 检查用户名是否已存在
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).send('数据库查询错误');
        }   
        if (result.length > 0) {
            return res.status(409).send('用户名已存在');
        }
    
        // 密码加密
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                console.error('哈希处理失败: ', err);
                res.status(500).send('注册过程中出现错误');
                return;
            }

            // 准备 SQL 语句
            const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

            // 执行 SQL 语句
            db.query(sql, [username, hash], (err, result) => {
                if (err) {
                    console.error('插入数据失败: ', err);
                    res.status(500).send('注册失败');
                    return;
                }
                return res.status(201).json('注册成功');
            });
        });
    });    
});

// 后端登录路由
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 查询数据库以验证用户名
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
        if (err) {
            res.status(500).send('数据库查询错误');
            return;
        }

        if (users.length === 0) {
            res.status(401).send('用户名不存在');
            return;
        }

        const user = users[0];

        // 使用 bcrypt 比对密码
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                res.status(500).send('密码验证错误');
                return;
            }

            if (result) {
                res.json({ success: true }); // 密码匹配，登录成功
            } else {
                res.status(401).send('密码错误'); // 密码不匹配，登录失败
            }
        });
    });
});

// 指定端口并启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});


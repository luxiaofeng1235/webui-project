// server.js - 在线记账系统后端服务

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 内存存储（生产环境应使用数据库）
// 注意：这是演示用的内存存储，服务重启后数据会丢失
// 实际应用中应该使用 MongoDB、MySQL、PostgreSQL 等数据库
let transactions = [];
let budget = {
    amount: 0,
    threshold: 80
};

// 数据库集成示例（使用MongoDB）
/*
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/accounting', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 交易模型
const Transaction = mongoose.model('Transaction', {
    id: String,
    type: String,
    category: String,
    amount: Number,
    description: String,
    date: Date
});

// 预算模型
const Budget = mongoose.model('Budget', {
    amount: Number,
    threshold: Number,
    userId: String
});
*/

// API路由

// 获取所有交易记录
app.get('/api/transactions', (req, res) => {
    try {
        // 按日期倒序排列
        const sortedTransactions = transactions.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        res.json(sortedTransactions);
    } catch (error) {
        res.status(500).json({ error: '获取交易记录失败' });
    }
});

// 添加交易记录
app.post('/api/transactions', (req, res) => {
    try {
        const { type, category, amount, description, date } = req.body;
        
        // 验证必填字段
        if (!type || !category || !amount) {
            return res.status(400).json({ error: '缺少必填字段' });
        }
        
        // 验证金额
        if (amount <= 0) {
            return res.status(400).json({ error: '金额必须大于0' });
        }
        
        const transaction = {
            id: uuidv4(),
            type,
            category,
            amount: parseFloat(amount),
            description: description || '',
            date: date || new Date().toISOString()
        };
        
        transactions.push(transaction);
        
        // 如果使用数据库
        // const newTransaction = new Transaction(transaction);
        // await newTransaction.save();
        
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: '添加交易记录失败' });
    }
});

// 删除交易记录
app.delete('/api/transactions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = transactions.findIndex(t => t.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: '交易记录不存在' });
        }
        
        transactions.splice(index, 1);
        
        // 如果使用数据库
        // await Transaction.deleteOne({ id });
        
        res.status(200).json({ message: '删除成功' });
    } catch (error) {
        res.status(500).json({ error: '删除交易记录失败' });
    }
});

// 获取月度统计
app.get('/api/summary', (req, res) => {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // 筛选当月交易
        const monthlyTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;
        });
        
        // 计算收支
        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const balance = income - expense;
        
        res.json({
            income,
            expense,
            balance,
            transactionCount: monthlyTransactions.length
        });
    } catch (error) {
        res.status(500).json({ error: '获取统计数据失败' });
    }
});

// 获取预算设置
app.get('/api/budget', (req, res) => {
    res.json(budget);
});

// 设置预算
app.post('/api/budget', (req, res) => {
    try {
        const { amount, threshold } = req.body;
        
        if (amount < 0) {
            return res.status(400).json({ error: '预算金额不能为负数' });
        }
        
        if (threshold < 0 || threshold > 100) {
            return res.status(400).json({ error: '提醒阈值必须在0-100之间' });
        }
        
        budget = {
            amount: parseFloat(amount),
            threshold: parseInt(threshold)
        };
        
        // 如果使用数据库
        // await Budget.findOneAndUpdate(
        //     { userId: req.userId },
        //     budget,
        //     { upsert: true }
        // );
        
        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: '设置预算失败' });
    }
});

// 高级功能：按分类统计
app.get('/api/statistics/category', (req, res) => {
    try {
        const { year, month } = req.query;
        let filteredTransactions = transactions;
        
        // 如果指定了年月，则筛选
        if (year && month) {
            filteredTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getFullYear() === parseInt(year) && 
                       date.getMonth() === parseInt(month) - 1;
            });
        }
        
        // 按类别统计
        const categoryStats = {};
        filteredTransactions.forEach(t => {
            if (!categoryStats[t.category]) {
                categoryStats[t.category] = {
                    income: 0,
                    expense: 0,
                    count: 0
                };
            }
            
            if (t.type === 'income') {
                categoryStats[t.category].income += t.amount;
            } else {
                categoryStats[t.category].expense += t.amount;
            }
            categoryStats[t.category].count++;
        });
        
        res.json(categoryStats);
    } catch (error) {
        res.status(500).json({ error: '获取分类统计失败' });
    }
});

// 导出数据（CSV格式）
app.get('/api/export/csv', (req, res) => {
    try {
        let csv = 'ID,类型,分类,金额,备注,日期\n';
        
        transactions.forEach(t => {
            csv += `${t.id},${t.type},${t.category},${t.amount},${t.description || ''},${t.date}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.send('\ufeff' + csv); // 添加BOM以支持中文
    } catch (error) {
        res.status(500).json({ error: '导出数据失败' });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        transactionCount: transactions.length
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`记账系统后端服务运行在 http://localhost:${PORT}`);
    console.log('API端点：');
    console.log('- GET    /api/transactions     获取所有交易');
    console.log('- POST   /api/transactions     添加交易');
    console.log('- DELETE /api/transactions/:id 删除交易');
    console.log('- GET    /api/summary          获取月度统计');
    console.log('- GET    /api/budget           获取预算设置');
    console.log('- POST   /api/budget           设置预算');
    console.log('- GET    /api/statistics/category 分类统计');
    console.log('- GET    /api/export/csv       导出CSV');
});

// package.json 配置示例
const packageJson = {
    "name": "accounting-system-backend",
    "version": "1.0.0",
    "description": "在线记账系统后端服务",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "body-parser": "^1.20.2",
        "uuid": "^9.0.0",
        "mongoose": "^7.0.0",  // 如果使用MongoDB
        "mysql2": "^3.0.0",    // 如果使用MySQL
        "pg": "^8.0.0"         // 如果使用PostgreSQL
    },
    "devDependencies": {
        "nodemon": "^2.0.22"
    }
};

// 安装依赖命令：
// npm install express cors body-parser uuid
// npm install -D nodemon

// 启动服务：
// npm start 或 npm run dev（开发模式）
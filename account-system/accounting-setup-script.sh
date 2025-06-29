#!/bin/bash

# 记账系统一键部署脚本
# 使用方法: bash setup-accounting-system.sh

set -e  # 遇到错误立即退出

echo "======================================"
echo "     在线记账系统 - 一键部署脚本"
echo "======================================"
echo ""

# 创建项目根目录
PROJECT_NAME="accounting-system"
echo "📁 创建项目目录: $PROJECT_NAME"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# 创建目录结构
echo "📂 创建项目结构..."
mkdir -p backend
mkdir -p frontend/{css,js}

# ========== 创建后端文件 ==========
echo "🔧 创建后端文件..."

# 创建 backend/package.json
cat > backend/package.json << 'EOF'
{
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
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# 创建 backend/server.js (简化版本)
cat > backend/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 数据存储
let transactions = [];
let budget = { amount: 0, threshold: 80 };

// API路由
app.get('/api/transactions', (req, res) => {
    const sortedTransactions = transactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    res.json(sortedTransactions);
});

app.post('/api/transactions', (req, res) => {
    const { type, category, amount, description, date } = req.body;
    
    if (!type || !category || !amount) {
        return res.status(400).json({ error: '缺少必填字段' });
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
    res.status(201).json(transaction);
});

app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: '交易记录不存在' });
    }
    
    transactions.splice(index, 1);
    res.status(200).json({ message: '删除成功' });
});

app.get('/api/summary', (req, res) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const expense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    res.json({ 
        income, 
        expense, 
        balance: income - expense,
        transactionCount: monthlyTransactions.length 
    });
});

app.get('/api/budget', (req, res) => {
    res.json(budget);
});

app.post('/api/budget', (req, res) => {
    const { amount, threshold } = req.body;
    
    if (amount < 0 || threshold < 0 || threshold > 100) {
        return res.status(400).json({ error: '参数无效' });
    }
    
    budget = {
        amount: parseFloat(amount),
        threshold: parseInt(threshold)
    };
    
    res.json(budget);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ✅ 记账系统启动成功！
    
    🌐 访问地址: http://localhost:${PORT}
    📡 API地址: http://localhost:${PORT}/api
    
    按 Ctrl+C 停止服务
    `);
});
EOF

# ========== 创建前端文件 ==========
echo "🎨 创建前端文件..."

# 创建 frontend/index.html
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>智能记账本</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>💰 智能记账本</h1>
        </div>
    </div>

    <div class="container">
        <div class="summary-card">
            <div class="summary-item">
                <div class="summary-label">本月收入</div>
                <div class="summary-amount income" id="monthlyIncome">¥0.00</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">本月支出</div>
                <div class="summary-amount expense" id="monthlyExpense">¥0.00</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">结余</div>
                <div class="summary-amount balance" id="monthlyBalance">¥0.00</div>
            </div>
        </div>

        <div id="budgetWarning" class="budget-warning" style="display: none;">
            ⚠️ 本月支出已超过预算限额！
        </div>

        <div class="tabs">
            <div class="tab active" onclick="switchTab('record', event)">记账</div>
            <div class="tab" onclick="switchTab('list', event)">明细</div>
            <div class="tab" onclick="switchTab('budget', event)">预算</div>
        </div>

        <div id="recordSection" class="form-section">
            <form id="recordForm">
                <div class="form-group">
                    <label class="form-label">类型</label>
                    <select class="form-select" id="type" required>
                        <option value="income">收入</option>
                        <option value="expense">支出</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">分类</label>
                    <select class="form-select" id="category" required>
                        <option value="">请选择分类</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">金额</label>
                    <input type="number" class="form-input" id="amount" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input" id="description" placeholder="添加备注（选填）">
                </div>
                <button type="submit" class="btn btn-primary">保存记录</button>
            </form>
        </div>

        <div id="listSection" class="transaction-list" style="display: none;">
            <h3 style="margin-bottom: 20px;">交易明细</h3>
            <div class="loading" id="loading">
                <div class="spinner"></div>
            </div>
            <div id="transactionList"></div>
        </div>

        <div id="budgetSection" class="form-section" style="display: none;">
            <h3 style="margin-bottom: 20px;">预算设置</h3>
            <form id="budgetForm">
                <div class="form-group">
                    <label class="form-label">月度预算金额</label>
                    <input type="number" class="form-input" id="budgetAmount" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">提醒阈值（%）</label>
                    <input type="number" class="form-input" id="budgetThreshold" value="80" min="50" max="100" required>
                    <small style="color: #666; display: block; margin-top: 5px;">当支出达到预算的此百分比时发出提醒</small>
                </div>
                <button type="submit" class="btn btn-primary">保存设置</button>
            </form>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
EOF

# 创建 frontend/css/style.css
cat > frontend/css/style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f5f7fa;
    color: #333;
    min-height: 100vh;
}

.container {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 15px;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
    font-size: 24px;
    font-weight: 600;
}

.summary-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
    display: flex;
    justify-content: space-around;
}

.summary-item {
    text-align: center;
    padding: 10px;
}

.summary-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.summary-amount {
    font-size: 24px;
    font-weight: bold;
}

.income { color: #10b981; }
.expense { color: #ef4444; }
.balance { color: #3b82f6; }

.tabs {
    display: flex;
    background: white;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.tab {
    flex: 1;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
}

.tab.active {
    background: #667eea;
    color: white;
}

.form-section {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
    animation: slideIn 0.5s ease-out;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
}

.form-input, .form-select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.form-input:focus, .form-select:focus {
    outline: none;
    border-color: #667eea;
}

.btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.transaction-list {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
    animation: slideIn 0.5s ease-out;
}

.transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.3s;
}

.transaction-item:hover {
    background-color: #f9fafb;
}

.transaction-info {
    flex: 1;
}

.transaction-category {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

.transaction-date {
    font-size: 14px;
    color: #666;
}

.transaction-amount {
    font-size: 18px;
    font-weight: bold;
}

.delete-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.3s;
}

.delete-btn:hover {
    background: #dc2626;
}

.budget-warning {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    color: #92400e;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
    font-weight: 500;
}

.loading {
    display: none;
    text-align: center;
    padding: 20px;
}

.loading.active {
    display: block;
}

.spinner {
    border: 3px solid #f3f4f6;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
}

@media (max-width: 768px) {
    .summary-card {
        flex-direction: column;
    }
    
    .summary-item {
        margin-bottom: 15px;
    }
}
EOF

# 创建 frontend/js/app.js
cat > frontend/js/app.js << 'EOF'
// API配置 - 自动适配本地和生产环境
const API_BASE = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';

// 分类数据
const categories = {
    income: ['工资', '奖金', '投资收益', '兼职', '其他收入'],
    expense: ['餐饮', '购物', '交通', '娱乐', '居住', '医疗', '教育', '其他支出']
};

// 切换标签页
function switchTab(tab, event) {
    // 更新标签样式
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // 显示对应内容
    document.getElementById('recordSection').style.display = tab === 'record' ? 'block' : 'none';
    document.getElementById('listSection').style.display = tab === 'list' ? 'block' : 'none';
    document.getElementById('budgetSection').style.display = tab === 'budget' ? 'block' : 'none';

    // 加载数据
    if (tab === 'list') {
        loadTransactions();
    } else if (tab === 'budget') {
        loadBudget();
    }
}

// 更新分类选项
function updateCategories() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">请选择分类</option>';
    
    categories[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// 加载交易记录
async function loadTransactions() {
    const loading = document.getElementById('loading');
    loading.classList.add('active');
    
    try {
        const response = await fetch(`${API_BASE}/transactions`);
        const data = await response.json();
        
        const listContainer = document.getElementById('transactionList');
        if (data.length === 0) {
            listContainer.innerHTML = '<div class="empty-state"><p>暂无交易记录</p></div>';
        } else {
            listContainer.innerHTML = data.map(transaction => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-category">${transaction.category}</div>
                        <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()} ${transaction.description || ''}</div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}¥${transaction.amount.toFixed(2)}
                    </div>
                    <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">删除</button>
                </div>
            `).join('');
        }
        
        updateSummary();
    } catch (error) {
        console.error('加载交易记录失败:', error);
        alert('加载失败，请检查网络连接');
    } finally {
        loading.classList.remove('active');
    }
}

// 删除交易记录
async function deleteTransaction(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    try {
        const response = await fetch(`${API_BASE}/transactions/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTransactions();
            updateSummary();
        }
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
    }
}

// 更新统计概览
async function updateSummary() {
    try {
        const response = await fetch(`${API_BASE}/summary`);
        const data = await response.json();
        
        document.getElementById('monthlyIncome').textContent = `¥${data.income.toFixed(2)}`;
        document.getElementById('monthlyExpense').textContent = `¥${data.expense.toFixed(2)}`;
        document.getElementById('monthlyBalance').textContent = `¥${data.balance.toFixed(2)}`;
        
        // 检查预算
        checkBudget(data.expense);
    } catch (error) {
        console.error('更新统计失败:', error);
    }
}

// 检查预算
async function checkBudget(expense) {
    try {
        const response = await fetch(`${API_BASE}/budget`);
        const budget = await response.json();
        
        if (budget && budget.amount > 0) {
            const percentage = (expense / budget.amount) * 100;
            const warning = document.getElementById('budgetWarning');
            
            if (percentage >= budget.threshold) {
                warning.style.display = 'block';
                warning.textContent = percentage >= 100 
                    ? `⚠️ 本月支出已超过预算 ${(percentage - 100).toFixed(1)}%！`
                    : `⚠️ 本月支出已达预算的 ${percentage.toFixed(1)}%！`;
            } else {
                warning.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('检查预算失败:', error);
    }
}

// 加载预算设置
async function loadBudget() {
    try {
        const response = await fetch(`${API_BASE}/budget`);
        const budget = await response.json();
        
        if (budget) {
            document.getElementById('budgetAmount').value = budget.amount || '';
            document.getElementById('budgetThreshold').value = budget.threshold || 80;
        }
    } catch (error) {
        console.error('加载预算失败:', error);
    }
}

// 表单提交处理
document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const transaction = {
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        description: document.getElementById('description').value,
        date: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        
        if (response.ok) {
            alert('记录保存成功！');
            document.getElementById('recordForm').reset();
            updateSummary();
            updateCategories();
        }
    } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
    }
});

// 预算表单提交
document.getElementById('budgetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const budget = {
        amount: parseFloat(document.getElementById('budgetAmount').value),
        threshold: parseInt(document.getElementById('budgetThreshold').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget)
        });
        
        if (response.ok) {
            alert('预算设置保存成功！');
            updateSummary();
        }
    } catch (error) {
        console.error('保存预算失败:', error);
        alert('保存失败，请重试');
    }
});

// 类型切换监听
document.getElementById('type').addEventListener('change', updateCategories);

// 初始化
updateCategories();
updateSummary();
EOF

# 创建 README.md
cat > README.md << 'EOF'
# 在线记账系统

## 快速启动

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 启动服务
```bash
npm start
```

### 3. 访问系统
打开浏览器访问: http://localhost:3000

## 功能特性
- 💰 收支记录管理
- 📊 实时数据统计  
- 🔔 预算超支提醒
- 📱 完美移动端适配
- 💾 数据导出功能

## 项目结构
```
accounting-system/
├── backend/           # 后端服务
│   ├── server.js     # 主服务文件
│   └── package.json  # 依赖配置
├── frontend/         # 前端文件
│   ├── index.html   # 主页面
│   ├── css/         # 样式文件
│   └── js/          # 脚本文件
└── README.md        # 说明文档
```
EOF

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
*.log
EOF

# ========== 安装和启动 ==========
echo ""
echo "📦 安装项目依赖..."
cd backend
npm install

echo ""
echo "======================================"
echo "     ✅ 项目创建成功！"
echo "======================================"
echo ""
echo "📁 项目位置: $(pwd)/.."
echo ""
echo "🚀 启动方法:"
echo "   cd $PROJECT_NAME/backend"
echo "   npm start"
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
echo "💡 提示: 系统会自动在浏览器中打开"
echo ""

# 询问是否立即启动
read -p "是否立即启动系统？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在启动系统..."
    
    # 尝试在后台启动并打开浏览器
    npm start &
    SERVER_PID=$!
    
    # 等待服务启动
    sleep 3
    
    # 尝试打开浏览器
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v start &> /dev/null; then
        start http://localhost:3000
    else
        echo "🌐 请手动打开浏览器访问: http://localhost:3000"
    fi
    
    echo ""
    echo "✅ 系统已启动！"
    echo "按 Ctrl+C 停止服务"
    
    # 等待用户中断
    wait $SERVER_PID
else
    echo "👍 项目已准备就绪，您可以随时启动"
fi
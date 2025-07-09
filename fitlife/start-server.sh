#!/bin/bash

echo "🏋️ FitLife 健身中心网站启动脚本"
echo "=================================="

# 强制刷新输出
echo "🔍 正在检查端口8005状态..."

# 检查端口8005是否被占用 - 使用多种方法确保检测准确
PORT_CHECK=$(lsof -Pi :8005 -sTCP:LISTEN -t 2>/dev/null)
NETSTAT_CHECK=$(netstat -tlnp 2>/dev/null | grep ":8005 ")

if [ ! -z "$PORT_CHECK" ] || [ ! -z "$NETSTAT_CHECK" ]; then
    echo ""
    echo "⚠️  端口 8005 已被占用！"
    echo "🔍 当前占用端口的进程:"
    if command -v lsof >/dev/null 2>&1; then
        lsof -Pi :8005 -sTCP:LISTEN 2>/dev/null || echo "   lsof无法获取详细进程信息"
    fi
    if command -v netstat >/dev/null 2>&1; then
        netstat -tlnp 2>/dev/null | grep ":8005" || echo "   netstat无法获取详细进程信息"
    fi
    echo ""
    echo "💡 解决方案:"
    echo "   1. 手动停止占用端口的服务: pkill -f 'python.*8005'"
    echo "   2. 或者使用其他端口启动服务"
    echo "   3. 或者检查进程: ps aux | grep 8005"
    echo ""
    echo "🛑 脚本退出"
    exit 1
fi

echo "✅ 端口8005可用，继续启动服务器..."

# 获取外网IP地址
echo "🌍 正在获取外网IP地址..."
#EXTERNAL_IP=$(curl -s --connect-timeout 3 ifconfig.me 2>/dev/null || curl -s --connect-timeout 3 ipinfo.io/ip 2>/dev/null || echo "无法获取外网IP")
EXTERNAL_IP=$(curl -s ifconfig.me 2>/dev/null) || EXTERNAL_IP="获取失败"

# 检查是否安装了Python
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python3 启动本地服务器..."
    echo "🌐 网站地址: http://localhost:8005"
    echo "📱 移动端测试: http://$EXTERNAL_IP:8005"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server --bind 0.0.0.0  8005 
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 启动本地服务器..."
    echo "🌐 网站地址: http://localhost:8005"
    echo "📱 移动端测试: http://$EXTERNAL_IP:8005"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m http.server  --bind 0.0.0.0 8005
elif command -v php &> /dev/null; then
    echo "✅ 使用 PHP 启动本地服务器..."
    echo "🌐 网站地址: http://localhost:8005"
    echo "📱 移动端测试: http://$EXTERNAL_IP:8005"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    php -S localhost:8005
else
    echo "❌ 未找到 Python 或 PHP"
    echo "请安装 Python 或 PHP，或者直接双击 index.html 文件打开网站"
    echo ""
    echo "或者使用以下命令安装 Node.js 服务器:"
    echo "npm install -g serve"
    echo "serve ."
fi

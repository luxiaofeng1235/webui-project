#!/bin/bash

# 图片替换脚本测试工具

echo "🧪 图片替换脚本测试工具"
echo "================================"

# 检查脚本是否存在
if [ ! -f "replace-all-homepage-images.sh" ]; then
    echo "❌ 找不到 replace-all-homepage-images.sh 脚本"
    exit 1
fi

# 检查脚本权限
if [ ! -x "replace-all-homepage-images.sh" ]; then
    echo "🔧 修复脚本执行权限..."
    chmod +x replace-all-homepage-images.sh
    echo "✅ 权限修复完成"
fi

echo ""
echo "📋 测试项目："
echo "1. 网络连接测试"
echo "2. 目录权限测试"
echo "3. 磁盘空间测试"
echo "4. 现有图片检查"
echo "5. 脚本语法检查"
echo ""

# 1. 网络连接测试
echo "1️⃣ 测试网络连接..."
if curl -s --max-time 5 https://images.unsplash.com > /dev/null; then
    echo "✅ 网络连接正常"
else
    echo "❌ 网络连接失败"
    echo "   请检查网络连接或防火墙设置"
fi

# 2. 目录权限测试
echo ""
echo "2️⃣ 测试目录权限..."
if [ -w "images/" ]; then
    echo "✅ images目录可写"
else
    echo "❌ images目录无写入权限"
    echo "   建议执行: sudo chown -R \$USER:\$USER images/"
fi

# 3. 磁盘空间测试
echo ""
echo "3️⃣ 测试磁盘空间..."
available_space=$(df . | awk 'NR==2 {print $4}')
if [ "$available_space" -gt 102400 ]; then  # 100MB
    echo "✅ 磁盘空间充足 ($(($available_space/1024))MB 可用)"
else
    echo "⚠️  磁盘空间不足 ($(($available_space/1024))MB 可用)"
    echo "   建议至少保留100MB空间"
fi

# 4. 现有图片检查
echo ""
echo "4️⃣ 检查现有图片..."
image_count=0
for img in images/*.{jpg,jpeg,png,webp}; do
    if [ -f "$img" ]; then
        image_count=$((image_count + 1))
    fi
done
echo "📊 发现 $image_count 张现有图片"

if [ "$image_count" -gt 0 ]; then
    echo "✅ 将自动备份现有图片"
else
    echo "⚠️  没有发现现有图片"
fi

# 5. 脚本语法检查
echo ""
echo "5️⃣ 检查脚本语法..."
if bash -n replace-all-homepage-images.sh; then
    echo "✅ 脚本语法正确"
else
    echo "❌ 脚本语法错误"
    exit 1
fi

echo ""
echo "📊 测试总结："
echo "================================"

# 计算就绪状态
ready_count=0
total_tests=5

# 网络检查
if curl -s --max-time 5 https://images.unsplash.com > /dev/null; then
    ready_count=$((ready_count + 1))
fi

# 权限检查
if [ -w "images/" ]; then
    ready_count=$((ready_count + 1))
fi

# 空间检查
if [ "$available_space" -gt 102400 ]; then
    ready_count=$((ready_count + 1))
fi

# 图片检查 (总是通过)
ready_count=$((ready_count + 1))

# 语法检查
if bash -n replace-all-homepage-images.sh; then
    ready_count=$((ready_count + 1))
fi

ready_percentage=$((ready_count * 100 / total_tests))

echo "就绪状态: $ready_count/$total_tests ($ready_percentage%)"

if [ "$ready_percentage" -eq 100 ]; then
    echo "🎉 所有测试通过！可以安全运行脚本"
    echo ""
    echo "🚀 运行命令:"
    echo "   ./replace-all-homepage-images.sh"
    echo ""
    echo "📋 预期效果:"
    echo "   - 备份现有图片"
    echo "   - 下载16张新图片"
    echo "   - 验证图片完整性"
    echo "   - 生成详细日志"
elif [ "$ready_percentage" -ge 80 ]; then
    echo "⚠️  大部分测试通过，可以尝试运行"
    echo "   建议先解决警告项目"
else
    echo "❌ 测试未通过，请先解决问题"
    echo ""
    echo "🔧 常见解决方案:"
    echo "   - 网络问题: 检查网络连接"
    echo "   - 权限问题: sudo chown -R \$USER:\$USER images/"
    echo "   - 空间问题: 清理磁盘空间"
fi

echo ""
echo "💡 提示:"
echo "   - 脚本会自动备份原图片"
echo "   - 支持失败时一键恢复"
echo "   - 所有操作都有详细日志"
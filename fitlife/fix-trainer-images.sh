#!/bin/bash

# 修复教练图片显示问题的脚本

echo "🖼️ 修复教练图片显示问题..."
echo ""

echo "📋 检查教练图片文件..."
echo "================================"

# 检查教练图片是否存在
check_image() {
    local image_path="$1"
    local description="$2"
    
    if [ -f "$image_path" ]; then
        local size=$(ls -lh "$image_path" | awk '{print $5}')
        echo "✅ $description: $image_path ($size)"
        return 0
    else
        echo "❌ $description: $image_path (缺失)"
        return 1
    fi
}

echo "检查教练数据中使用的图片:"
check_image "images/hero-1.jpg" "张强教练 (首席力量教练)"
check_image "images/trainer-1.jpg" "李美丽教练 (瑜伽导师)"
check_image "images/trainer-2.jpg" "王健教练 (有氧专家)"
check_image "images/trainer-1.jpg" "陈雪教练 (女性塑形)"

echo ""
echo "检查备用图片:"
check_image "images/pexels-photo-1552242.webp" "备用图片1"
check_image "images/pexels-photo-2827400.webp" "备用图片2"
check_image "images/pexels-photo-3076509.webp" "备用图片3"

echo ""
echo "🔧 修复方案:"
echo "================================"
echo "1. ✅ 已添加图片加载错误处理"
echo "2. ✅ 设置备用图片机制"
echo "3. ✅ 添加加载状态日志"
echo "4. 🔄 如需要，可以下载新的教练图片"

echo ""
echo "💡 如果图片仍然显示异常，可以："
echo "1. 检查浏览器控制台的错误信息"
echo "2. 手动下载新的教练图片"
echo "3. 更新教练数据中的图片路径"

echo ""
echo "🎯 建议的教练图片规格:"
echo "- 格式: JPG 或 PNG"
echo "- 尺寸: 400x400 像素或更大"
echo "- 文件大小: 50KB - 500KB"
echo "- 内容: 专业的教练形象照片"

echo ""
echo "📥 可以从以下网站获取专业教练图片:"
echo "- Unsplash.com (搜索 'personal trainer', 'fitness coach')"
echo "- Pexels.com (搜索 'gym trainer', 'fitness instructor')"
echo "- Pixabay.com (搜索 'coach', 'trainer')"
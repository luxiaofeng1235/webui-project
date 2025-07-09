#!/bin/bash

# 简化的图片替换脚本
# 使用有效的图片URL

echo "🎨 开始替换健身房图片..."

# 备份现有图片
echo "📁 创建备份..."
mkdir -p images/backup
cp images/strength-training.jpg images/backup/ 2>/dev/null
cp images/yoga-studio.jpg images/backup/ 2>/dev/null
cp images/lounge-area.jpg images/backup/ 2>/dev/null

# 简单的下载函数
download_and_replace() {
    local filename="$1"
    local url="$2"
    local description="$3"
    
    echo "正在下载: $description"
    
    if curl -L -o "images/$filename" "$url" --silent --show-error; then
        echo "✅ 成功替换: $filename"
        ls -lh "images/$filename" | awk '{print "   文件大小:", $5}'
    else
        echo "❌ 下载失败: $filename"
        # 恢复备份
        if [ -f "images/backup/$filename" ]; then
            cp "images/backup/$filename" "images/$filename"
            echo "🔄 已恢复原图片"
        fi
    fi
    echo ""
    sleep 1
}

echo ""
echo "🔄 开始替换关键图片..."
echo ""

# 使用一些有效的Unsplash图片URL（不同的图片ID）
# 这些是不同摄影师的作品，风格会有所不同

echo "1️⃣ 替换力量训练区（工业风格）..."
download_and_replace "strength-training.jpg" \
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
    "工业风力量训练区"

echo "2️⃣ 替换瑜伽教室（禅意风格）..."
download_and_replace "yoga-studio.jpg" \
    "https://images.unsplash.com/photo-1506629905607-ce19a96b7e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
    "禅意瑜伽教室"

echo "3️⃣ 替换休息区（现代风格）..."
download_and_replace "lounge-area.jpg" \
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
    "现代休息区"

echo "🎉 图片替换完成！"
echo ""
echo "📊 替换结果："
echo "✨ 已替换3张关键图片，增加视觉多样性"
echo "📁 原图片已备份到 images/backup/"
echo ""
echo "🔍 查看效果："
echo "在浏览器中打开 index.html 查看新的设施展示效果"
echo ""
echo "💡 如果效果不满意，可以："
echo "1. 恢复备份: cp images/backup/*.jpg images/"
echo "2. 手动下载更多样化的图片"
echo "3. 访问 pexels.com, pixabay.com 等网站获取不同风格图片"
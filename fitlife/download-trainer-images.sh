#!/bin/bash

# 下载专业教练图片脚本

echo "👥 下载专业教练图片..."
echo ""

# 备份现有教练图片
echo "📁 备份现有教练图片..."
mkdir -p images/backup-trainers
cp images/trainer-*.jpg images/backup-trainers/ 2>/dev/null
cp images/hero-1.jpg images/backup-trainers/ 2>/dev/null
echo "✅ 备份完成"

echo ""
echo "📥 开始下载新的教练图片..."

# 下载函数
download_trainer_image() {
    local url="$1"
    local filename="$2"
    local description="$3"
    
    echo "正在下载: $description"
    
    if curl -L -o "images/$filename" "$url" --silent --show-error --max-time 30; then
        # 验证文件大小
        local size=$(stat -c%s "images/$filename" 2>/dev/null || stat -f%z "images/$filename" 2>/dev/null)
        if [ "$size" -gt 10000 ]; then  # 大于10KB
            echo "✅ 下载成功: $filename ($(($size/1024))KB)"
        else
            echo "❌ 文件太小，可能下载失败: $filename"
            # 恢复备份
            if [ -f "images/backup-trainers/$filename" ]; then
                cp "images/backup-trainers/$filename" "images/$filename"
                echo "🔄 已恢复备份图片"
            fi
        fi
    else
        echo "❌ 下载失败: $filename"
        # 恢复备份
        if [ -f "images/backup-trainers/$filename" ]; then
            cp "images/backup-trainers/$filename" "images/$filename"
            echo "🔄 已恢复备份图片"
        fi
    fi
    
    sleep 1
}

# 下载专业教练图片
echo ""
echo "1️⃣ 下载男性力量教练图片 (张强)..."
download_trainer_image \
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" \
    "hero-1.jpg" \
    "男性力量教练"

echo ""
echo "2️⃣ 下载女性瑜伽教练图片 (李美丽)..."
download_trainer_image \
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" \
    "trainer-1.jpg" \
    "女性瑜伽教练"

echo ""
echo "3️⃣ 下载男性有氧教练图片 (王健)..."
download_trainer_image \
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" \
    "trainer-2.jpg" \
    "男性有氧教练"

echo ""
echo "🎉 教练图片下载完成！"
echo ""
echo "📊 下载结果："
echo "================================"
ls -lh images/hero-1.jpg images/trainer-1.jpg images/trainer-2.jpg 2>/dev/null | while read line; do
    echo "$line"
done

echo ""
echo "🧪 测试建议："
echo "1. 在浏览器中刷新页面"
echo "2. 导航到教练团队部分"
echo "3. 点击任意教练的'查看详情'按钮"
echo "4. 检查教练图片是否正常显示"

echo ""
echo "🔄 如果图片仍有问题："
echo "1. 检查浏览器控制台的错误信息"
echo "2. 恢复备份: cp images/backup-trainers/* images/"
echo "3. 手动下载其他教练图片"

echo ""
echo "💡 图片规格建议："
echo "- 尺寸: 400x400 像素"
echo "- 格式: JPG"
echo "- 大小: 50-200KB"
echo "- 内容: 专业教练形象照"
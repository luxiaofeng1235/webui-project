#!/bin/bash

# 更新健身房图片脚本 - 多样化来源版本
# 使用不同网站的图片，避免审美疲劳

echo "🎨 开始更新健身房图片（多样化版本）..."

# 创建备份目录
mkdir -p images/backup
echo "📁 备份原有图片..."
cp images/strength-training.jpg images/backup/ 2>/dev/null
cp images/cardio-area.jpg images/backup/ 2>/dev/null
cp images/yoga-studio.jpg images/backup/ 2>/dev/null
cp images/personal-training.jpg images/backup/ 2>/dev/null
cp images/lounge-area.jpg images/backup/ 2>/dev/null
cp images/locker-room.jpg images/backup/ 2>/dev/null

# 下载函数
download_image() {
    local filename="$1"
    local url="$2"
    local source="$3"
    
    echo "正在从 $source 下载: $filename"
    
    # 使用curl下载图片
    if curl -L -o "images/$filename" "$url" --silent --show-error; then
        echo "✅ 下载成功: $filename (来源: $source)"
    else
        echo "❌ 下载失败: $filename"
        # 如果下载失败，恢复备份
        if [ -f "images/backup/$filename" ]; then
            cp "images/backup/$filename" "images/$filename"
            echo "🔄 已恢复备份图片: $filename"
        fi
    fi
    
    sleep 1
}

echo ""
echo "🔄 开始下载多样化风格的图片..."
echo ""

# 从不同来源下载图片，提供更多样化的视觉效果
# 注意：这些是示例URL，您需要手动访问网站获取实际的下载链接

# Pexels 来源 - 现代工业风力量训练区
download_image "strength-training.jpg" "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1" "Pexels"

# Pixabay 来源 - 明亮现代有氧区
download_image "cardio-area.jpg" "https://cdn.pixabay.com/photo/2016/11/19/12/43/fitness-1839874_1280.jpg" "Pixabay"

# Burst 来源 - 禅意瑜伽室
download_image "yoga-studio.jpg" "https://burst.shopifycdn.com/photos/yoga-class.jpg" "Burst"

# Freepik 来源 - 高端私教区
download_image "personal-training.jpg" "https://img.freepik.com/free-photo/personal-trainer-working-with-client_23-2148971234.jpg" "Freepik"

# StockVault 来源 - 咖啡厅风休息区  
download_image "lounge-area.jpg" "https://www.stockvault.net/data/2019/03/15/gym-lounge-area.jpg" "StockVault"

# Pexels 来源 - 豪华更衣室
download_image "locker-room.jpg" "https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1" "Pexels"

echo ""
echo "🎉 图片更新完成！"
echo ""
echo "📊 图片来源统计："
echo "- Pexels: 2张 (现代风格)"
echo "- Pixabay: 1张 (简约风格)" 
echo "- Burst: 1张 (商业风格)"
echo "- Freepik: 1张 (专业风格)"
echo "- StockVault: 1张 (豪华风格)"
echo ""
echo "💡 如果某些图片下载失败，请："
echo "1. 手动访问对应网站"
echo "2. 搜索相关关键词"
echo "3. 下载喜欢的图片"
echo "4. 重命名为对应文件名"
echo ""
echo "🔄 备份文件保存在 images/backup/ 目录中"
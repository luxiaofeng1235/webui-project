#!/bin/bash

# 健身房图片下载脚本
# 兼容性版本，适用于所有shell

echo "🖼️ 开始下载健身房图片..."

# 创建images目录（如果不存在）
mkdir -p images

# 定义图片文件名和URL的对应关系
download_image() {
    local filename="$1"
    local url="$2"
    
    echo "正在下载: $filename"
    
    # 检查文件是否已存在
    if [ -f "images/$filename" ]; then
        echo "⚠️  文件已存在，跳过: $filename"
        return 0
    fi
    
    # 使用curl下载图片
    if curl -L -o "images/$filename" "$url" --silent --show-error; then
        echo "✅ 下载成功: $filename"
    else
        echo "❌ 下载失败: $filename"
    fi
    
    # 添加延迟避免请求过快
    sleep 1
}

# 下载所有图片（这些是示例URL，您需要替换为实际的免费图片URL）
download_image "strength-training.jpg" "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop"
download_image "cardio-area.jpg" "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop"
download_image "yoga-studio.jpg" "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop"
download_image "personal-training.jpg" "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop"
download_image "lounge-area.jpg" "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop"
download_image "locker-room.jpg" "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop"
download_image "gym-overview.jpg" "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop"
download_image "equipment-zone.jpg" "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop"
download_image "group-class.jpg" "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop"
download_image "reception-area.jpg" "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop"

echo ""
echo "🎉 图片下载完成！"
echo "📁 图片保存在 images/ 目录中"
echo ""
echo "📋 下载的图片列表："
ls -la images/*.jpg 2>/dev/null | grep -E "(strength-training|cardio-area|yoga-studio|personal-training|lounge-area|locker-room|gym-overview|equipment-zone|group-class|reception-area)" || echo "没有找到新下载的图片"

echo ""
echo "💡 提示："
echo "1. 这个脚本使用的是示例URL，您需要："
echo "   - 访问 https://unsplash.com"
echo "   - 搜索相关关键词（gym, fitness, yoga等）"
echo "   - 复制图片的下载链接"
echo "   - 替换脚本中的URL"
echo ""
echo "2. 或者手动下载图片并重命名为对应的文件名"
echo "3. 确保图片格式为JPG，尺寸建议1200x800或更高"
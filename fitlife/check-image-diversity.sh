#!/bin/bash

# 图片多样性检查工具
# 分析当前图片的风格和来源多样性

echo "🔍 正在分析图片多样性..."
echo ""

# 检查图片文件是否存在
check_image_exists() {
    local filename="$1"
    local description="$2"
    
    if [ -f "images/$filename" ]; then
        local size=$(ls -lh "images/$filename" | awk '{print $5}')
        echo "✅ $description: $filename ($size)"
        return 0
    else
        echo "❌ $description: $filename (缺失)"
        return 1
    fi
}

echo "📋 当前图片状态检查："
echo "================================"

check_image_exists "strength-training.jpg" "力量训练区"
check_image_exists "cardio-area.jpg" "有氧训练区"
check_image_exists "yoga-studio.jpg" "瑜伽教室"
check_image_exists "personal-training.jpg" "私人训练区"
check_image_exists "lounge-area.jpg" "休息区"
check_image_exists "locker-room.jpg" "更衣室"
check_image_exists "gym-overview.jpg" "健身房全景"
check_image_exists "equipment-zone.jpg" "器械区域"
check_image_exists "group-class.jpg" "团体课程"
check_image_exists "reception-area.jpg" "接待区"

echo ""
echo "🎨 风格多样性建议："
echo "================================"

echo "当前问题: 所有图片来自同一来源(Unsplash)，风格相对统一"
echo ""
echo "建议改进方案:"
echo "1. 🏭 力量训练区 → 工业风格 (Pexels)"
echo "2. 🌟 有氧训练区 → 现代简约 (Pixabay)"
echo "3. 🧘 瑜伽教室 → 禅意风格 (Burst)"
echo "4. 👥 私教区 → 豪华定制 (Freepik)"
echo "5. ☕ 休息区 → 咖啡厅风 (StockVault)"
echo "6. 🚿 更衣室 → 酒店风格 (Pexels不同摄影师)"

echo ""
echo "🔄 快速替换建议："
echo "================================"

echo "优先替换这些图片以获得最大视觉差异:"
echo ""
echo "🥇 第一优先级 (最需要替换):"
echo "   - strength-training.jpg (改为工业风黑色器械)"
echo "   - yoga-studio.jpg (改为木质地板禅意风)"
echo ""
echo "🥈 第二优先级:"
echo "   - lounge-area.jpg (改为咖啡厅风格)"
echo "   - personal-training.jpg (改为豪华定制风)"
echo ""
echo "🥉 第三优先级:"
echo "   - cardio-area.jpg (改为明亮现代风)"
echo "   - locker-room.jpg (改为酒店豪华风)"

echo ""
echo "📱 推荐操作步骤："
echo "================================"
echo "1. 备份现有图片: mkdir -p images/backup && cp images/*.jpg images/backup/"
echo "2. 访问 https://pexels.com 搜索 'gym weights industrial'"
echo "3. 访问 https://pixabay.com 搜索 'yoga studio zen'"
echo "4. 访问 https://burst.shopify.com 搜索 'fitness lounge'"
echo "5. 下载不同风格的图片并替换"
echo ""
echo "🎯 目标效果: 6种不同风格，避免审美疲劳"

# 检查是否有备份
echo ""
if [ -d "images/backup" ] && [ "$(ls -A images/backup)" ]; then
    echo "📁 发现备份文件夹，包含以下文件:"
    ls -la images/backup/ | grep -v "^total" | grep -v "^d"
else
    echo "⚠️  建议先创建备份: mkdir -p images/backup && cp images/*.jpg images/backup/"
fi

echo ""
echo "✨ 完成图片替换后，您的网站将拥有丰富多样的视觉效果！"
#!/bin/bash

# 修复重复图片问题的脚本

echo "🔧 修复facilities-grid中的重复图片问题..."
echo ""

echo "📊 当前重复情况："
echo "- pexels-photo-1552242.webp 被使用了 3 次"
echo "- pexels-photo-2827400.webp 被使用了 2 次" 
echo "- pexels-photo-3076509.webp 被使用了 2 次"
echo "- pexels-photo-3289711.webp 被使用了 2 次"
echo ""

echo "🎯 解决方案：为每个设施分配不同的备用图片"
echo ""

# 备份原文件
cp components/facilities.html components/facilities.html.backup
echo "📁 已备份原文件到 components/facilities.html.backup"
echo ""

echo "🔄 开始修复重复图片..."

# 使用sed命令替换重复的备用图片
# 力量训练区保持 pexels-photo-1552242.webp (力量训练相关)
# 有氧训练区保持 pexels-photo-1229356.webp (跑步相关)
# 瑜伽教室保持 pexels-photo-3076509.webp (瑜伽相关)
# 私教区保持 pexels-photo-2827400.webp (团体训练相关)
# 休息区保持 pexels-photo-3289711.webp (休息相关)

# 更衣室：从 pexels-photo-1552242.webp 改为其他图片
sed -i 's|locker-room\.jpg.*onerror="this\.src=.*pexels-photo-1552242\.webp.*"|locker-room.jpg" alt="更衣室" onerror="this.src='\''images/pexels-photo-2261477.jpeg'\''"|g' components/facilities.html

# 健身房全景：从 pexels-photo-1552242.webp 改为其他图片  
sed -i 's|gym-overview\.jpg.*onerror="this\.src=.*pexels-photo-1552242\.webp.*"|gym-overview.jpg" alt="健身房全景" onerror="this.src='\''images/hero-1.jpg'\''"|g' components/facilities.html

# 器械区域：从 pexels-photo-2827400.webp 改为其他图片
sed -i 's|equipment-zone\.jpg.*onerror="this\.src=.*pexels-photo-2827400\.webp.*"|equipment-zone.jpg" alt="器械区域" onerror="this.src='\''images/hero-2.jpg'\''"|g' components/facilities.html

# 团体课程：从 pexels-photo-3076509.webp 改为其他图片
sed -i 's|group-class\.jpg.*onerror="this\.src=.*pexels-photo-3076509\.webp.*"|group-class.jpg" alt="团体课程" onerror="this.src='\''images/hero-3.jpg'\''"|g' components/facilities.html

# 接待区：从 pexels-photo-3289711.webp 改为其他图片
sed -i 's|reception-area\.jpg.*onerror="this\.src=.*pexels-photo-3289711\.webp.*"|reception-area.jpg" alt="接待区" onerror="this.src='\''images/facility-1.jpg'\''"|g' components/facilities.html

echo "✅ 重复图片修复完成！"
echo ""

echo "📋 修复后的备用图片分配："
echo "================================"
echo "设施展示区域 (facilities-grid):"
echo "1. 力量训练区 → pexels-photo-1552242.webp (力量训练)"
echo "2. 有氧训练区 → pexels-photo-1229356.webp (跑步有氧)"  
echo "3. 瑜伽教室 → pexels-photo-3076509.webp (瑜伽)"
echo "4. 私教区 → pexels-photo-2827400.webp (团体训练)"
echo "5. 休息区 → pexels-photo-3289711.webp (休息放松)"
echo "6. 更衣室 → pexels-photo-2261477.jpeg (专业训练)"
echo ""
echo "环境展示画廊 (environment-gallery):"
echo "1. 健身房全景 → hero-1.jpg"
echo "2. 器械区域 → hero-2.jpg"  
echo "3. 团体课程 → hero-3.jpg"
echo "4. 接待区 → facility-1.jpg"
echo ""

echo "🎯 现在每个图片都有独特的备用方案，避免了重复！"
echo ""
echo "🔍 验证修复结果："
grep -n "onerror.*src=" components/facilities.html

echo ""
echo "✨ 修复完成！现在可以在浏览器中查看效果了。"
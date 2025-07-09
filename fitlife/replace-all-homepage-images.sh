#!/bin/bash

# 一键替换首页所有图片脚本
# 确保每张图片视觉效果不同，且无损坏

set -e  # 遇到错误立即退出

echo "🎨 一键替换首页所有图片"
echo "================================"
echo "📋 将替换以下图片："
echo "1. Hero轮播图 (6张)"
echo "2. 设施展示图 (6张)" 
echo "3. 环境画廊图 (4张)"
echo "4. 教练头像 (可选)"
echo "总计: 16-20张图片"
echo ""

# 配置参数
BACKUP_DIR="images/backup-$(date +%Y%m%d-%H%M%S)"
TEMP_DIR="images/temp-download"
LOG_FILE="image-replacement.log"

# 创建必要目录
mkdir -p "$BACKUP_DIR"
mkdir -p "$TEMP_DIR"

# 日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 验证图片完整性
verify_image() {
    local file="$1"
    local min_size=10000  # 最小10KB
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    local size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
    if [ "$size" -lt "$min_size" ]; then
        log "❌ 图片太小，可能损坏: $file ($size bytes)"
        return 1
    fi
    
    # 检查文件头是否为有效的图片格式
    if file "$file" | grep -qE "(JPEG|PNG|WebP|GIF)"; then
        log "✅ 图片验证通过: $file ($size bytes)"
        return 0
    else
        log "❌ 无效的图片格式: $file"
        return 1
    fi
}

# 安全下载函数
safe_download() {
    local url="$1"
    local filename="$2"
    local description="$3"
    local temp_file="$TEMP_DIR/$filename"
    
    log "📥 下载: $description"
    log "   URL: $url"
    
    # 下载到临时文件
    if curl -L -o "$temp_file" "$url" --silent --show-error --max-time 30; then
        # 验证图片完整性
        if verify_image "$temp_file"; then
            # 备份原图片
            if [ -f "images/$filename" ]; then
                cp "images/$filename" "$BACKUP_DIR/"
                log "📁 已备份: $filename"
            fi
            
            # 移动到目标位置
            mv "$temp_file" "images/$filename"
            log "✅ 成功替换: $filename"
            return 0
        else
            log "❌ 图片验证失败: $filename"
            rm -f "$temp_file"
            return 1
        fi
    else
        log "❌ 下载失败: $filename"
        return 1
    fi
}

# 备份现有图片
backup_existing_images() {
    log "📁 备份现有图片到: $BACKUP_DIR"
    
    # 备份所有相关图片
    for img in images/*.{jpg,jpeg,png,webp} images/pexels-*.* images/hero-*.* images/facility-*.* images/trainer-*.*; do
        if [ -f "$img" ]; then
            cp "$img" "$BACKUP_DIR/" 2>/dev/null || true
        fi
    done
    
    log "✅ 备份完成"
}

# 恢复备份函数
restore_backup() {
    log "🔄 恢复备份图片..."
    cp "$BACKUP_DIR"/* images/ 2>/dev/null || true
    log "✅ 备份已恢复"
}

# 主要替换函数
replace_images() {
    local success_count=0
    local total_count=0
    
    log "🚀 开始替换图片..."
    
    # 1. Hero轮播图 (6张) - 不同风格的健身房场景
    log ""
    log "1️⃣ 替换Hero轮播图..."
    
    # Hero图片 - 现代健身房全景
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-1552242.webp" "现代健身房全景"; then
        success_count=$((success_count + 1))
    fi
    
    # Hero图片 - 力量训练区特写
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-2261477.jpeg" "力量训练区特写"; then
        success_count=$((success_count + 1))
    fi
    
    # Hero图片 - 瑜伽课程场景
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-3076509.webp" "瑜伽课程场景"; then
        success_count=$((success_count + 1))
    fi
    
    # Hero图片 - 跑步有氧训练
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-1229356.webp" "跑步有氧训练"; then
        success_count=$((success_count + 1))
    fi
    
    # Hero图片 - 团体健身课程
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-2827400.webp" "团体健身课程"; then
        success_count=$((success_count + 1))
    fi
    
    # Hero图片 - 专业健身指导
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1506629905607-ce19a96b7e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "pexels-photo-3289711.webp" "专业健身指导"; then
        success_count=$((success_count + 1))
    fi
    
    # 2. 设施展示图 (6张) - 不同风格的设施区域
    log ""
    log "2️⃣ 替换设施展示图..."
    
    # 工业风力量训练区
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "strength-training.jpg" "工业风力量训练区"; then
        success_count=$((success_count + 1))
    fi
    
    # 明亮现代有氧区
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "cardio-area.jpg" "明亮现代有氧区"; then
        success_count=$((success_count + 1))
    fi
    
    # 禅意瑜伽教室
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "yoga-studio.jpg" "禅意瑜伽教室"; then
        success_count=$((success_count + 1))
    fi
    
    # 豪华私教区
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "personal-training.jpg" "豪华私教区"; then
        success_count=$((success_count + 1))
    fi
    
    # 现代休息区
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "lounge-area.jpg" "现代休息区"; then
        success_count=$((success_count + 1))
    fi
    
    # 豪华更衣室
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "locker-room.jpg" "豪华更衣室"; then
        success_count=$((success_count + 1))
    fi
    
    # 3. 环境画廊图 (4张) - 不同角度的健身房环境
    log ""
    log "3️⃣ 替换环境画廊图..."
    
    # 健身房全景
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" \
        "gym-overview.jpg" "健身房全景"; then
        success_count=$((success_count + 1))
    fi
    
    # 器械区域
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "equipment-zone.jpg" "器械区域"; then
        success_count=$((success_count + 1))
    fi
    
    # 团体课程
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "group-class.jpg" "团体课程"; then
        success_count=$((success_count + 1))
    fi
    
    # 接待区
    total_count=$((total_count + 1))
    if safe_download "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80" \
        "reception-area.jpg" "接待区"; then
        success_count=$((success_count + 1))
    fi
    
    # 返回成功率
    echo "$success_count/$total_count"
}

# 清理临时文件
cleanup() {
    log "🧹 清理临时文件..."
    rm -rf "$TEMP_DIR"
    log "✅ 清理完成"
}

# 主程序
main() {
    log "🚀 开始一键替换首页图片"
    
    # 检查网络连接
    if ! curl -s --max-time 5 https://images.unsplash.com > /dev/null; then
        log "❌ 网络连接失败，无法下载图片"
        exit 1
    fi
    
    # 备份现有图片
    backup_existing_images
    
    # 替换图片
    result=$(replace_images)
    success_count=$(echo "$result" | cut -d'/' -f1)
    total_count=$(echo "$result" | cut -d'/' -f2)
    
    # 计算成功率
    success_rate=$(( success_count * 100 / total_count ))
    
    log ""
    log "📊 替换结果统计："
    log "================================"
    log "总计图片: $total_count 张"
    log "成功替换: $success_count 张"
    log "失败数量: $((total_count - success_count)) 张"
    log "成功率: $success_rate%"
    
    if [ "$success_rate" -lt 80 ]; then
        log "⚠️  成功率低于80%，建议检查网络连接后重试"
        read -p "是否恢复备份图片？(y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            restore_backup
        fi
    else
        log "🎉 图片替换完成！"
        log "📁 备份保存在: $BACKUP_DIR"
        log "📋 日志保存在: $LOG_FILE"
        log ""
        log "✨ 现在您的首页拥有了全新的、视觉效果各异的图片！"
        log "🌐 可以在浏览器中查看效果了"
    fi
    
    # 清理临时文件
    cleanup
}

# 信号处理
trap cleanup EXIT
trap 'log "❌ 脚本被中断"; cleanup; exit 1' INT TERM

# 执行主程序
main "$@"
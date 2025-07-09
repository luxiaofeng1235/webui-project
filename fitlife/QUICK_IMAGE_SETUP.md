# 🖼️ 快速图片设置指南

## 📋 需要的图片文件

您需要下载以下10张图片并放入 `images/` 文件夹：

### 设施展示图片 (6张)
1. **strength-training.jpg** - 力量训练区域
2. **cardio-area.jpg** - 有氧训练区域  
3. **yoga-studio.jpg** - 瑜伽教室
4. **personal-training.jpg** - 私人训练区
5. **lounge-area.jpg** - 休息区
6. **locker-room.jpg** - 更衣室

### 环境画廊图片 (4张)
7. **gym-overview.jpg** - 健身房全景
8. **equipment-zone.jpg** - 器械区域
9. **group-class.jpg** - 团体课程
10. **reception-area.jpg** - 接待区

## 🔍 推荐搜索关键词

### Unsplash.com 搜索词
```
gym interior
fitness center
weight training
cardio machines
yoga studio
personal trainer
gym lounge
locker room
gym equipment
group fitness class
gym reception
fitness facility
```

### 中文搜索词（适用于国内网站）
```
健身房内部
力量训练区
有氧器械
瑜伽教室
私人教练
健身房休息区
更衣室
健身器材
团体课程
健身房前台
```

## 📥 快速下载步骤

### 方法1: 使用Unsplash（推荐）
1. 访问 [Unsplash.com](https://unsplash.com)
2. 搜索上述关键词
3. 选择合适的图片
4. 点击下载按钮
5. 重命名为对应的文件名
6. 放入 `images/` 文件夹

### 方法2: 使用Pexels
1. 访问 [Pexels.com](https://pexels.com)
2. 搜索 "gym", "fitness", "yoga" 等
3. 下载免费图片
4. 重命名并放入文件夹

### 方法3: 使用Pixabay
1. 访问 [Pixabay.com](https://pixabay.com)
2. 搜索健身相关图片
3. 选择免费商用图片下载

## 🎯 图片规格要求

- **格式**: JPG 或 WebP
- **尺寸**: 最小 1200x800 像素
- **文件大小**: 200KB - 2MB
- **比例**: 3:2 或 16:9
- **质量**: 高清，光线充足

## ⚡ 快速测试

下载图片后，您可以：

1. **运行测试脚本**:
   ```bash
   ./download-images.sh
   ```

2. **检查图片**:
   ```bash
   ls -la images/
   ```

3. **在浏览器中查看效果**:
   打开 `index.html` 并导航到设施展示部分

## 🔧 故障排除

### 如果图片不显示：
1. 检查文件名是否正确
2. 确保图片在 `images/` 文件夹中
3. 检查图片格式是否为 JPG
4. 验证图片文件没有损坏

### 备用方案：
如果某些图片找不到，系统会自动使用现有的图片作为备用：
- `pexels-photo-1552242.webp` (力量训练)
- `pexels-photo-1229356.webp` (有氧训练)
- `pexels-photo-3076509.webp` (瑜伽)
- `pexels-photo-2827400.webp` (团体训练)
- `pexels-photo-3289711.webp` (休息区)

## 📱 移动端优化

建议为移动端准备压缩版本：
- 创建 `images/mobile/` 文件夹
- 将图片压缩到 800x600 或更小
- 在CSS中使用媒体查询加载不同尺寸

## 🎨 图片优化建议

1. **压缩图片**: 使用在线工具如 TinyPNG
2. **转换格式**: 考虑使用 WebP 格式
3. **添加懒加载**: 提高页面加载速度
4. **设置备用图片**: 确保图片加载失败时有备选方案

## ✅ 完成检查清单

- [ ] 下载了所有10张图片
- [ ] 图片文件名正确
- [ ] 图片放在 `images/` 文件夹中
- [ ] 图片格式为 JPG 或 WebP
- [ ] 图片尺寸符合要求
- [ ] 在浏览器中测试显示效果
- [ ] 检查移动端显示效果

完成后，您的健身网站将拥有专业的设施展示效果！
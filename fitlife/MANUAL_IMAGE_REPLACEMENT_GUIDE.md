# 🎨 手动图片替换指南

## 🎯 避免审美疲劳的解决方案

### 问题分析
当前所有图片都来自Unsplash，风格相对统一，容易产生审美疲劳。我们需要从不同来源获取不同风格的图片。

## 🔍 推荐的具体操作步骤

### 方法1: 使用多个免费图片网站

#### 1. **Pexels.com** - 力量训练区
- 访问: https://pexels.com
- 搜索: "gym weights" 或 "strength training"
- 选择风格: 现代工业风，黑色器械
- 下载并重命名为: `strength-training.jpg`

#### 2. **Pixabay.com** - 有氧训练区
- 访问: https://pixabay.com
- 搜索: "treadmill gym" 或 "cardio equipment"
- 选择风格: 明亮现代，自然光线
- 下载并重命名为: `cardio-area.jpg`

#### 3. **Burst.shopify.com** - 瑜伽教室
- 访问: https://burst.shopify.com
- 搜索: "yoga studio" 或 "meditation room"
- 选择风格: 禅意风格，木质地板
- 下载并重命名为: `yoga-studio.jpg`

#### 4. **Freepik.com** - 私人训练区
- 访问: https://freepik.com
- 搜索: "personal trainer" 或 "private gym"
- 选择风格: 高端定制，专业设备
- 下载并重命名为: `personal-training.jpg`

#### 5. **StockVault.net** - 休息区
- 访问: https://stockvault.net
- 搜索: "gym lounge" 或 "fitness center lobby"
- 选择风格: 咖啡厅风格，舒适沙发
- 下载并重命名为: `lounge-area.jpg`

#### 6. **回到Pexels** - 更衣室（不同摄影师）
- 搜索: "locker room" 或 "changing room"
- 选择风格: 豪华酒店风，大理石装修
- 下载并重命名为: `locker-room.jpg`

### 方法2: 寻找不同摄影风格

#### 🎨 **风格多样化建议:**

1. **工业风** (力量训练区)
   - 特征: 裸露混凝土、黑色器械、冷色调
   - 关键词: "industrial gym", "raw concrete gym"

2. **北欧简约风** (有氧区)
   - 特征: 白色主调、自然光、简洁线条
   - 关键词: "scandinavian gym", "minimalist fitness"

3. **日式禅意风** (瑜伽室)
   - 特征: 木质材料、暖色调、自然元素
   - 关键词: "zen yoga studio", "japanese meditation"

4. **美式豪华风** (私教区)
   - 特征: 皮质器械、深色木材、奢华感
   - 关键词: "luxury personal training", "premium gym"

5. **现代商务风** (休息区)
   - 特征: 现代家具、商务氛围、专业感
   - 关键词: "corporate wellness", "business gym lounge"

6. **度假村风** (更衣室)
   - 特征: 度假村风格、温馨舒适
   - 关键词: "resort spa locker", "luxury changing room"

## 🛠️ 具体操作步骤

### 步骤1: 备份现有图片
```bash
mkdir -p images/backup
cp images/*.jpg images/backup/
```

### 步骤2: 逐一替换图片
1. 访问推荐网站
2. 搜索对应关键词
3. 选择不同风格的图片
4. 下载到本地
5. 重命名为对应文件名
6. 替换到 `images/` 文件夹

### 步骤3: 验证效果
```bash
# 查看图片文件
ls -la images/

# 在浏览器中查看效果
open index.html
```

## 🎯 具体推荐图片类型

### 力量训练区 - 寻找这样的图片:
- ✅ 黑色哑铃架，工业风装修
- ✅ 专业奥林匹克杠铃平台
- ✅ 现代化力量器械区域
- ❌ 避免: 过于相似的白色现代风

### 有氧训练区 - 寻找这样的图片:
- ✅ 跑步机排列整齐，自然采光
- ✅ 动感单车教室，彩色装饰
- ✅ 椭圆机区域，现代化设计
- ❌ 避免: 与力量区风格过于相似

### 瑜伽教室 - 寻找这样的图片:
- ✅ 木质地板，瑜伽垫整齐摆放
- ✅ 大镜子墙面，自然光线
- ✅ 植物装饰，禅意氛围
- ❌ 避免: 过于商业化的健身房风格

## 🔄 如果仍然不满意

### 选项1: 使用AI生成图片
- Midjourney: 高质量AI图片
- DALL-E: OpenAI的图片生成
- Stable Diffusion: 开源AI图片生成

### 选项2: 购买付费图片
- Shutterstock: 专业摄影图片
- Getty Images: 高端商业图片
- Adobe Stock: 设计师常用

### 选项3: 自己拍摄
- 参观当地健身房
- 获得拍摄许可
- 拍摄真实场景

## ✅ 检查清单

- [ ] 已备份原有图片
- [ ] 从至少3个不同网站获取图片
- [ ] 确保每张图片风格不同
- [ ] 图片尺寸符合要求 (1200x800+)
- [ ] 文件格式为JPG
- [ ] 文件名正确
- [ ] 在浏览器中测试效果
- [ ] 检查移动端显示

完成后，您的网站将拥有风格多样、视觉丰富的设施展示效果！
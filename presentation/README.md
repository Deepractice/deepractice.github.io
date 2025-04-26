# DeepracticeX 网页演示系统使用文档

这是一个基于网页的演示系统，用于创建具有现代UI和交互效果的演示文稿。该系统采用HTML、CSS和JavaScript构建，无需任何后端服务，可以在任何支持现代浏览器的环境中运行。

## 目录结构

```
presentation/
├── foundation-logic.html    # "人、AI与计算机"主题的演示文稿
├── presentation.css         # 通用样式文件
├── presentation.js          # 通用交互逻辑
└── README.md               # 本使用文档
```

## 快速开始

1. 如需创建新的演示主题，复制`foundation-logic.html`并重命名为你的主题名称，例如`your-topic.html`
2. 修改HTML文件中的标题、描述和关键词
3. 编辑幻灯片内容
4. 在浏览器中打开HTML文件即可查看演示效果

## 详细使用指南

### 1. 创建新的演示主题

每个演示主题都应该有自己独立的HTML文件，但可以共享CSS和JavaScript文件。创建新主题的步骤：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>你的演示标题 | DeepracticeX</title>
    <meta name="description" content="演示描述">
    <meta name="keywords" content="关键词1,关键词2">
    <meta name="author" content="深度实践">
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="presentation.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <!-- 基本结构保持不变 -->
    <!-- 修改幻灯片内容 -->
</body>
</html>
```

### 2. 幻灯片结构

每个幻灯片使用以下结构：

```html
<div class="slide" id="slide-X">
    <div class="slide-content">
        <h2 class="slide-title">幻灯片标题</h2>
        <!-- 幻灯片内容 -->
    </div>
</div>
```

确保为第一张幻灯片添加`active`类：

```html
<div class="slide active" id="slide-1">
```

### 3. 内容组件

系统提供多种内容组件，可以根据需要组合使用：

#### 标题和副标题

```html
<h2 class="slide-title">主标题</h2>
<h3>副标题</h3>
```

#### 问题框

```html
<div class="question-box">
    <p>你的问题内容</p>
</div>
```

#### 示例网格

```html
<div class="example-grid">
    <div class="example-item">
        <i class="fas fa-icon"></i>
        <p>示例文本</p>
    </div>
    <!-- 更多示例项目 -->
</div>
```

#### 挑战框

```html
<div class="challenge-box">
    <h3>标题</h3>
    <ul>
        <li>列表项</li>
        <!-- 更多列表项 -->
    </ul>
</div>
```

#### 比较框

```html
<div class="comparison-box">
    <p>介绍文字</p>
    <div class="comparison-item">
        <div class="icon-box"><i class="fas fa-icon"></i></div>
        <p>比较文本</p>
    </div>
    <!-- 更多比较项目 -->
</div>
```

#### 结论框

```html
<div class="conclusion-box">
    <p>结论文字</p>
</div>
```

#### 三角概念展示

```html
<div class="triangle-concept">
    <div class="concept-item" id="concept1">
        <h3>概念1</h3>
        <ul>
            <li>要点</li>
            <!-- 更多要点 -->
        </ul>
    </div>
    <!-- 更多概念 -->
</div>
```

### 4. 装饰元素

添加视觉装饰元素：

```html
<div class="decoration">
    <div class="triangle-decoration" style="--size: 80px; --top: 20%; --left: 10%; --rotation: 30deg;"></div>
    <div class="circle-decoration" style="--size: 60px; --top: 70%; --left: 85%; --rotation: 0deg;"></div>
    <div class="square-decoration" style="--size: 50px; --top: 80%; --left: 20%; --rotation: 45deg;"></div>
</div>
```

### 5. 更新幻灯片计数器

修改控制栏中的幻灯片计数器以匹配实际幻灯片数量：

```html
<div id="slide-counter">1 / X</div>  <!-- X是幻灯片总数 -->
```

## CSS自定义

`presentation.css`文件包含所有样式定义。主要样式变量在网站的主CSS文件中定义：

- `--primary-color`: 主色调（蓝色）
- `--secondary-color`: 辅助色调（绿色）
- `--accent-color`: 强调色调（红色）
- `--dark-color`: 深色背景
- `--light-text`: 浅色文本
- `--text-color`: 主要文本颜色
- `--text-secondary`: 次要文本颜色

如需修改特定组件样式，可在CSS文件中找到相应类名进行编辑。

## JavaScript功能

`presentation.js`文件包含三个主要功能：

1. `initParticles()`: 初始化背景粒子效果
2. `initSlideControls()`: 初始化幻灯片控制（前进、后退、全屏）
3. `initNavigation()`: 初始化导航栏交互

### 按键导航

系统支持以下键盘快捷键：

- 左箭头：上一张幻灯片
- 右箭头或空格：下一张幻灯片
- F键：切换全屏模式

## 自适应设计

演示系统采用响应式设计，可在不同屏幕尺寸上正常显示：

- 桌面电脑（1024px以上）
- 平板电脑（768px-1024px）
- 移动设备（768px以下）
- 小屏幕移动设备（480px以下）

## 最佳实践

1. **保持每张幻灯片内容简洁**：避免在一张幻灯片中放置过多内容
2. **使用图标增强视觉效果**：系统集成了Font Awesome图标，可通过`<i class="fas fa-图标名"></i>`使用
3. **利用高亮文本强调关键词**：使用`<span class="highlight">文本</span>`突出显示重要内容
4. **保持一致的风格**：在所有演示文稿中使用一致的视觉元素和结构
5. **使用id属性组织幻灯片**：确保每张幻灯片有唯一的id，便于未来添加直接链接功能

## 故障排除

- **粒子效果不显示**：确保互联网连接正常，能够加载CDN上的particles.js库
- **样式问题**：检查是否正确链接了所有CSS文件
- **幻灯片切换问题**：确保幻灯片结构正确，特别是第一张幻灯片应有active类

## 扩展功能

该系统设计为可扩展的，未来可考虑添加的功能：

1. 导出为PDF功能
2. 幻灯片缩略图导航
3. 更多动画效果
4. 演讲者注释功能
5. 计时器功能

希望本文档能帮助你有效地使用这套演示系统！如有问题，请联系我们的开发团队。 
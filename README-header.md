# 深度实践官网

> AI智能协作平台官方网站

## 🚀 本地开发

### 快速启动

由于浏览器的CORS安全策略，建议使用本地服务器运行网站：

```bash
# 方式1: 使用Python (推荐)
python -m http.server 8000
# 然后访问: http://localhost:8000

# 方式2: 使用Node.js 
npx serve .
# 然后访问: http://localhost:3000

# 方式3: 使用VS Code Live Server扩展
# 右键index.html -> Open with Live Server
```

### 常见问题

- **CORS错误**: 请使用本地服务器而不是直接打开HTML文件
- **资源加载失败**: 检查网络连接，确保CDN资源可访问
- **Analytics错误**: 本地开发环境会自动跳过统计脚本加载

---

# 网站Header & Footer共享模版系统

## 概述

为了解决网站header和footer代码重复的问题，我们实现了一个基于JavaScript的共享模版系统。现在所有页面都使用同一个header和footer模版，确保了一致性并方便维护。

## 系统架构

### 1. 核心文件

- `includes/header.html` - 共享的header模版文件
- `includes/footer.html` - 共享的footer模版文件
- `js/header.js` - 动态加载header和footer的JavaScript文件

### 2. 工作原理

1. 每个页面包含两个容器：
   - `<div id="header-container"></div>` - 在`<body>`开始处
   - `<div id="footer-container"></div>` - 在页面结束处
2. 页面加载时，`header.js`会自动：
   - 异步加载`includes/header.html`和`includes/footer.html`
   - 将header和footer内容分别插入到对应容器中
   - 根据当前页面设置正确的导航状态
   - 初始化移动端菜单和下拉菜单功能

## 使用方法

### 对于新页面

1. 在HTML的`<head>`部分引入header.js：
```html
<script src="js/header.js"></script>
```

2. 在页面中添加header和footer容器：
```html
<body>
    <!-- 其他内容如粒子背景等 -->
    <div id="particles-js"></div>
    
    <!-- Header容器 -->
    <div id="header-container"></div>
    
    <!-- 页面主要内容 -->
    
    <!-- Footer容器 -->
    <div id="footer-container"></div>
    
    <!-- 其他脚本 -->
</body>
```

3. 确保为导航链接设置正确的`data-page`属性以支持当前页面高亮

### 更新现有页面

已完成的页面：
- ✅ `index.html`
- ✅ `blog.html` 
- ✅ `prompts.html`

其他页面需要按照上述方法进行更新。

## 导航状态管理

系统会自动检测当前页面并设置正确的导航状态：

- `index.html` 或根路径 → `home`
- `blog.html` → `blog`
- `prompts.html` → `prompts`

对应的导航链接会自动获得`active`类。

## 维护Header和Footer

现在只需要维护两个文件：
- `includes/header.html` - 修改导航栏
- `includes/footer.html` - 修改页脚（包含社交媒体链接）

所有对header和footer的修改（添加新导航项、更改链接、修改样式、更新版权信息、更新社交媒体链接等）只需要在这两个文件中进行，会自动应用到所有页面。

### 社交媒体链接

Footer中已包含社交媒体链接：
- **GitHub**: https://github.com/Deepractice （已配置）
- **微信**: 待配置链接
- **微博**: 待配置链接

当需要更新GitHub组织链接或添加新的社交媒体链接时，只需修改 `includes/footer.html` 文件即可。

## 注意事项

1. 确保服务器支持加载静态HTML文件（大多数Web服务器默认支持）
2. 如果在本地开发，某些浏览器可能因为CORS策略阻止加载本地文件，建议使用本地服务器
3. 移动端菜单和下拉菜单的JavaScript功能已集成到header.js中
4. Footer会自动加载，无需额外配置

## 扩展功能

可以轻松扩展header.js来支持：
- 更多页面类型的自动识别
- 动态菜单内容
- 用户登录状态显示
- 多语言支持
- 等等

这个系统为网站header和footer提供了一个可维护、可扩展的解决方案。 
# 网站地图(Sitemap)自动生成系统

## 📊 系统概述

自动化生成SEO友好的`sitemap.xml`文件，确保搜索引擎能够有效发现和索引您的网站页面。

## 🎯 核心功能

### 📱 智能页面发现
- **自动扫描**：递归扫描整个网站的HTML文件
- **智能过滤**：自动排除模板文件、示例文件等非网页内容
- **有效性检查**：验证HTML结构和SEO必要元素（title标签等）

### 🎛️ 优先级管理
- **主要页面**：首页(1.0)、博客页面(0.9)、提示词库(0.9)
- **内容页面**：博客文章(0.8)、演示页面(0.7)
- **辅助页面**：个人页面(0.6)、提示词页面(0.5)
- **自动排序**：按优先级排序，确保重要页面在前

### 🔄 更新频率设置
- **主要页面**：weekly（每周更新）
- **内容页面**：monthly（每月更新）
- **自动时间戳**：基于文件修改时间自动设置lastmod

## 🚀 使用方法

### 基础使用
```bash
cd .cloudflare
python3 generate_sitemap.py
```

### 详细输出模式
```bash
python3 generate_sitemap.py --verbose
```

### 检查模式（不生成文件）
```bash
python3 generate_sitemap.py --check
```

### 自定义输出路径
```bash
python3 generate_sitemap.py --output /path/to/sitemap.xml
```

### CI/CD模式
```bash
python3 deploy_generate_sitemap.py
```

## 📋 页面配置规则

### 优先级配置
```python
PAGE_CONFIG = {
    # 主要页面
    "index.html": {"priority": 1.0, "changefreq": "weekly"},
    "blog.html": {"priority": 0.9, "changefreq": "weekly"},
    "prompts.html": {"priority": 0.9, "changefreq": "weekly"},
    
    # 博客文章
    "blog/*.html": {"priority": 0.8, "changefreq": "monthly"},
    
    # 演示页面
    "presentation/*.html": {"priority": 0.7, "changefreq": "monthly"},
    
    # 个人页面
    "people/*.html": {"priority": 0.6, "changefreq": "monthly"},
    
    # 提示词页面
    "prompt-html/**/*.html": {"priority": 0.5, "changefreq": "monthly"},
}
```

### 自动排除规则
自动排除以下类型的文件：
- `/docs/` - 文档目录
- `/node_modules/` - Node.js依赖
- `/.git/` - Git版本控制
- `example.html` - 示例文件
- `test.html` - 测试文件
- `includes/` - 模板片段

## 🔍 功能特性

### URL处理
- ✅ 自动URL编码（支持中文文件名）
- ✅ 首页特殊处理（index.html → /）
- ✅ 完整URL生成（https://deepracticex.com/...）
- ✅ 路径安全性检查

### 文件验证
- ✅ HTML结构检查（`<html>`标签）
- ✅ SEO必要元素检查（`<title>`标签）
- ✅ 文件可读性检查
- ✅ 编码兼容性处理

### 时间戳管理
- ✅ 基于文件修改时间的lastmod
- ✅ 标准ISO 8601日期格式
- ✅ 容错处理（文件不可访问时使用当前时间）

## 📊 生成统计

### 当前网站覆盖
- **主要页面**: 3个（首页、博客、提示词库）
- **博客文章**: 8个（技术博客）
- **演示页面**: 3个（产品演示）
- **个人页面**: 1个（团队成员）
- **提示词页面**: 13个（各类专业提示词）

**总计**: 28个有效页面，确保全站SEO覆盖。

## 🛠️ 技术实现

### XML生成
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://deepracticex.com/</loc>
        <lastmod>2025-06-03</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- 更多页面... -->
</urlset>
```

### 错误处理
1. **文件访问错误**：优雅降级，记录警告
2. **编码问题**：UTF-8强制处理
3. **路径问题**：相对路径标准化
4. **网络URL**：安全转义和编码

## 🔄 集成部署

### Cloudflare Pages
在构建命令中添加：
```bash
cd .cloudflare && python3 deploy_generate_sitemap.py && cd ..
```

### 与Analytics集成
完整SEO优化部署：
```bash
cd .cloudflare && python3 deploy_install_analytics.py && python3 deploy_generate_sitemap.py && cd ..
```

### GitHub Actions
```yaml
- name: Generate Sitemap
  run: |
    cd .cloudflare
    python3 generate_sitemap.py
```

## 📈 SEO优化效果

### 搜索引擎提交
生成sitemap.xml后，建议提交到：
1. **Google Search Console** - 提升Google搜索收录
2. **百度站长平台** - 优化百度搜索表现
3. **robots.txt** - 添加 `Sitemap: https://deepracticex.com/sitemap.xml`

### 收录监控
定期检查：
- 页面收录数量
- 索引状态
- 爬取错误
- 更新频率

## 🔧 自定义配置

### 修改网站URL
```python
WEBSITE_URL = "https://your-domain.com"
```

### 调整优先级
```python
PAGE_CONFIG = {
    "your-page.html": {"priority": 0.9, "changefreq": "daily"},
    # 添加更多配置...
}
```

### 添加排除规则
```python
excluded_patterns = [
    "/admin/",
    "/private/",
    "draft.html"
]
```

通过自动化sitemap生成，确保网站SEO始终保持最佳状态！ 
# Deepractice 部署工具集

## 📊 系统概述

简化的自动化部署工具集，专注于SEO优化和高效部署。

## 🎯 核心理念

### 统一Analytics管理
- **集中管理**: 所有Analytics代码统一在 `includes/footer.html` 中
- **双统计系统**: 百度统计（国内）+ Cloudflare Analytics（全球）
- **环境感知**: 本地开发时自动跳过统计代码
- **一次配置**: 不需要在每个页面重复添加

### 自动化Sitemap
- **智能发现**: 自动扫描所有有效HTML页面
- **SEO优化**: 智能设置优先级和更新频率
- **实时更新**: CI/CD自动更新网站地图

## 📁 文件说明

### 主要脚本
- `ci.py` - 统一CI/CD部署脚本（仅Sitemap生成）
- `generate_sitemap.py` - Sitemap生成主脚本
- `deploy_generate_sitemap.py` - CI/CD模式的Sitemap生成

### 工具脚本  
- `cleanup_analytics.py` - 一次性清理工具，移除重复Analytics代码

### 文档
- `CI_README.md` - CI/CD系统详细说明
- `SITEMAP_README.md` - Sitemap生成系统说明

## 🚀 快速使用

### 生成网站地图
```bash
cd .cloudflare
python3 ci.py
```

### CI/CD部署
```bash
cd .cloudflare && python3 ci.py --quiet && cd ..
```

### 清理重复Analytics（仅需执行一次）
```bash
cd .cloudflare
python3 cleanup_analytics.py
```

## 🔄 架构演进

### 之前的架构（已简化）
- ❌ 每个页面单独管理Analytics代码
- ❌ CI/CD需要安装/更新Analytics
- ❌ 容易出现重复代码和版本不一致

### 现在的架构（简化后）
- ✅ Analytics统一在footer.html管理
- ✅ CI/CD专注Sitemap生成
- ✅ 代码简洁，维护方便
- ✅ 环境感知，开发友好

## 📊 统计数据覆盖

当前网站结构：
- **主要页面**: 3个（首页、博客、提示词库）
- **博客文章**: 8个
- **演示页面**: 3个  
- **个人页面**: 1个
- **提示词页面**: 13个

**总计**: 28个页面，100%覆盖Analytics和Sitemap

## 🌟 优势特性

- **维护简单**: 一处修改，全站生效
- **性能优化**: 环境检测，本地开发无统计代码干扰
- **SEO友好**: 自动Sitemap，优化搜索引擎收录
- **CI/CD友好**: 专注核心功能，部署快速可靠

通过这种架构，实现了代码的高内聚、低耦合，既保证了功能完整性，又极大简化了维护工作！ 
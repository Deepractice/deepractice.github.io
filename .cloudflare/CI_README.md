# Deepractice CI/CD 自动化部署系统

## 概述

`ci.py` 是一个简化的CI/CD部署脚本，专注于SEO优化的Sitemap自动生成功能，提供高效的部署解决方案。

## 功能特性

- 🗺️ **Sitemap生成**: 自动生成SEO网站地图文件
- 📊 **详细统计**: 提供执行结果统计和时间监控
- 🔍 **环境检查**: 自动检查运行环境和依赖脚本
- 🌟 **友好界面**: 中文界面，清晰的步骤指示

## 使用方法

### 基本用法

```bash
# 生成Sitemap
python3 ci.py

# 仅生成Sitemap（等同于默认）
python3 ci.py --sitemap-only

# 环境检查
python3 ci.py --check

# 静默模式（减少输出）
python3 ci.py --quiet
```

### 参数说明

| 参数 | 描述 |
|------|------|
| `--sitemap-only` | 仅执行Sitemap生成（默认行为） |
| `--check` | 仅进行环境检查，不执行任何部署任务 |
| `--quiet`, `-q` | 静默模式，减少输出信息 |

## 执行流程

1. **环境检查**: 验证必要脚本和运行环境
2. **Sitemap生成**: 自动发现页面，生成SEO友好的网站地图
3. **结果统计**: 显示执行结果、用时和建议

## 输出示例

```
🚀==================================================🚀
    Deepractice CI/CD 自动化部署系统
🚀==================================================🚀

🔍 环境检查
----------------------------------------
✅ 环境检查通过
✅ 必要脚本齐全

🎯 执行计划: 1 个任务

📋 步骤 1/1: Sitemap生成
----------------------------------------
🔄 正在执行: 生成SEO网站地图
  ✅ 成功生成 ../sitemap.xml
  📊 包含 28 个有效页面
✅ 生成SEO网站地图 完成 (0.1s)

📊 执行结果统计
==================================================
✅ 成功任务: 1/1
❌ 失败任务: 0/1
⏱️  总用时: 0.1 秒
📅 完成时间: 2025-06-04 10:55:07

🎉 部署完成！所有任务执行成功

🌟 后续建议:
   1. 验证sitemap.xml文件是否生成
   2. 检查sitemap内容是否正确
   3. 提交sitemap到搜索引擎
```

## 依赖脚本

CI系统依赖以下脚本，确保它们存在于 `.cloudflare` 目录中：

- `deploy_generate_sitemap.py` - Sitemap生成脚本
- `generate_sitemap.py` - Sitemap主脚本

## 错误处理

- **环境检查失败**: 确保在正确目录运行，检查依赖脚本
- **Sitemap生成失败**: 检查文件权限，确保能写入根目录

## 架构说明

### Analytics管理
Analytics代码现在统一由 `includes/footer.html` 管理，包括：
- 百度统计：国内用户访问统计
- Cloudflare Analytics：全球用户和技术指标
- 环境检测：本地开发时跳过统计代码

### Sitemap管理
CI系统负责自动生成和更新sitemap.xml：
- 智能页面发现
- SEO优先级配置
- 自动更新时间戳

## 在CI/CD流程中使用

### GitHub Actions示例

```yaml
- name: 部署网站
  run: |
    cd .cloudflare
    python3 ci.py --quiet
```

### Cloudflare Pages配置

```bash
cd .cloudflare && python3 ci.py --quiet && cd ..
```

### 本地开发

```bash
# 生成sitemap
cd .cloudflare
python3 ci.py

# 快速检查
python3 ci.py --check
```

## 工具介绍

### 独立工具
- `cleanup_analytics.py` - 一次性清理工具，用于移除重复的Analytics代码

### 已简化的架构
- 移除了重复的Analytics安装流程
- 统一管理Analytics在footer.html中
- 专注于SEO优化的Sitemap生成

## 更新记录

- **v1.0**: 完整版本，包含Analytics和Sitemap功能
- **v2.0**: 简化版本，专注Sitemap生成，Analytics统一管理
- 支持静默输出和环境检查
- 完整的中文界面和错误处理 
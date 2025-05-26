# Cloudflare Web Analytics 自动安装工具

一个统一的脚本，自动为项目中所有HTML文件添加Cloudflare Web Analytics代码。

## 🚀 使用方法

### 手动使用（详细输出）
```bash
cd .cloudflare
python3 install_analytics.py
```

### CI/CD部署（简洁输出）
```bash
cd .cloudflare
python3 install_analytics.py --ci
```

## 📊 输出模式对比

**详细模式（默认）：**
```
🚀 开始安装 Cloudflare Web Analytics...
============================================================
📂 脚本位置: /path/to/.cloudflare
📂 扫描目录: /path/to/project
📄 找到 28 个HTML文件
------------------------------------------------------------
⏭️  跳过 ../index.html - 已存在Cloudflare Analytics代码
✅ 已添加到 ../new-page.html
------------------------------------------------------------
📊 安装统计:
   ✅ 成功添加: 1 个文件
   ⏭️  已存在跳过: 27 个文件
   ❌ 处理失败: 0 个文件
------------------------------------------------------------
🎉 Cloudflare Web Analytics 安装完成！
```

**CI/CD模式（--ci）：**
```
🔧 Cloudflare Analytics Auto-Install (CI/CD Mode)
📄 找到 28 个HTML文件
✅ ../new-page.html
📊 结果: ✅1 ⏭️27 ❌0
🎉 Analytics代码安装完成!
```

## 🛠️ Cloudflare Pages 部署配置

在Cloudflare Pages的构建命令中添加：

```bash
cd .cloudflare && python3 install_analytics.py --ci && cd ..
```

## ✨ 功能特点

- ✅ **智能检测** - 自动跳过已包含Analytics代码的文件
- ✅ **安全插入** - 在`</body>`标签前正确插入代码
- ✅ **双模式输出** - 支持详细模式和CI/CD简洁模式
- ✅ **错误处理** - 失败时以非零状态码退出
- ✅ **路径智能** - 从`.cloudflare`目录自动扫描上级目录

## 📝 当前配置

- **Token**: `dcaad93d0ed547e79576def350e16df7`
- **插入位置**: `</body>`标签前
- **支持文件**: `.html`, `.htm`
- **排除文件**: `docs/example.html`（非网页文件）

需要修改token时，直接编辑 `install_analytics.py` 文件中的 `CLOUDFLARE_ANALYTICS_CODE` 变量。 
# Cloudflare 部署时自动安装 Analytics 配置指南

本文档说明如何在各种部署环境中自动运行Cloudflare Analytics安装脚本。

## 🚀 Cloudflare Pages 部署配置

### 在Cloudflare Dashboard中设置

1. 进入您的Cloudflare Pages项目设置
2. 找到 "Build & deployments" 部分
3. 在 "Build command" 中添加：

**Python版本（推荐）:**
```bash
cd .cloudflare && python3 deploy_install_analytics.py && cd ..
```

**Shell版本:**
```bash
cd .cloudflare && ./deploy_install_analytics.sh && cd ..
```

### 环境变量设置
可以通过环境变量自定义token（可选）：
```
CLOUDFLARE_ANALYTICS_TOKEN=dcaad93d0ed547e79576def350e16df7
```

## 📋 package.json 脚本配置

如果您的项目使用Node.js，可以在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "build": "cd .cloudflare && python3 deploy_install_analytics.py && cd ..",
    "deploy": "npm run build",
    "analytics:install": "cd .cloudflare && python3 deploy_install_analytics.py",
    "analytics:check": "cd .cloudflare && python3 install_cloudflare_analytics.py"
  }
}
```

使用方法：
```bash
npm run analytics:install
npm run build
```

## 🔧 GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy with Analytics
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.x'
    
    - name: Install Cloudflare Analytics
      run: |
        cd .cloudflare
        python3 deploy_install_analytics.py
    
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: your-project-name
        directory: ./
```

## 🐳 Docker 配置

如果使用Docker部署，在 `Dockerfile` 中添加：

```dockerfile
FROM node:alpine

# 复制项目文件
COPY . /app
WORKDIR /app

# 安装Python（如果需要）
RUN apk add --no-cache python3

# 安装Analytics代码
RUN cd .cloudflare && python3 deploy_install_analytics.py

# 其他构建步骤...
EXPOSE 80
CMD ["your-start-command"]
```

## 🛠️ Makefile 配置

创建 `Makefile`：

```makefile
.PHONY: install-analytics build deploy

install-analytics:
	cd .cloudflare && python3 deploy_install_analytics.py

build: install-analytics
	# 您的构建命令

deploy: build
	# 您的部署命令
```

使用：
```bash
make install-analytics
make build
make deploy
```

## 📊 脚本输出说明

### 成功输出示例：
```
🔧 Cloudflare Analytics Auto-Install (CI/CD Mode)
📄 找到 28 个HTML文件
✅ ../new-page.html
📊 结果: ✅1 ⏭️27 ❌0
🎉 Analytics代码安装完成!
```

### 输出说明：
- `✅N` - 成功添加Analytics代码的文件数
- `⏭️N` - 已存在代码被跳过的文件数  
- `❌N` - 处理失败的文件数

## ⚡ 性能优化

对于大型项目，可以通过环境变量控制是否运行：

```bash
# 仅在生产环境运行
if [ "$NODE_ENV" = "production" ]; then
  cd .cloudflare && python3 deploy_install_analytics.py
fi
```

## 🔍 故障排除

### 常见问题：

1. **权限错误**: 确保脚本有执行权限
   ```bash
   chmod +x .cloudflare/deploy_install_analytics.sh
   ```

2. **路径错误**: 确保从项目根目录或.cloudflare目录运行

3. **Python版本**: 确保使用Python 3.6+

### 调试模式：
```bash
# 详细输出模式
cd .cloudflare && python3 install_cloudflare_analytics.py
```

## 📝 注意事项

- 脚本会自动跳过已包含Analytics代码的文件
- 仅处理包含 `</body>` 标签的HTML文件
- 出错时脚本会以非零状态码退出，便于CI/CD检测
- 建议在部署前在本地测试脚本 
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cloudflare Web Analytics 统一安装脚本
支持详细模式（手动使用）和简洁模式（CI/CD使用）
"""

import os
import re
import glob
import sys
import argparse

# Cloudflare Web Analytics 代码 - 带错误处理
# 版本: v2.0 - 添加try-catch错误处理，确保兼容微信浏览器
CLOUDFLARE_ANALYTICS_CODE = '''<!-- Cloudflare Web Analytics v2.0 -->
<script>
(function() {
    try {
        // 检查是否支持defer属性和必要的API
        if (typeof document !== 'undefined' && document.createElement) {
            var script = document.createElement('script');
            script.defer = true;
            script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
            script.setAttribute('data-cf-beacon', '{"token": "dcaad93d0ed547e79576def350e16df7"}');
            
            // 添加错误处理
            script.onerror = function() {
                console.debug('Cloudflare Analytics script failed to load');
            };
            
            // 确保在DOM准备好后添加脚本
            if (document.head) {
                document.head.appendChild(script);
            } else {
                // 备用方案：等待DOM加载
                document.addEventListener('DOMContentLoaded', function() {
                    if (document.head) {
                        document.head.appendChild(script);
                    }
                });
            }
        }
    } catch (e) {
        // 静默处理错误，不影响页面正常功能
        console.debug('Cloudflare Analytics initialization failed:', e);
    }
})();
</script>
<!-- End Cloudflare Web Analytics v2.0 -->'''

def find_html_files(root_dir=".."):
    """查找所有HTML文件"""
    html_files = []
    for ext in ["*.html", "*.htm"]:
        html_files.extend(glob.glob(f"{root_dir}/**/{ext}", recursive=True))
    # 排除docs/example.html等非网页文件
    html_files = [f for f in html_files if not f.endswith('/docs/example.html')]
    return html_files

def has_cloudflare_analytics(content):
    """检查是否已经包含Cloudflare Analytics代码"""
    return ("cloudflareinsights.com" in content or 
            "dcaad93d0ed547e79576def350e16df7" in content or
            "data-cf-beacon" in content or
            "Cloudflare Analytics" in content)

def has_latest_version(content):
    """检查是否已经是最新版本 (v2.0)"""
    return "Cloudflare Web Analytics v2.0" in content

def remove_old_analytics_code(content):
    """移除旧版本的Analytics代码"""
    # 移除旧的单行版本
    old_pattern1 = r'<!-- Cloudflare Web Analytics --><script defer src=\'https://static\.cloudflareinsights\.com/beacon\.min\.js\' data-cf-beacon=\'[^\']+\'></script><!-- End Cloudflare Web Analytics -->'
    content = re.sub(old_pattern1, '', content)
    
    # 移除可能的多行版本
    old_pattern2 = r'<!-- Cloudflare Web Analytics -->.*?<!-- End Cloudflare Web Analytics -->'
    content = re.sub(old_pattern2, '', content, flags=re.DOTALL)
    
    return content.strip()

def add_cloudflare_analytics(file_path):
    """为HTML文件添加Cloudflare Analytics代码"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经是最新版本
        if has_latest_version(content):
            return "skip"
        
        # 如果有旧版本，先移除
        if has_cloudflare_analytics(content):
            content = remove_old_analytics_code(content)
            action = "updated"
        else:
            action = "added"
        
        # 查找 </body> 标签
        body_match = re.search(r'</body>', content, re.IGNORECASE)
        
        if body_match:
            # 在 </body> 前插入Cloudflare Analytics代码
            insert_position = body_match.start()
            new_content = (content[:insert_position] + 
                          CLOUDFLARE_ANALYTICS_CODE + '\n' +
                          content[insert_position:])
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return action
        else:
            return "no_body_tag"
            
    except Exception as e:
        return f"error: {str(e)}"

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Cloudflare Web Analytics 安装工具')
    parser.add_argument('--ci', action='store_true', help='CI/CD模式（简洁输出）')
    parser.add_argument('--verbose', '-v', action='store_true', help='详细输出模式')
    args = parser.parse_args()
    
    # 确定输出模式
    ci_mode = args.ci
    verbose = args.verbose or not ci_mode
    
    # 输出标题
    if ci_mode:
        print("🔧 Cloudflare Analytics Auto-Install (CI/CD Mode)")
    else:
        print("🚀 开始安装 Cloudflare Web Analytics...")
        print("=" * 60)
    
    # 检查目录
    if not os.path.exists("install_analytics.py") and not os.path.exists("install_cloudflare_analytics.py"):
        print("❌ 错误：请在 .cloudflare 目录中运行此脚本")
        sys.exit(1)
    
    # 显示目录信息
    if verbose:
        project_root = os.path.abspath("..")
        current_dir = os.getcwd()
        print(f"📂 脚本位置: {current_dir}")
        print(f"📂 扫描目录: {project_root}")
    
    # 查找所有HTML文件
    html_files = find_html_files()
    
    if not html_files:
        print("ℹ️  未找到HTML文件")
        return
    
    print(f"📄 找到 {len(html_files)} 个HTML文件")
    
    if verbose:
        print("-" * 60)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    update_count = 0
    
    # 处理每个HTML文件
    for file_path in html_files:
        result = add_cloudflare_analytics(file_path)
        
        if result == "added":
            success_count += 1
            if verbose:
                print(f"✅ 已添加到 {file_path}")
            elif ci_mode:
                print(f"✅ {file_path}")
        elif result == "updated":
            update_count += 1
            if verbose:
                print(f"🔄 已更新 {file_path} - 升级到v2.0版本")
            elif ci_mode:
                print(f"🔄 {file_path}")
        elif result == "skip":
            skip_count += 1
            if verbose:
                print(f"⏭️  跳过 {file_path} - 已是最新版本")
        elif result == "no_body_tag":
            error_count += 1
            if verbose:
                print(f"⚠️  警告：{file_path} 中未找到 </body> 标签")
            else:
                print(f"⚠️  {file_path} (no </body> tag)")
        else:
            error_count += 1
            if verbose:
                print(f"❌ 处理 {file_path} 时出错: {result}")
            else:
                print(f"❌ {file_path} ({result})")
    
    # 结果统计
    if verbose:
        print("-" * 60)
        print("📊 安装统计:")
        print(f"   ✅ 新添加: {success_count} 个文件")
        print(f"   🔄 已更新: {update_count} 个文件")
        print(f"   ⏭️  已是最新: {skip_count} 个文件") 
        print(f"   ❌ 处理失败: {error_count} 个文件")
        print("-" * 60)
    else:
        print(f"📊 结果: ✅{success_count} 🔄{update_count} ⏭️{skip_count} ❌{error_count}")
    
    # 成功信息
    total_processed = success_count + update_count
    if total_processed > 0:
        if verbose:
            print("🎉 Cloudflare Web Analytics v2.0 安装/更新完成！")
        else:
            print("🎉 Analytics代码已更新到v2.0!")
    elif not verbose:
        # CI模式下简洁提示
        pass
    else:
        print("ℹ️  所有文件都已是最新版本或处理失败")
    
    # 如果有错误，以非零状态码退出
    if error_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main() 
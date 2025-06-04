#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理重复Analytics代码脚本
移除各个HTML页面中的Analytics代码，因为现在统一由footer.html管理
"""

import os
import re
import glob
import sys

def find_html_files(root_dir=".."):
    """查找需要清理的HTML文件"""
    html_files = []
    for ext in ["*.html", "*.htm"]:
        html_files.extend(glob.glob(f"{root_dir}/**/{ext}", recursive=True))
    
    # 排除includes目录（footer.html保留Analytics）和docs/example.html
    html_files = [f for f in html_files if '/includes/' not in f and not f.endswith('/docs/example.html')]
    return html_files

def has_analytics_code(content):
    """检查是否包含Analytics代码"""
    return (
        "cloudflareinsights.com" in content or 
        "dcaad93d0ed547e79576def350e16df7" in content or
        "data-cf-beacon" in content or
        "Cloudflare Analytics" in content or
        "hm.baidu.com" in content or
        "统一Analytics" in content or
        "_hmt" in content
    )

def remove_analytics_code(content):
    """移除Analytics代码"""
    original_content = content
    
    # 移除各种版本的Cloudflare Analytics代码
    patterns_to_remove = [
        # 单行版本
        r'<!-- Cloudflare Web Analytics --><script defer src=\'https://static\.cloudflareinsights\.com/beacon\.min\.js\' data-cf-beacon=\'[^\']+\'></script><!-- End Cloudflare Web Analytics -->',
        
        # 多行版本
        r'<!-- Cloudflare Web Analytics.*?<!-- End Cloudflare Web Analytics.*?-->',
        r'<!-- 统一Analytics.*?<!-- End 统一Analytics.*?-->',
        
        # 百度统计相关
        r'<script>\s*var _hmt = _hmt \|\| \[\];.*?</script>',
        r'<!-- 百度统计.*?</script>',
        r'<!-- 百度自动推送.*?</script>',
        
        # 其他Analytics相关
        r'<script[^>]*data-cf-beacon[^>]*></script>',
        r'<script[^>]*cloudflareinsights\.com[^>]*></script>',
    ]
    
    for pattern in patterns_to_remove:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # 清理多余的空行和空格
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = re.sub(r'</body>\s*\n\s*\n\s*</html>', '</body>\n</html>', content)
    
    return content.strip() + '\n', content != original_content

def cleanup_file(file_path):
    """清理单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not has_analytics_code(content):
            return "no_analytics"
        
        cleaned_content, was_modified = remove_analytics_code(content)
        
        if not was_modified:
            return "no_changes"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        return "cleaned"
        
    except Exception as e:
        return f"error: {str(e)}"

def main():
    """主函数"""
    print("🧹 Analytics代码清理工具")
    print("=" * 50)
    
    # 检查目录
    if not os.path.exists("cleanup_analytics.py"):
        print("❌ 错误：请在 .cloudflare 目录中运行此脚本")
        sys.exit(1)
    
    # 查找HTML文件
    html_files = find_html_files()
    
    if not html_files:
        print("ℹ️  未找到需要处理的HTML文件")
        return
    
    print(f"📄 找到 {len(html_files)} 个HTML文件需要检查")
    print()
    
    # 统计
    cleaned_count = 0
    no_analytics_count = 0
    error_count = 0
    
    # 处理文件
    for file_path in html_files:
        relative_path = os.path.relpath(file_path, "..")
        result = cleanup_file(file_path)
        
        if result == "cleaned":
            print(f"✅ 已清理: {relative_path}")
            cleaned_count += 1
        elif result == "no_analytics":
            print(f"⚪ 无需清理: {relative_path}")
            no_analytics_count += 1
        elif result == "no_changes":
            print(f"⚪ 无变化: {relative_path}")
            no_analytics_count += 1
        elif result.startswith("error"):
            print(f"❌ 错误: {relative_path} - {result}")
            error_count += 1
    
    # 输出结果
    print()
    print("📊 清理结果:")
    print(f"   ✅ 已清理: {cleaned_count} 个文件")
    print(f"   ⚪ 无需清理: {no_analytics_count} 个文件")
    print(f"   ❌ 处理错误: {error_count} 个文件")
    print()
    
    if cleaned_count > 0:
        print("🎉 Analytics代码清理完成！")
        print("💡 现在所有统计代码都由 includes/footer.html 统一管理")
    else:
        print("ℹ️  没有发现需要清理的Analytics代码")

if __name__ == "__main__":
    main() 
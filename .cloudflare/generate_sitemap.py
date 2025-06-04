#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
网站地图(sitemap.xml)自动生成脚本
根据网站文件自动生成SEO友好的sitemap.xml
"""

import os
import re
import glob
import sys
import argparse
from datetime import datetime
from urllib.parse import quote

# 网站配置
WEBSITE_URL = "https://deepractice.ai"
SITEMAP_FILE = "../sitemap.xml"

# 页面优先级和更新频率配置
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
    
    # 默认配置
    "default": {"priority": 0.5, "changefreq": "monthly"}
}

def find_html_files(root_dir=".."):
    """查找所有HTML文件"""
    html_files = []
    for ext in ["*.html", "*.htm"]:
        html_files.extend(glob.glob(f"{root_dir}/**/{ext}", recursive=True))
    
    # 排除不需要的文件
    excluded_patterns = [
        "/docs/",
        "/node_modules/", 
        "/.git/",
        "/temp/",
        "/backup/",
        "example.html",
        "test.html",
        "demo.html"
    ]
    
    filtered_files = []
    for file_path in html_files:
        should_exclude = False
        for pattern in excluded_patterns:
            if pattern in file_path:
                should_exclude = True
                break
        if not should_exclude:
            filtered_files.append(file_path)
    
    return filtered_files

def get_relative_path(file_path):
    """获取相对于网站根目录的路径"""
    # 移除 "../" 前缀
    if file_path.startswith("../"):
        return file_path[3:]
    return file_path

def get_page_config(file_path):
    """根据文件路径获取页面配置"""
    rel_path = get_relative_path(file_path)
    
    # 检查精确匹配
    if rel_path in PAGE_CONFIG:
        return PAGE_CONFIG[rel_path]
    
    # 检查模式匹配
    for pattern, config in PAGE_CONFIG.items():
        if pattern == "default":
            continue
        
        # 将glob模式转换为正则表达式
        if "*" in pattern:
            regex_pattern = pattern.replace("*", "[^/]*").replace("**", ".*")
            if re.match(f"^{regex_pattern}$", rel_path):
                return config
    
    # 返回默认配置
    return PAGE_CONFIG["default"]

def get_last_modified(file_path):
    """获取文件的最后修改时间"""
    try:
        mtime = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def generate_url(file_path):
    """生成完整的URL"""
    rel_path = get_relative_path(file_path)
    
    # 处理index.html - 映射到根路径
    if rel_path == "index.html":
        return f"{WEBSITE_URL}/"
    
    # URL编码，但保留路径分隔符
    url_path = quote(rel_path, safe='/.')
    return f"{WEBSITE_URL}/{url_path}"

def is_valid_html_page(file_path):
    """检查是否是有效的HTML页面"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read(1000)  # 只读取前1000个字符
            
        # 检查是否包含基本的HTML结构
        if not re.search(r'<html[^>]*>', content, re.IGNORECASE):
            return False
        
        # 检查是否包含title标签（SEO重要）
        if not re.search(r'<title[^>]*>.*?</title>', content, re.IGNORECASE | re.DOTALL):
            return False
            
        return True
    except:
        return False

def generate_sitemap(html_files, output_file):
    """生成sitemap.xml文件"""
    
    # 过滤出有效的HTML页面
    valid_pages = []
    for file_path in html_files:
        if is_valid_html_page(file_path):
            valid_pages.append(file_path)
    
    # 按优先级排序
    valid_pages.sort(key=lambda x: get_page_config(x)["priority"], reverse=True)
    
    # 生成XML内容
    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    xml_content.append('        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"')
    xml_content.append('        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9')
    xml_content.append('        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">')
    
    for file_path in valid_pages:
        config = get_page_config(file_path)
        url = generate_url(file_path)
        lastmod = get_last_modified(file_path)
        
        xml_content.append('    <url>')
        xml_content.append(f'        <loc>{url}</loc>')
        xml_content.append(f'        <lastmod>{lastmod}</lastmod>')
        xml_content.append(f'        <changefreq>{config["changefreq"]}</changefreq>')
        xml_content.append(f'        <priority>{config["priority"]}</priority>')
        xml_content.append('    </url>')
    
    xml_content.append('</urlset>')
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml_content))
    
    return len(valid_pages)

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='网站地图生成工具')
    parser.add_argument('--output', '-o', default=SITEMAP_FILE, help='输出文件路径')
    parser.add_argument('--verbose', '-v', action='store_true', help='详细输出')
    parser.add_argument('--check', action='store_true', help='检查模式（不生成文件）')
    args = parser.parse_args()
    
    # 检查是否在正确的目录
    if not os.path.exists("generate_sitemap.py"):
        print("❌ 错误：请在 .cloudflare 目录中运行此脚本")
        sys.exit(1)
    
    print("🗺️  网站地图生成器")
    print("=" * 50)
    
    # 查找HTML文件
    html_files = find_html_files()
    
    if not html_files:
        print("❌ 未找到HTML文件")
        sys.exit(1)
    
    print(f"📄 找到 {len(html_files)} 个HTML文件")
    
    if args.verbose:
        print("\n📋 页面配置:")
        for file_path in html_files:
            if is_valid_html_page(file_path):
                config = get_page_config(file_path)
                rel_path = get_relative_path(file_path)
                url = generate_url(file_path)
                print(f"  ✅ {rel_path}")
                print(f"     URL: {url}")
                print(f"     优先级: {config['priority']}, 更新频率: {config['changefreq']}")
            else:
                print(f"  ⏭️  跳过: {get_relative_path(file_path)} (无效HTML)")
    
    if args.check:
        print("\n✅ 检查完成（未生成文件）")
        return
    
    # 生成sitemap
    try:
        page_count = generate_sitemap(html_files, args.output)
        print(f"\n✅ 成功生成 {args.output}")
        print(f"📊 包含 {page_count} 个有效页面")
        print(f"🌐 网站URL: {WEBSITE_URL}")
        print(f"📅 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 提示下一步
        print("\n💡 下一步:")
        print("   1. 检查生成的sitemap.xml文件")
        print("   2. 提交到Google Search Console")
        print("   3. 提交到百度站长平台")
        print("   4. 可以添加到robots.txt中: Sitemap: https://deepractice.ai/sitemap.xml")
        
    except Exception as e:
        print(f"❌ 生成失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
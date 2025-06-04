#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
部署时自动生成sitemap.xml的简化脚本
适用于CI/CD环境
"""

import os
import sys
import subprocess

def main():
    """主函数"""
    print("🗺️  Sitemap Auto-Generator (CI/CD Mode)")
    
    # 检查是否在正确的目录
    if not os.path.exists("generate_sitemap.py"):
        print("❌ 错误：请在 .cloudflare 目录中运行此脚本")
        sys.exit(1)
    
    try:
        # 调用主生成脚本
        result = subprocess.run([
            "python3", "generate_sitemap.py"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            # 解析输出，提取关键信息
            lines = result.stdout.split('\n')
            for line in lines:
                if "包含" in line and "个有效页面" in line:
                    print(f"📊 {line.strip()}")
                elif "成功生成" in line:
                    print(f"✅ {line.strip()}")
            
            print("🎉 Sitemap生成完成!")
            
        else:
            print(f"❌ 生成失败: {result.stderr}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ 执行失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
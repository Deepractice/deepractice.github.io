#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DeepracticeX CI/CD 统一部署脚本
集成Analytics安装和Sitemap生成，提供一键式部署解决方案
"""

import os
import sys
import time
import argparse
import subprocess
from datetime import datetime

def print_banner():
    """打印横幅"""
    print("🚀" + "=" * 50 + "🚀")
    print("    DeepracticeX CI/CD 自动化部署系统")
    print("🚀" + "=" * 50 + "🚀")
    print()

def print_step(step_num, total_steps, description):
    """打印步骤信息"""
    print(f"📋 步骤 {step_num}/{total_steps}: {description}")
    print("-" * 40)

def run_command(cmd, description):
    """运行命令并显示进度"""
    print(f"🔄 正在执行: {description}")
    
    try:
        start_time = time.time()
        result = subprocess.run(cmd, capture_output=True, text=True)
        end_time = time.time()
        
        if result.returncode == 0:
            # 解析输出中的关键信息
            output_lines = result.stdout.split('\n')
            key_info = []
            
            for line in output_lines:
                if any(keyword in line for keyword in ['包含', '成功', '完成', '✅', '📊']):
                    if line.strip():
                        key_info.append(line.strip())
            
            if key_info:
                for info in key_info[-3:]:  # 显示最后3条关键信息
                    print(f"  {info}")
            
            print(f"✅ {description} 完成 ({end_time - start_time:.1f}s)")
            return True
            
        else:
            print(f"❌ {description} 失败")
            if result.stderr:
                print(f"错误信息: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"❌ {description} 执行异常: {str(e)}")
        return False

# cleanup_analytics 已移除 - 只需执行一次即可

def generate_sitemap():
    """生成Sitemap"""
    return run_command(
        ["python3", "deploy_generate_sitemap.py"], 
        "生成SEO网站地图"
    )

def check_environment():
    """检查运行环境"""
    print("🔍 环境检查")
    print("-" * 40)
    
    # 检查是否在正确目录
    if not os.path.exists("ci.py"):
        print("❌ 错误：请在 .cloudflare 目录中运行此脚本")
        return False
    
    # 检查必要脚本是否存在
    required_scripts = [
        "deploy_generate_sitemap.py"
    ]
    
    missing_scripts = []
    for script in required_scripts:
        if not os.path.exists(script):
            missing_scripts.append(script)
    
    if missing_scripts:
        print(f"❌ 缺少必要脚本: {', '.join(missing_scripts)}")
        return False
    
    print("✅ 环境检查通过")
    print("✅ 必要脚本齐全")
    print()
    return True

def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='DeepracticeX CI/CD 自动化部署脚本',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python3 ci.py                    # 生成Sitemap
  python3 ci.py --sitemap-only     # 仅生成Sitemap（等同于默认）
  python3 ci.py --check            # 仅环境检查
        """
    )
    
    parser.add_argument('--sitemap-only', action='store_true', 
                       help='仅生成Sitemap')
    parser.add_argument('--check', action='store_true', 
                       help='仅进行环境检查')
    parser.add_argument('--quiet', '-q', action='store_true', 
                       help='静默模式（减少输出）')
    
    args = parser.parse_args()
    
    # 静默模式处理
    if not args.quiet:
        print_banner()
    
    # 环境检查
    if not check_environment():
        sys.exit(1)
    
    if args.check:
        print("🎉 环境检查完成，一切正常！")
        return
    
    # 确定执行任务
    tasks = []
    if args.sitemap_only:
        tasks = [("sitemap", "Sitemap生成")]
    else:
        tasks = [
            ("sitemap", "Sitemap生成")
        ]
    
    total_steps = len(tasks)
    success_count = 0
    start_time = time.time()
    
    print(f"🎯 执行计划: {len(tasks)} 个任务")
    print()
    
    # 执行任务
    for i, (task_type, task_name) in enumerate(tasks, 1):
        if not args.quiet:
            print_step(i, total_steps, task_name)
        
        success = False
        if task_type == "sitemap":
            success = generate_sitemap()
        
        if success:
            success_count += 1
        
        if not args.quiet:
            print()
    
    # 执行结果统计
    end_time = time.time()
    total_time = end_time - start_time
    
    print("📊 执行结果统计")
    print("=" * 50)
    print(f"✅ 成功任务: {success_count}/{total_steps}")
    print(f"❌ 失败任务: {total_steps - success_count}/{total_steps}")
    print(f"⏱️  总用时: {total_time:.1f} 秒")
    print(f"📅 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if success_count == total_steps:
        print()
        print("🎉 部署完成！所有任务执行成功")
        if not args.quiet:
            print()
            print("🌟 后续建议:")
            print("   1. 验证sitemap.xml文件是否生成")
            print("   2. 检查sitemap内容是否正确")
            print("   3. 提交sitemap到搜索引擎")
    else:
        print()
        print("⚠️  部分任务执行失败，请检查错误信息")
        sys.exit(1)

if __name__ == "__main__":
    main() 
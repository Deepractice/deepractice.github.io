// 动态加载header的函数
async function loadHeader() {
    try {
        // 获取当前页面文件名
        const currentPage = getCurrentPageName();
        
        // 获取正确的路径前缀
        const pathPrefix = getPathPrefix();
        
        // 加载header HTML，添加错误处理
        const response = await fetch(`${pathPrefix}includes/header.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const headerHTML = await response.text();
        
        // 插入header到页面
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            
            // 如果在子目录中，修正导航链接的路径
            if (pathPrefix) {
                fixNavigationLinks(pathPrefix);
            }
            
            // 设置当前页面的active状态
            setActiveNavItem(currentPage);
            
            // 初始化移动端菜单
            initMobileMenu();
        }
    } catch (error) {
        console.warn('Header加载失败，可能是文件协议访问限制:', error.message);
        // 在本地开发环境中，如果fetch失败，提供一个基本的导航
        createFallbackHeader();
    }
}

// 备用header创建函数
function createFallbackHeader() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <header>
                <nav>
                    <div class="logo">
                        <h1>深度实践</h1>
                    </div>
                    <ul class="nav-links">
                        <li><a href="index.html" data-page="home">首页</a></li>
                        <li><a href="blog.html" data-page="blog">博客</a></li>
                        <li><a href="prompts.html" data-page="prompts">提示词库</a></li>
                    </ul>
                    <div class="burger">
                        <div class="line1"></div>
                        <div class="line2"></div>
                        <div class="line3"></div>
                    </div>
                </nav>
            </header>
        `;
        
        // 初始化基本的移动端菜单
        initMobileMenu();
    }
}

// 修正导航链接路径
function fixNavigationLinks(pathPrefix) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 跳过锚点链接和下拉菜单切换器
        if (!href || href.startsWith('#') || href === '#') {
            return;
        }
        
        // 跳过已经是绝对路径或外部链接的情况
        if (href.startsWith('http') || href.startsWith('/') || href.startsWith('../')) {
            return;
        }
        
        // 为相对路径添加前缀
        link.setAttribute('href', pathPrefix + href);
    });
}

// 动态加载footer的函数
async function loadFooter() {
    try {
        // 获取正确的路径前缀
        const pathPrefix = getPathPrefix();
        
        // 加载footer HTML，添加错误处理
        const response = await fetch(`${pathPrefix}includes/footer.html`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const footerHTML = await response.text();
        
        // 插入footer到页面
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
            
            // 安全地执行footer中的脚本
            const footerScripts = footerContainer.querySelectorAll('script');
            footerScripts.forEach(script => {
                try {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                        newScript.onerror = () => console.warn('Script loading failed:', script.src);
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.head.appendChild(newScript);
                } catch (e) {
                    console.warn('Script execution failed:', e);
                }
            });
        }
    } catch (error) {
        console.warn('Footer加载失败，可能是文件协议访问限制:', error.message);
        // 创建基本的footer
        createFallbackFooter();
    }
}

// 备用footer创建函数
function createFallbackFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer>
                <div class="container">
                    <div class="copyright">
                        <div class="copyright-line">
                            <p>&copy; 2025 <span class="company-name">长沙深度实践人工智能科技有限公司</span> · 版权所有</p>
                        </div>
                        <div class="visit-counter">
                            <img src="https://komarev.com/ghpvc/?username=deepractice-website&label=Website%20visit&color=0e75b6&style=flat-square" alt="Website visit counter" style="vertical-align: middle;">
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

// 徽章统计系统已简化为静态HTML实现，不需要动态加载JS

// 获取路径前缀（根据当前页面位置判断）
function getPathPrefix() {
    const path = window.location.pathname;
    
    // 如果在子目录中（如 people/），需要添加 ../
    if (path.includes('/people/') || path.includes('/blog/') || path.includes('/docs/')) {
        return '../';
    }
    
    // 如果在根目录，直接使用相对路径
    return '';
}

// 获取当前页面名称
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    switch(filename) {
        case 'index.html':
        case '':
            return 'home';
        case 'blog.html':
            return 'blog';
        case 'prompts.html':
            return 'prompts';
        default:
            return 'home';
    }
}

// 设置导航栏活跃状态
function setActiveNavItem(currentPage) {
    // 移除所有active类
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // 为当前页面添加active类
    const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// 初始化移动端菜单
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burger && navLinks) {
        // 汉堡菜单点击事件
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
        
        // 点击菜单链接后关闭移动端菜单（除了下拉菜单切换器）
        const menuLinks = navLinks.querySelectorAll('a:not(.dropdown-toggle)');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // 检查是否在移动端（通过检查burger是否可见）
                const burgerVisible = window.getComputedStyle(burger).display !== 'none';
                if (burgerVisible) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            });
        });
        
        // 点击背景关闭菜单
        document.addEventListener('click', (e) => {
            const burgerVisible = window.getComputedStyle(burger).display !== 'none';
            if (burgerVisible && 
                navLinks.classList.contains('nav-active') && 
                !navLinks.contains(e.target) && 
                !burger.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    }
    
    // 初始化下拉菜单
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.closest('.dropdown');
            
            // 在移动端，关闭其他打开的下拉菜单
            const burger = document.querySelector('.burger');
            const burgerVisible = window.getComputedStyle(burger).display !== 'none';
            if (burgerVisible) {
                const otherDropdowns = document.querySelectorAll('.dropdown.active');
                otherDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
            
            dropdown.classList.toggle('active');
        });
    });
}

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
}); 
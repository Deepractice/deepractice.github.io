// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 初始化AOS动画库
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: false,
                mirror: true
            });
        } else {
            console.warn('AOS库未加载');
        }
        
        // 初始化粒子效果
        if (typeof particlesJS !== 'undefined') {
            initParticles();
        } else {
            console.warn('Particles.js库未加载');
        }
        
        // 初始化倾斜效果
        if (typeof VanillaTilt !== 'undefined') {
            initTilt();
        } else {
            console.warn('VanillaTilt库未加载');
        }
        
        // 初始化导航菜单
        initNavigation();
        
        // 初始化3D视差效果
        initParallax();
        
        // 初始化动态连接线
        initConnectionLines();
        
        // 窗口滚动事件
        initScrollEffects();
        
        // 表单提交事件
        initFormSubmit();
        
        // 评估中心相关交互
        initEvaluationInteractions();
        
        // 移动端导航栏下拉菜单
        initMobileDropdown();
        
    } catch (error) {
        console.warn('页面初始化过程中出现错误:', error);
    }
});

// 粒子背景初始化
function initParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4dabf7"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 0.5,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4dabf7",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.6
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

// 初始化倾斜效果
function initTilt() {
    const tiltElements = document.querySelectorAll('.tilt-element');
    
    VanillaTilt.init(tiltElements, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05
    });
}

// 导航菜单初始化
function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');
    
    // 打开导航菜单的函数
    function openNav() {
        nav.classList.add('nav-active');
        burger.classList.add('toggle');
        
        // 链接动画
        navLinks.forEach((link, index) => {
            link.style.animation = `fadeIn 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
    }
    
    // 关闭导航菜单的函数
    function closeNavMenu() {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
        
        // 清除动画
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    }
    
    // 汉堡菜单点击事件
    if (burger && nav) {
        burger.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                closeNavMenu();
            } else {
                openNav();
            }
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 关闭移动端导航菜单
            if (nav.classList.contains('nav-active')) {
                closeNavMenu();
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化3D视差效果
function initParallax() {
    document.addEventListener('mousemove', parallaxEffect);
    
    function parallaxEffect(e) {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach(layer => {
            const depth = layer.getAttribute('data-depth');
            const moveX = (e.clientX * depth / 10);
            const moveY = (e.clientY * depth / 10);
            
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    }
}

// 初始化动态连接线
function initConnectionLines() {
    const canvas = document.getElementById('connectionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸为父容器尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    // 初始调整尺寸
    resizeCanvas();
    
    // 窗口大小变化时调整canvas尺寸
    window.addEventListener('resize', resizeCanvas);
    
    // 创建粒子数组
    const particlesArray = [];
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(77, 171, 247, ${Math.random() * 0.5 + 0.1})`;
        }
        
        // 更新粒子位置
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界检查
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        // 绘制粒子
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // 初始化粒子
    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // 连接粒子
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(77, 171, 247, ${0.2 - (distance / 750)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
}

// 初始化滚动效果
function initScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 导航栏效果
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// 表单提交初始化
function initFormSubmit() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 模拟提交成功效果
            const button = this.querySelector('button');
            const originalText = button.innerText;
            
            button.disabled = true;
            button.innerText = '提交中...';
            
            setTimeout(() => {
                button.innerText = '提交成功!';
                button.classList.add('success');
                
                // 重置表单
                this.reset();
                
                // 恢复按钮状态
                setTimeout(() => {
                    button.innerText = originalText;
                    button.disabled = false;
                    button.classList.remove('success');
                }, 2000);
            }, 1500);
        });
    }
}

// 动态添加的3D卡片动效
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.feature-card, .value-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            
            const perspective = 300;
            const rotateX = percentY * 5; // 旋转程度
            const rotateY = -percentX * 5; // 旋转程度
            
            card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // 添加发光效果
            const glow = card.querySelector('.card-glow') || card.querySelector('.card-blob');
            if (glow) {
                // 根据鼠标位置改变背景渐变位置
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(77, 171, 247, 0.15) 0%, rgba(77, 171, 247, 0) 70%)`;
                glow.style.opacity = '1';
            }
        } else {
            card.style.transform = '';
            
            // 恢复原来的效果
            const glow = card.querySelector('.card-glow') || card.querySelector('.card-blob');
            if (glow) {
                glow.style.opacity = '0';
            }
        }
    });
});

// 动态添加的技术图标悬浮效果
const techIcons = document.querySelectorAll('.tech-icon');
techIcons.forEach(icon => {
    icon.addEventListener('mouseover', function() {
        this.style.transform = 'rotateX(0) rotateY(0) translateZ(50px)';
    });
    
    icon.addEventListener('mouseout', function() {
        const rotateX = this.style.getPropertyValue('--rotate-x');
        const rotateY = this.style.getPropertyValue('--rotate-y');
        const translateZ = this.style.getPropertyValue('--translate-z');
        
        this.style.transform = `rotateX(${rotateX}) rotateY(${rotateY}) translateZ(${translateZ})`;
    });
});

// 评估中心相关交互
function initEvaluationInteractions() {
    // 标签切换
    const tabs = document.querySelectorAll('.evaluation-tabs .tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // 测试用例悬停效果
    const testCases = document.querySelectorAll('.test-case');
    if (testCases.length > 0) {
        testCases.forEach(testCase => {
            testCase.addEventListener('mouseenter', function() {
                this.style.borderColor = 'rgba(77, 171, 247, 0.5)';
            });
            
            testCase.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(77, 171, 247, 0.1)';
            });
        });
    }
    
    // 圆形进度条动画
    const circle = document.querySelector('.circular-chart .circle');
    if (circle) {
        setTimeout(() => {
            const value = circle.getAttribute('stroke-dasharray').split(',')[0];
            circle.style.strokeDasharray = '0, 100';
            setTimeout(() => {
                circle.style.transition = 'stroke-dasharray 1.5s ease-out';
                circle.style.strokeDasharray = `${value}, 100`;
            }, 100);
        }, 500);
    }
    
    // 指标条动画
    const metricBars = document.querySelectorAll('.metric-bar');
    if (metricBars.length > 0) {
        metricBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = width;
            }, 100);
        });
    }
}

// 移动端导航栏下拉菜单
function initMobileDropdown() {
    // 获取所有下拉菜单的切换按钮
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // 为每个下拉菜单添加点击事件处理
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // 在移动设备视图下处理下拉菜单
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // 获取当前下拉菜单的父元素
                const dropdown = this.parentElement;
                
                // 切换当前下拉菜单的active状态
                dropdown.classList.toggle('active');
                
                // 关闭其他打开的下拉菜单
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.parentElement.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // 监听窗口大小变化，重置下拉菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
} 
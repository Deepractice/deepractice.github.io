class StarUniverse {
    constructor() {
        this.canvas = document.getElementById('constellation-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.starSystems = document.querySelectorAll('.star-system');
        this.infoPanel = document.getElementById('info-panel');
        this.animationPaused = false;
        this.stars = [];
        this.shootingStars = [];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createBackgroundStars();
        this.setupEventListeners();
        this.drawConstellationLines();
        this.animate();
        this.createShootingStars();
        this.addCosmicDust();
        this.addNebulaEffects();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createBackgroundStars() {
        const starfield = document.getElementById('starfield');
        
        // 创建额外的动态星星
        for (let i = 0; i < 200; i++) {
            const star = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            };
            this.stars.push(star);
        }
    }

    setupEventListeners() {
        // 星系点击事件
        this.starSystems.forEach(system => {
            system.addEventListener('click', (e) => {
                this.showStarInfo(e.target.closest('.star-system'));
                this.createClickEffect(e);
            });
        });

        // 控制按钮事件
        document.getElementById('toggle-animation').addEventListener('click', () => {
            this.toggleAnimation();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('close-panel').addEventListener('click', () => {
            this.infoPanel.classList.remove('active');
        });

        // 鼠标移动视差效果
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }

    showStarInfo(system) {
        const info = this.getStarInfo(system.dataset.info);
        
        document.getElementById('panel-title').textContent = info.title;
        document.getElementById('panel-content').innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.description}</p>
            <div class="links">
                ${info.links.map(link => 
                    `<a href="${link.url}" class="link-btn" target="_blank">
                        <i class="${link.icon}"></i> ${link.text}
                    </a>`
                ).join('')}
            </div>
        `;
        
        this.infoPanel.classList.add('active');
    }

    getStarInfo(type) {
        const starData = {
            blog: {
                title: '技术博客',
                description: '分享最新的AI技术洞察、深度学习研究和实践经验。探索人工智能的前沿发展，解读技术趋势。',
                links: [
                    { url: '/blog.html', text: '查看博客', icon: 'fas fa-blog' },
                    { url: '#', text: 'RSS订阅', icon: 'fas fa-rss' }
                ]
            },
            project: {
                title: '开源项目',
                description: '我们的开源项目涵盖AI协作工具、智能代理框架和深度学习应用。致力于推动开源社区发展。',
                links: [
                    { url: 'https://github.com/Deepractice', text: 'GitHub', icon: 'fab fa-github' },
                    { url: '#', text: '项目文档', icon: 'fas fa-book' },
                    { url: '#', text: '贡献指南', icon: 'fas fa-hands-helping' }
                ]
            },
            video: {
                title: '技术视频',
                description: '深入浅出的技术教程、产品演示和案例分析。通过视频更直观地展示AI技术的应用。',
                links: [
                    { url: '#', text: 'B站频道', icon: 'fab fa-bilibili' },
                    { url: '#', text: 'YouTube', icon: 'fab fa-youtube' },
                    { url: '#', text: '教程列表', icon: 'fas fa-list' }
                ]
            },
            team: {
                title: '团队成员',
                description: '认识我们充满激情的AI专家团队。每个成员都在推动人工智能协作领域的创新发展。',
                links: [
                    { url: '/people/', text: '团队介绍', icon: 'fas fa-users' },
                    { url: '#', text: '加入我们', icon: 'fas fa-user-plus' },
                    { url: '#', text: '团队博客', icon: 'fas fa-blog' }
                ]
            },
            social: {
                title: '社交媒体',
                description: '关注我们的社交媒体账号，获取最新动态、技术分享和行业资讯。与我们互动交流。',
                links: [
                    { url: '#', text: '微信公众号', icon: 'fab fa-weixin' },
                    { url: '#', text: '知乎', icon: 'fab fa-zhihu' },
                    { url: '#', text: 'Twitter', icon: 'fab fa-twitter' }
                ]
            },
            ai: {
                title: 'AI产品',
                description: '探索我们的AI智能协作产品。从智能代理到深度学习平台，助力您的创意实现。',
                links: [
                    { url: '#platform', text: '产品介绍', icon: 'fas fa-rocket' },
                    { url: '#', text: '免费试用', icon: 'fas fa-play' },
                    { url: '#', text: 'API文档', icon: 'fas fa-code' }
                ]
            },
            docs: {
                title: '技术文档',
                description: '完整的技术文档和开发指南。帮助开发者快速上手我们的AI协作平台和工具。',
                links: [
                    { url: '/docs/', text: '开发文档', icon: 'fas fa-book' },
                    { url: '#', text: 'API参考', icon: 'fas fa-code' },
                    { url: '#', text: '示例代码', icon: 'fas fa-laptop-code' }
                ]
            },
            github: {
                title: 'GitHub开源',
                description: '我们在GitHub上开源了多个AI协作相关的项目。欢迎star、fork和贡献代码。',
                links: [
                    { url: 'https://github.com/Deepractice', text: '组织主页', icon: 'fab fa-github' },
                    { url: '#', text: '热门项目', icon: 'fas fa-star' },
                    { url: '#', text: '贡献统计', icon: 'fas fa-chart-bar' }
                ]
            }
        };
        
        return starData[type] || starData.blog;
    }

    drawConstellationLines() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 获取星系位置
        const positions = Array.from(this.starSystems).map(system => {
            const rect = system.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

        // 绘制连接线（构成星座）
        this.ctx.beginPath();
        positions.forEach((pos, index) => {
            if (index === 0) {
                this.ctx.moveTo(pos.x, pos.y);
            } else {
                // 只连接相邻的星星，形成自然的星座图案
                if (index % 3 === 0 || Math.random() > 0.5) {
                    this.ctx.lineTo(pos.x, pos.y);
                }
            }
        });
        this.ctx.stroke();
    }

    createClickEffect(event) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid rgba(77, 171, 247, 0.8)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        ripple.style.left = event.clientX - 10 + 'px';
        ripple.style.top = event.clientY - 10 + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        
        document.body.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            document.body.removeChild(ripple);
        };
    }

    createShootingStars() {
        setInterval(() => {
            if (Math.random() < 0.1 && !this.animationPaused) { // 10% 概率
                this.createShootingStar();
            }
        }, 1000);
    }

    createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = Math.random() * 50 + '%';
        
        document.body.appendChild(shootingStar);
        
        setTimeout(() => {
            if (document.body.contains(shootingStar)) {
                document.body.removeChild(shootingStar);
            }
        }, 3000);
    }

    addCosmicDust() {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust';
        document.body.appendChild(dust);
    }

    addNebulaEffects() {
        for (let i = 0; i < 3; i++) {
            const nebula = document.createElement('div');
            nebula.className = 'nebula-effect';
            nebula.style.left = Math.random() * window.innerWidth + 'px';
            nebula.style.top = Math.random() * window.innerHeight + 'px';
            nebula.style.animationDelay = Math.random() * 20 + 's';
            document.body.appendChild(nebula);
        }
    }

    handleMouseMove(event) {
        const mouseX = event.clientX / window.innerWidth;
        const mouseY = event.clientY / window.innerHeight;
        
        // 视差效果
        this.starSystems.forEach((system, index) => {
            const intensity = (index + 1) * 0.5;
            const translateX = (mouseX - 0.5) * intensity;
            const translateY = (mouseY - 0.5) * intensity;
            
            system.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }

    animate() {
        if (!this.animationPaused) {
            // 更新背景星星闪烁
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
                
                this.ctx.save();
                this.ctx.globalAlpha = star.opacity * twinkle;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
            
            // 重新绘制星座连线
            this.drawConstellationLines();
        }
        
        requestAnimationFrame(() => this.animate());
    }

    toggleAnimation() {
        this.animationPaused = !this.animationPaused;
        const icon = document.getElementById('animation-icon');
        icon.className = this.animationPaused ? 'fas fa-play' : 'fas fa-pause';
        
        // 切换所有CSS动画
        document.body.style.animationPlayState = this.animationPaused ? 'paused' : 'running';
        this.starSystems.forEach(system => {
            system.style.animationPlayState = this.animationPaused ? 'paused' : 'running';
            const orbit = system.querySelector('.orbit');
            const satellites = system.querySelectorAll('.satellite');
            if (orbit) orbit.style.animationPlayState = this.animationPaused ? 'paused' : 'running';
            satellites.forEach(sat => {
                sat.style.animationPlayState = this.animationPaused ? 'paused' : 'running';
            });
        });
    }

    resetView() {
        // 重置视差效果
        this.starSystems.forEach(system => {
            system.style.transform = 'translate(0, 0)';
        });
        
        // 关闭信息面板
        this.infoPanel.classList.remove('active');
        
        // 添加重置动画效果
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('无法进入全屏模式:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new StarUniverse();
});

// 添加键盘快捷键
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'Escape':
            document.getElementById('info-panel').classList.remove('active');
            break;
        case ' ':
            event.preventDefault();
            document.getElementById('toggle-animation').click();
            break;
        case 'r':
        case 'R':
            document.getElementById('reset-view').click();
            break;
        case 'f':
        case 'F':
            document.getElementById('fullscreen').click();
            break;
    }
});

// 添加额外的视觉效果
function addGalaxySpiral() {
    const spiral = document.createElement('div');
    spiral.style.position = 'absolute';
    spiral.style.width = '100vw';
    spiral.style.height = '100vh';
    spiral.style.background = `
        conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(77, 171, 247, 0.05) 60deg, 
            transparent 120deg,
            rgba(100, 255, 218, 0.03) 180deg,
            transparent 240deg,
            rgba(255, 107, 107, 0.03) 300deg,
            transparent 360deg)
    `;
    spiral.style.animation = 'rotate 60s linear infinite';
    spiral.style.pointerEvents = 'none';
    spiral.style.zIndex = '0';
    document.body.appendChild(spiral);
}

// 初始化银河螺旋效果
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addGalaxySpiral, 1000);
}); 
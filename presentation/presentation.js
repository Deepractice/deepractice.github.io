// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子效果
    initParticles();
    
    // 初始化幻灯片控制
    initSlideControls();
    
    // 初始化导航栏交互
    initNavigation();
    
    // 初始化交互式问答卡片
    initInteractiveCards();
    
    // 添加观察结果点击展示功能
    const observationTrigger = document.querySelector('.observation-trigger');
    const observationPopup = document.getElementById('observation-popup');
    const popupClose = document.querySelector('.observation-popup .popup-close');
    
    if (observationTrigger && observationPopup) {
        observationTrigger.addEventListener('click', function() {
            observationPopup.classList.add('active');
        });
        
        popupClose.addEventListener('click', function() {
            observationPopup.classList.remove('active');
        });
        
        // 点击弹出框外部关闭
        observationPopup.addEventListener('click', function(e) {
            if (e.target === observationPopup) {
                observationPopup.classList.remove('active');
            }
        });
        
        // ESC键关闭弹出框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && observationPopup.classList.contains('active')) {
                observationPopup.classList.remove('active');
            }
        });
    }
    
    // 获取现有元素
    const slides = document.querySelectorAll('.slide');
    const slideCounter = document.getElementById('slide-counter');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const fullscreenBtn = document.getElementById('fullscreen');
    const jumpInput = document.getElementById('jump-input');
    const jumpBtn = document.getElementById('jump-btn');
    const presentationContainer = document.querySelector('.presentation-container');
    
    // 代码弹窗元素
    const viewCodeBtn = document.getElementById('viewCodeBtn');
    const codeModal = document.getElementById('codeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (viewCodeBtn && codeModal && closeModalBtn) {
        // 打开弹窗
        viewCodeBtn.addEventListener('click', function() {
            codeModal.classList.add('active');
            // 防止幻灯片翻页事件影响弹窗
            event.stopPropagation();
        });
        
        // 关闭弹窗
        closeModalBtn.addEventListener('click', function() {
            codeModal.classList.remove('active');
        });
        
        // 点击弹窗外部关闭
        codeModal.addEventListener('click', function(event) {
            if (event.target === codeModal) {
                codeModal.classList.remove('active');
            }
        });
        
        // 阻止幻灯片内代码区域的点击事件冒泡，避免影响幻灯片导航
        const codeModalContent = codeModal.querySelector('.code-modal-content');
        if (codeModalContent) {
            codeModalContent.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    }
    
    // 以下是现有的幻灯片控制代码
    let currentSlide = 0;
    
    // 可见幻灯片类控制
    function showSlide(index) {
        // 移除所有幻灯片的active类
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // 添加active类到当前幻灯片
        slides[index].classList.add('active');
        
        // 更新计数器
        slideCounter.textContent = `${index + 1} / ${slides.length}`;
        
        // 更新当前索引
        currentSlide = index;
    }
    
    // 显示下一张幻灯片
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
    
    // 显示上一张幻灯片
    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
    
    // 全屏控制
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            presentationContainer.requestFullscreen().catch(err => {
                console.error(`全屏出错: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // 跳转到指定幻灯片
    function jumpToSlide() {
        const slideNumber = parseInt(jumpInput.value);
        if (slideNumber && slideNumber > 0 && slideNumber <= slides.length) {
            showSlide(slideNumber - 1);
            jumpInput.value = "";
        }
    }
    
    // 事件监听器
    prevSlideBtn.addEventListener('click', prevSlide);
    nextSlideBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    jumpBtn.addEventListener('click', jumpToSlide);
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        // 如果弹窗打开，不处理键盘事件
        if (codeModal && codeModal.classList.contains('active')) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
            case 'Enter':
                if (document.activeElement === jumpInput) {
                    jumpToSlide();
                }
                break;
        }
    });
    
    // 跳转输入回车支持
    jumpInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            jumpToSlide();
        }
    });
    
    // 初始化第一张幻灯片
    showSlide(0);
});

// 初始化粒子背景
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
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
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
                "opacity": 0.4,
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
                        "opacity": 1
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

// 添加确认弹窗HTML到页面
function addConfirmationModal() {
    // 检查是否已经存在确认弹窗
    if (document.getElementById('confirmation-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-header">
                <h3>思考一下</h3>
            </div>
            <div class="confirmation-body">
                <p>模式如何连接抽象与具象？</p>
            </div>
            <div class="confirmation-footer">
                <button id="confirm-next-slide">确定</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加确认按钮事件
    document.getElementById('confirm-next-slide').addEventListener('click', function() {
        document.getElementById('confirmation-modal').classList.remove('active');
        // 确认后真正切换到下一张幻灯片
        changeSlide(1);
    });
}

// 初始化幻灯片控制
function initSlideControls() {
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const fullscreenButton = document.getElementById('fullscreen');
    const slideCounter = document.getElementById('slide-counter');
    const jumpInput = document.getElementById('jump-input');
    const jumpButton = document.getElementById('jump-btn');
    const slides = document.querySelectorAll('.slide');
    
    // 全局变量，使其在其他函数中可访问
    window.fullscreenButton = fullscreenButton;
    
    // 添加确认弹窗
    addConfirmationModal();
    
    // 更新幻灯片计数器
    function updateSlideCounter() {
        const currentSlide = document.querySelector('.slide.active');
        const currentIndex = Array.from(slides).indexOf(currentSlide) + 1;
        slideCounter.textContent = `${currentIndex} / ${slides.length}`;
    }
    
    // 切换幻灯片的函数
    window.changeSlide = function(direction) {
        const currentSlide = document.querySelector('.slide.active');
        const currentIndex = Array.from(slides).indexOf(currentSlide);
        let nextIndex = currentIndex + direction;
        
        // 确保索引在有效范围内
        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= slides.length) nextIndex = slides.length - 1;
        
        // 如果没有变化，就返回
        if (nextIndex === currentIndex) return;
        
        // 应用转场效果
        currentSlide.classList.remove('active');
        slides[nextIndex].classList.add('active');
        
        // 更新计数器
        updateSlideCounter();
    };
    
    // 跳转到指定页面
    window.jumpToSlide = function(slideNumber) {
        // 确保输入的值在有效范围内
        if (slideNumber < 1) slideNumber = 1;
        if (slideNumber > slides.length) slideNumber = slides.length;
        
        // 注意：幻灯片索引从0开始，但用户输入的页码从1开始
        const targetIndex = slideNumber - 1;
        const currentSlide = document.querySelector('.slide.active');
        const currentIndex = Array.from(slides).indexOf(currentSlide);
        
        // 如果目标页面就是当前页，就返回
        if (targetIndex === currentIndex) return;
        
        // 应用转场效果
        currentSlide.classList.remove('active');
        slides[targetIndex].classList.add('active');
        
        // 更新计数器
        updateSlideCounter();
    };
    
    // 检查是否从第3b页到第4页的特殊过渡
    function handleSpecialTransition() {
        const currentSlide = document.querySelector('.slide.active');
        const currentIndex = Array.from(slides).indexOf(currentSlide);
        
        // 如果当前是第3b页且要前进到第4页
        if (currentSlide.id === 'slide-3b') {
            // 显示确认弹窗
            document.getElementById('confirmation-modal').classList.add('active');
            return true; // 表示正在处理特殊过渡
        }
        
        return false; // 不是特殊过渡
    }
    
    // 前后按钮事件
    prevButton.addEventListener('click', () => changeSlide(-1));
    
    nextButton.addEventListener('click', () => {
        // 检查是否需要特殊过渡
        if (!handleSpecialTransition()) {
            changeSlide(1);
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        // 如果有输入框获得焦点，则不触发键盘导航
        if (document.activeElement.tagName === 'INPUT') return;
        
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
            // 检查是否需要特殊过渡
            if (!handleSpecialTransition()) {
                changeSlide(1);
            }
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
        }
    });
    
    // 跳转输入框回车键事件
    jumpInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const slideNumber = parseInt(this.value);
            if (!isNaN(slideNumber)) {
                jumpToSlide(slideNumber);
                this.value = ''; // 清空输入框
                this.blur(); // 失去焦点
            }
        }
    });
    
    // 跳转按钮点击事件
    jumpButton.addEventListener('click', function() {
        const slideNumber = parseInt(jumpInput.value);
        if (!isNaN(slideNumber)) {
            jumpToSlide(slideNumber);
            jumpInput.value = ''; // 清空输入框
            jumpInput.blur(); // 失去焦点
        }
    });
    
    // 全屏控制
    function toggleFullScreen() {
        const header = document.querySelector('header');
        
        if (!document.fullscreenElement) {
            // 进入全屏模式
            document.documentElement.requestFullscreen();
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            // 隐藏导航栏
            if (header) header.style.display = 'none';
        } else {
            // 退出全屏模式
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
                // 显示导航栏
                if (header) header.style.display = '';
            }
        }
    }
    
    fullscreenButton.addEventListener('click', toggleFullScreen);
    
    // 初始更新计数器
    updateSlideCounter();
}

// 初始化导航栏交互
function initNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', () => {
        // 切换导航菜单
        nav.classList.toggle('nav-active');
        
        // 切换汉堡按钮动画
        burger.classList.toggle('toggle');
    });
    
    // 监听全屏变化事件
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // 处理全屏变化事件
    function handleFullscreenChange() {
        const header = document.querySelector('header');
        if (!document.fullscreenElement) {
            // 退出全屏时显示导航栏
            if (header) header.style.display = '';
            window.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            // 进入全屏时隐藏导航栏
            if (header) header.style.display = 'none';
            window.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        }
    }
}

// 初始化交互式问答卡片
function initInteractiveCards() {
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const popupContainers = document.querySelectorAll('.popup-container');
    const popupCloseButtons = document.querySelectorAll('.popup-close');
    
    // 打开弹窗
    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup');
            const popup = document.getElementById(popupId);
            
            // 添加活动类以显示弹窗
            popup.classList.add('active');
            
            // 防止滚动
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 关闭弹窗
    popupCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup-container');
            popup.classList.remove('active');
            
            // 恢复滚动
            document.body.style.overflow = '';
        });
    });
    
    // 点击弹窗背景关闭弹窗
    popupContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activePopup = document.querySelector('.popup-container.active');
            if (activePopup) {
                activePopup.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
} 
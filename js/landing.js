/**
 * 即刻账号分析工具 - 产品介绍页面脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化FAQ折叠面板
    initFaqAccordion();
    
    // 初始化平滑滚动
    initSmoothScroll();
});

/**
 * 初始化FAQ折叠面板
 */
function initFaqAccordion() {
    const questions = document.querySelectorAll('.question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            // 获取对应的答案元素
            const answer = question.nextElementSibling;
            
            // 切换答案的显示状态
            if (answer.style.display === 'none' || answer.style.display === '') {
                answer.style.display = 'block';
                question.classList.add('active');
                question.style.borderBottomLeftRadius = '0';
                question.style.borderBottomRightRadius = '0';
                // 更改加号为减号
                question.setAttribute('data-open', 'true');
            } else {
                answer.style.display = 'none';
                question.classList.remove('active');
                question.style.borderRadius = '8px';
                // 更改减号为加号
                question.setAttribute('data-open', 'false');
            }
        });
        
        // 默认隐藏所有答案
        const answer = question.nextElementSibling;
        answer.style.display = 'none';
    });
}

/**
 * 初始化平滑滚动
 */
function initSmoothScroll() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认行为
            e.preventDefault();
            
            // 获取目标元素
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 平滑滚动到目标元素
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 添加固定导航栏效果
 */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    
    if (window.scrollY > 100) {
        nav.classList.add('fixed-nav');
    } else {
        nav.classList.remove('fixed-nav');
    }
});

// 为导航栏添加固定样式
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fixed-nav {
            position: fixed;
            background-color: rgba(30, 144, 255, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s;
        }
        
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    </style>
`);
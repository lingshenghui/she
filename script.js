// 烟花效果
class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const colors = ['#ff0', '#f00', '#ff5', '#f50'];
        for(let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 5 + Math.random() * 5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 100,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // 重力
            p.life--;

            if(p.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        if(Math.random() < 0.05) {
            this.createParticle(
                Math.random() * this.canvas.width,
                this.canvas.height
            );
        }

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化烟花效果
const firework = new Firework(document.getElementById('fireworks'));
firework.animate();

// 倒计时功能
function updateCountdown() {
    const now = new Date();
    const newYear = new Date(2025, 0, 1); // 2025年1月1日
    const diff = newYear - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if(diff <= 0) {
        // 新年到达时的特效
        document.querySelector('.greeting h1').textContent = '新年快乐！';
        createMassiveFireworks();
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 愿望墙功能
function addWish() {
    const input = document.getElementById('wishInput');
    const wish = input.value.trim();
    
    if(wish) {
        const wishElement = document.createElement('div');
        wishElement.className = 'wish';
        wishElement.textContent = wish;
        // 随机垂直位置
        wishElement.style.top = `${Math.random() * 150}px`;
        
        document.getElementById('wishWall').appendChild(wishElement);
        
        // 动画结束后移除元素
        wishElement.addEventListener('animationend', () => {
            wishElement.remove();
        });
        
        // 清空输入框
        input.value = '';
        
        // 添加出现效果
        wishElement.style.opacity = '0';
        setTimeout(() => {
            wishElement.style.opacity = '1';
            wishElement.style.transition = 'opacity 0.5s';
        }, 100);
    }
}

// 创建密集烟花效果（新年到达时使用）
function createMassiveFireworks() {
    for(let i = 0; i < 20; i++) {
        setTimeout(() => {
            firework.createParticle(
                Math.random() * firework.canvas.width,
                firework.canvas.height
            );
        }, i * 300);
    }
} 
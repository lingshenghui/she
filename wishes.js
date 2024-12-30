// 存储祝福数据
let wishes = JSON.parse(localStorage.getItem('wishes') || '[]');

// 添加祝福卡片
function addWishCard() {
    const author = document.getElementById('wishAuthor').value.trim();
    const content = document.getElementById('wishContent').value.trim();
    
    if (author && content) {
        const wish = {
            id: Date.now(),
            author,
            content,
            date: new Date().toLocaleDateString(),
            likes: 0
        };
        
        wishes.unshift(wish); // 新祝福放在前面
        saveWishes();
        renderWishes();
        
        // 清空输入
        document.getElementById('wishAuthor').value = '';
        document.getElementById('wishContent').value = '';
        
        // 显示成功提示
        showToast('祝福发送成功！');
    }
}

// 保存到本地存储
function saveWishes() {
    localStorage.setItem('wishes', JSON.stringify(wishes));
}

// 渲染祝福墙
function renderWishes() {
    const grid = document.querySelector('.wishes-grid');
    grid.innerHTML = '';
    
    wishes.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
            <div class="wish-author">${wish.author}</div>
            <div class="wish-content">${wish.content}</div>
            <div class="wish-footer">
                <span class="wish-date">${wish.date}</span>
                <button class="like-btn" onclick="likeWish(${wish.id})">
                    ❤️ ${wish.likes}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 点赞功能
function likeWish(id) {
    const wish = wishes.find(w => w.id === id);
    if (wish) {
        wish.likes++;
        saveWishes();
        renderWishes();
    }
}

// 显示提示信息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderWishes();
}); 
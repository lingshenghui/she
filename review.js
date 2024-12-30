// 月份数据
const monthsData = {
    jan: {
        title: '新年伊始',
        content: '在2024年的第一天，我们共同迎接新年的曙光。新的一年，新的开始，让我们带着希望和梦想继续前行。',
        images: ['jan1.jpg', 'jan2.jpg']
    },
    feb: {
        title: '春节团圆',
        content: '阖家团圆的春节时光，红红火火的节日氛围，让我们共同感受中国传统节日的魅力。全家人一起包饺子、贴春联、看春晚，其乐融融。',
        images: ['feb1.jpg', 'feb2.jpg']
    },
    mar: {
        title: '春暖花开',
        content: '春回大地，万物复苏。踏青赏花，感受大自然的生机。'
    }
    // 可以继续添加更多月份
};

// 显示月份详情
function showDetail(month) {
    const detail = monthsData[month];
    if (detail) {
        const overlay = document.createElement('div');
        overlay.className = 'month-detail-overlay';
        
        let imagesHTML = '';
        if (detail.images) {
            imagesHTML = `
                <div class="month-images">
                    ${detail.images.map(img => `
                        <div class="month-image" 
                             style="background-image: url('images/${img}')"
                             onclick="showLargePhoto('images/${img}')">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="month-detail">
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                <h2>${detail.title}</h2>
                <p>${detail.content}</p>
                ${imagesHTML}
            </div>
        `;
        
        // 添加点击背景关闭功能
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.body.appendChild(overlay);
    }
}

// 照片墙功能
document.getElementById('photoUpload').addEventListener('change', function(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addPhotoToGrid(e.target.result);
                savePhotos();
            }
            reader.readAsDataURL(file);
        }
    });
});

// 添加照片到网格
function addPhotoToGrid(imageUrl) {
    const photoGrid = document.getElementById('photoGrid');
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.style.backgroundImage = `url(${imageUrl})`;
    photoItem.style.backgroundSize = 'cover';
    photoItem.style.backgroundPosition = 'center';
    
    // 添加删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-photo';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('确定要删除这张照片吗？')) {
            photoItem.remove();
            savePhotos();
        }
    };
    
    photoItem.appendChild(deleteBtn);
    
    // 添加点击放大功能
    photoItem.onclick = () => showLargePhoto(imageUrl);
    
    photoGrid.appendChild(photoItem);
}

// 显示大图
function showLargePhoto(imageUrl) {
    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = `
        <div class="large-photo">
            <img src="${imageUrl}">
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加点击背景关闭功能
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    document.body.appendChild(overlay);
}

// 保存照片到localStorage
function savePhotos() {
    const photoGrid = document.getElementById('photoGrid');
    const photos = Array.from(photoGrid.children).map(item => 
        item.style.backgroundImage.slice(5, -2)
    );
    localStorage.setItem('yearPhotos', JSON.stringify(photos));
}

// 加载保存的照片
function loadPhotos() {
    const photos = JSON.parse(localStorage.getItem('yearPhotos') || '[]');
    photos.forEach(url => addPhotoToGrid(url));
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
    
    // 添加时间轴动画
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
        item.classList.add('animate-in');
    });
}); 
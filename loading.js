// 加载管理
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    
    // 预加载音频文件
    function preloadAudio(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            audio.src = url;
        });
    }
    
    // 预加载图片
    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });
    }
    
    // 资源加载列表
    Promise.all([
        preloadAudio('audio/gongxi.mp3'),
        preloadAudio('audio/xinnian.mp3'),
        preloadAudio('audio/caishendao.mp3')
    ]).then(() => {
        // 所有资源加载完成后隐藏加载指示器
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }).catch(error => {
        console.error('Resource loading failed:', error);
        // 即使加载失败也隐藏加载指示器
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    });
});

// 添加页面可见性管理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停不必要的动画和操作
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// 添加网络状态监测
window.addEventListener('online', function() {
    console.log('网络已连接');
});

window.addEventListener('offline', function() {
    console.log('网络已断开');
}); 
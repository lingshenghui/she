// 加载管理
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.getElementById('loading');
    let resourcesLoaded = false;
    
    // 设置加载超时
    const loadingTimeout = setTimeout(() => {
        if (!resourcesLoaded) {
            hideLoading();
        }
    }, 5000); // 5秒后强制隐藏加载画面

    // 隐藏加载画面
    function hideLoading() {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }

    // 分批加载资源
    async function loadResources() {
        try {
            // 首先加载关键资源
            await Promise.all([
                loadCSS('style.css'),
                loadCSS('nav.css')
            ]);

            // 然后加载音频文件
            const audioFiles = ['gongxi.mp3', 'xinnian.mp3', 'caishendao.mp3'];
            for (const file of audioFiles) {
                try {
                    await preloadAudio(`audio/${file}`);
                } catch (error) {
                    console.warn(`音频文件 ${file} 加载失败:`, error);
                }
            }

            resourcesLoaded = true;
            hideLoading();
            clearTimeout(loadingTimeout);
        } catch (error) {
            console.error('资源加载失败:', error);
            hideLoading();
        }
    }

    // 加载CSS文件
    function loadCSS(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // 预加载音频
    function preloadAudio(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            
            const timeout = setTimeout(() => {
                reject(new Error('音频加载超时'));
            }, 3000); // 3秒超时

            audio.oncanplaythrough = () => {
                clearTimeout(timeout);
                resolve();
            };
            
            audio.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('音频加载失败'));
            };
            
            audio.src = url;
        });
    }

    // 检测网络状态
    function checkNetwork() {
        if (!navigator.onLine) {
            alert('请检查网络连接');
        }
    }

    // 添加网络状态监听
    window.addEventListener('online', () => {
        console.log('网络已连接');
        loadResources();
    });

    window.addEventListener('offline', () => {
        console.log('网络已断开');
        alert('网络已断开，请检查网络连接');
    });

    // 开始加载资源
    checkNetwork();
    loadResources();
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
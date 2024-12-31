// 音乐控制
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // 设置初始音量（更小的音量）
    bgMusic.volume = 0.2;  // 20%的音量
    
    // 音乐列表
    const musicList = [
        'audio/gongxi.mp3',
        'audio/xinnian.mp3',
        'audio/caishendao.mp3'
    ];
    let currentMusicIndex = 0;
    
    // 音频加载错误重试机制
    let retryCount = 0;
    const maxRetries = 3;
    
    function loadAudioWithRetry(src) {
        bgMusic.src = src;
        bgMusic.load();
        
        return new Promise((resolve, reject) => {
            bgMusic.oncanplaythrough = resolve;
            bgMusic.onerror = () => {
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`重试加载音频 (${retryCount}/${maxRetries})`);
                    setTimeout(() => loadAudioWithRetry(src), 1000);
                } else {
                    reject(new Error('音频加载失败'));
                }
            };
        });
    }
    
    // 尝试自动播放
    function tryAutoplay() {
        bgMusic.play().then(() => {
            console.log("自动播放成功");
            musicToggle.classList.remove('paused');
        }).catch(error => {
            console.log("自动播放失败，等待用户交互:", error);
            musicToggle.classList.add('attention');
        });
    }
    
    // 切换到下一首歌
    function playNextSong() {
        currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
        bgMusic.src = musicList[currentMusicIndex];
        bgMusic.play().catch(error => console.log("播放失败:", error));
    }
    
    // 页面加载后尝试自动播放
    tryAutoplay();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            bgMusic.pause();
        } else if (!musicToggle.classList.contains('paused')) {
            bgMusic.play();
        }
    });
    
    // 音乐控制按钮点击事件
    musicToggle.addEventListener('click', function() {
        musicToggle.classList.remove('attention');
        
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        }
    });
    
    // 双击切换歌曲
    musicToggle.addEventListener('dblclick', function(e) {
        e.preventDefault();
        playNextSong();
    });
    
    // 监听音乐播放状态
    bgMusic.addEventListener('play', function() {
        musicToggle.classList.remove('paused');
    });
    
    bgMusic.addEventListener('pause', function() {
        musicToggle.classList.add('paused');
    });
    
    // 添加音乐播放错误处理
    bgMusic.addEventListener('error', function(e) {
        console.error("音乐加载错误，尝试播放下一首:", e);
        playNextSong();
    });
    
    // 添加音乐结束处理
    bgMusic.addEventListener('ended', function() {
        playNextSong();
    });
}); 
// 音乐控制
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // 设置初始音量（更小的音量）
    bgMusic.volume = 0.2;  // 20%的音量
    
    // 尝试自动播放
    function tryAutoplay() {
        bgMusic.play().then(() => {
            console.log("自动播放成功");
            musicToggle.classList.remove('paused');
        }).catch(error => {
            console.log("自动播放失败，等待用户交互:", error);
            // 添加提示动画
            musicToggle.classList.add('attention');
        });
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
        musicToggle.classList.remove('attention'); // 移除提示动画
        
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        }
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
        console.error("音乐加载错误:", e);
        // 可以在这里添加备用音乐源
        bgMusic.src = "https://music.163.com/song/media/outer/url?id=191232.mp3"; // 备用音乐：《新年好》
    });
}); 
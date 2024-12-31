class ErrorHandler {
    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    static handleResourceError(error) {
        console.error('资源加载错误:', error);
        this.showError('资源加载失败，请刷新页面重试');
    }

    static handleNetworkError() {
        this.showError('网络连接不稳定，请检查网络设置');
    }
}

// 添加全局错误处理
window.addEventListener('error', function(e) {
    ErrorHandler.handleResourceError(e);
}, true);

window.addEventListener('unhandledrejection', function(e) {
    ErrorHandler.handleResourceError(e.reason);
}); 
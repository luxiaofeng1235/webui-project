/**
 * 头像预览修复补丁
 * 修复上传头像图片无法预览的问题
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('应用头像预览修复补丁...');
    
    // 等待所有模块加载完成
    setTimeout(() => {
        applyAvatarFix();
    }, 1000);
});

function applyAvatarFix() {
    // 确保全局函数存在并正确绑定到 AvatarManager 实例
    if (window.avatarManager) {
        console.log('✅ 找到 avatarManager 实例，正在修复...');
        
        // 重新绑定全局函数到正确的实例方法
        window.triggerFileSelect = function() {
            console.log('触发文件选择...');
            if (window.avatarManager && typeof window.avatarManager.triggerFileSelect === 'function') {
                window.avatarManager.triggerFileSelect();
            } else {
                // 降级处理：直接触发文件输入
                const fileInput = document.getElementById('avatarFileInput');
                if (fileInput) {
                    fileInput.click();
                }
            }
        };
        
        window.openCameraCapture = function() {
            console.log('打开相机拍照...');
            if (window.avatarManager && typeof window.avatarManager.openCameraCapture === 'function') {
                window.avatarManager.openCameraCapture();
            }
        };
        
        window.capturePhoto = function() {
            console.log('拍照...');
            if (window.avatarManager && typeof window.avatarManager.capturePhoto === 'function') {
                window.avatarManager.capturePhoto();
            }
        };
        
        window.closeCameraCapture = function() {
            console.log('关闭相机...');
            if (window.avatarManager && typeof window.avatarManager.closeCameraCapture === 'function') {
                window.avatarManager.closeCameraCapture();
            }
        };
        
        window.saveAvatar = function() {
            console.log('保存头像...');
            if (window.avatarManager && typeof window.avatarManager.saveAvatar === 'function') {
                window.avatarManager.saveAvatar();
            }
        };

        // 添加头像显示更新函数
        window.updateAvatarDisplay = function(avatarUrl) {
            console.log('更新头像显示...');
            if (window.avatarManager && typeof window.avatarManager.updateDisplay === 'function') {
                window.avatarManager.updateDisplay(avatarUrl);
            }
        };

        // 添加加载用户头像函数
        window.loadUserAvatar = function() {
            console.log('加载用户头像...');
            if (window.avatarManager && typeof window.avatarManager.loadUserAvatar === 'function') {
                window.avatarManager.loadUserAvatar();
            }
        };
        
        // 重新设置文件输入事件监听器
        const fileInput = document.getElementById('avatarFileInput');
        if (fileInput) {
            // 移除现有的监听器（如果有的话）
            fileInput.removeEventListener('change', handleFileInputChange);
            // 添加新的监听器
            fileInput.addEventListener('change', handleFileInputChange);
            console.log('✅ 文件输入事件监听器已重新绑定');
        }
        
        // 重新设置拖拽上传功能
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            // 清除现有监听器
            previewContainer.removeEventListener('click', handlePreviewClick);
            previewContainer.removeEventListener('dragover', handleDragOver);
            previewContainer.removeEventListener('dragleave', handleDragLeave);
            previewContainer.removeEventListener('drop', handleDrop);
            
            // 重新添加监听器
            previewContainer.addEventListener('click', handlePreviewClick);
            previewContainer.addEventListener('dragover', handleDragOver);
            previewContainer.addEventListener('dragleave', handleDragLeave);
            previewContainer.addEventListener('drop', handleDrop);
            console.log('✅ 拖拽上传功能已重新绑定');
        }
        
        console.log('✅ 头像预览修复补丁已成功应用');
    } else {
        console.warn('⚠️ avatarManager 实例未找到，稍后重试...');
        // 如果还没有加载，再等待一会
        setTimeout(() => {
            applyAvatarFix();
        }, 2000);
    }
}

// 事件处理函数
function handleFileInputChange(e) {
    console.log('文件输入变化:', e.target.files.length);
    if (e.target.files.length > 0 && window.avatarManager) {
        window.avatarManager.handleFileSelect(e.target.files[0]);
    }
}

function handlePreviewClick() {
    console.log('预览区域被点击');
    window.triggerFileSelect();
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    console.log('文件拖拽释放:', files.length);
    if (files.length > 0 && window.avatarManager) {
        window.avatarManager.handleFileSelect(files[0]);
    }
}

// 手动修复函数
window.fixAvatarPreview = function() {
    console.log('手动修复头像预览功能...');
    applyAvatarFix();
};

// 监听应用初始化完成事件
document.addEventListener('appInitialized', function() {
    console.log('应用初始化完成，应用头像修复...');
    setTimeout(() => {
        applyAvatarFix();
    }, 500);
});
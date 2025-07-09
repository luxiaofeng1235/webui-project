/**
 * 头像管理模块
 * 负责头像上传、显示、相机拍照等功能
 */

class AvatarManager {
    constructor() {
        this.currentAvatarFile = null;
        this.cameraStream = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const fileInput = document.getElementById('avatarFileInput');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        this.handleFileSelect(e.target.files[0]);
                    }
                });
            }
        });
    }

    // 打开头像上传模态框
    openUploadModal() {
        const modal = document.getElementById('avatarUploadModal');
        this.resetUpload();
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        this.checkCameraSupport();
        this.setupDragAndDrop();
    }

    // 检测相机支持
    checkCameraSupport() {
        const cameraBtn = document.getElementById('cameraBtn');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            cameraBtn.style.display = 'inline-flex';
        } else {
            cameraBtn.style.display = 'none';
        }
    }

    // 设置拖拽上传
    setupDragAndDrop() {
        const previewContainer = document.querySelector('.preview-container');
        if (!previewContainer) return;
        
        previewContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            previewContainer.classList.add('drag-over');
        });
        
        previewContainer.addEventListener('dragleave', (e) => {
            e.preventDefault();
            previewContainer.classList.remove('drag-over');
        });
        
        previewContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            previewContainer.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
        
        // 点击预览区域也可以选择文件
        previewContainer.addEventListener('click', this.triggerFileSelect);
    }

    // 触发文件选择
    triggerFileSelect() {
        document.getElementById('avatarFileInput').click();
    }

    // 处理文件选择
    handleFileSelect(file) {
        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请选择 JPG、PNG 或 GIF 格式的图片', 'error');
            }
            return;
        }
        
        // 验证文件大小 (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            if (window.utilsManager) {
                window.utilsManager.showToast('文件大小不能超过 5MB', 'error');
            }
            return;
        }
        
        this.currentAvatarFile = file;
        
        // 显示预览
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // 显示图片预览
    showImagePreview(imageSrc) {
        const preview = document.getElementById('avatarPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const saveBtn = document.getElementById('saveAvatarBtn');
        
        if (preview && placeholder && saveBtn) {
            preview.src = imageSrc;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            saveBtn.disabled = false;
            
            // 隐藏其他区域
            const cameraSection = document.getElementById('cameraSection');
            const cropSection = document.getElementById('cropSection');
            if (cameraSection) cameraSection.style.display = 'none';
            if (cropSection) cropSection.style.display = 'none';
        }
    }

    // 打开相机拍照
    async openCameraCapture() {
        const cameraSection = document.getElementById('cameraSection');
        const video = document.getElementById('cameraVideo');
        
        if (!cameraSection || !video) return;
        
        try {
            // 请求相机权限
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // 前置摄像头
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            video.srcObject = this.cameraStream;
            cameraSection.style.display = 'block';
            
            // 隐藏其他区域
            const uploadPreview = document.querySelector('.upload-preview');
            const uploadControls = document.querySelector('.upload-controls');
            if (uploadPreview) uploadPreview.style.display = 'none';
            if (uploadControls) uploadControls.style.display = 'none';
            
        } catch (error) {
            console.error('无法访问相机:', error);
            if (window.utilsManager) {
                window.utilsManager.showToast('无法访问相机，请检查权限设置', 'error');
            }
        }
    }

    // 拍照
    capturePhoto() {
        const video = document.getElementById('cameraVideo');
        const canvas = document.getElementById('cameraCanvas');
        
        if (!video || !canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 绘制视频帧到画布
        ctx.drawImage(video, 0, 0);
        
        // 获取图片数据
        canvas.toBlob((blob) => {
            this.currentAvatarFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            
            // 显示预览
            const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
            this.showImagePreview(imageSrc);
            
            // 关闭相机
            this.closeCameraCapture();
            
            // 显示预览区域
            const uploadPreview = document.querySelector('.upload-preview');
            if (uploadPreview) uploadPreview.style.display = 'block';
            
        }, 'image/jpeg', 0.8);
    }

    // 关闭相机
    closeCameraCapture() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        const cameraSection = document.getElementById('cameraSection');
        const uploadPreview = document.querySelector('.upload-preview');
        const uploadControls = document.querySelector('.upload-controls');
        
        if (cameraSection) cameraSection.style.display = 'none';
        if (uploadPreview) uploadPreview.style.display = 'block';
        if (uploadControls) uploadControls.style.display = 'flex';
    }

    // 保存头像
    async saveAvatar() {
        if (!this.currentAvatarFile) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先选择或拍摄头像', 'error');
            }
            return;
        }
        
        try {
            // 显示加载状态
            const saveBtn = document.getElementById('saveAvatarBtn');
            if (!saveBtn) return;
            
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            saveBtn.disabled = true;
            
            // 模拟上传
            const response = await this.simulateUpload(this.currentAvatarFile);
            
            if (response.success) {
                // 更新用户头像信息
                if (window.authCore && window.authCore.currentUser) {
                    window.authCore.currentUser.avatar = response.avatarUrl;
                    
                    // 更新存储的用户信息
                    const userDataToSave = {
                        ...window.authCore.currentUser,
                        lastUpdated: new Date().toISOString()
                    };
                    
                    if (localStorage.getItem('fitlife_user')) {
                        localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                    } else {
                        sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                    }
                    
                    // 同时更新注册用户数据中的头像
                    if (window.authCore.registeredUsers.has(window.authCore.currentUser.email)) {
                        const registeredUser = window.authCore.registeredUsers.get(window.authCore.currentUser.email);
                        registeredUser.avatar = response.avatarUrl;
                        registeredUser.avatarUpdatedAt = new Date().toISOString();
                        window.authCore.saveRegisteredUsers();
                        console.log('头像已保存到注册用户数据中');
                    }
                    
                    // 更新界面显示
                    this.updateDisplay(response.avatarUrl);
                }

                if (window.utilsManager) {
                    window.utilsManager.showToast('头像更新成功！', 'success');
                }

                // 关闭模态框
                if (window.authCore && typeof window.authCore.closeModal === 'function') {
                    window.authCore.closeModal('avatarUploadModal');
                } else {
                    const modal = document.getElementById('avatarUploadModal');
                    if (modal) {
                        modal.style.display = 'none';
                        modal.classList.remove('show');
                    }
                }
                
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '头像上传失败', 'error');
                }
            }
            
            // 恢复按钮状态
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            
        } catch (error) {
            console.error('头像上传错误:', error);
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
            
            // 恢复按钮状态
            const saveBtn = document.getElementById('saveAvatarBtn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存头像';
                saveBtn.disabled = false;
            }
        }
    }

    // 更新头像显示
    updateDisplay(avatarUrl) {
        // 更新设置页面的头像
        const currentAvatarImg = document.getElementById('currentAvatarImg');
        const defaultAvatarIcon = document.getElementById('defaultAvatarIcon');

        if (currentAvatarImg && defaultAvatarIcon) {
            if (avatarUrl) {
                currentAvatarImg.src = avatarUrl;
                currentAvatarImg.style.display = 'block';
                defaultAvatarIcon.style.display = 'none';
            } else {
                currentAvatarImg.style.display = 'none';
                defaultAvatarIcon.style.display = 'block';
            }
        }

        // 更新导航栏的头像
        const navAvatarImg = document.getElementById('navAvatarImg');
        const navAvatarIcon = document.getElementById('navAvatarIcon');

        if (navAvatarImg && navAvatarIcon) {
            if (avatarUrl) {
                navAvatarImg.src = avatarUrl;
                navAvatarImg.style.display = 'block';
                navAvatarIcon.style.display = 'none';
            } else {
                navAvatarImg.style.display = 'none';
                navAvatarIcon.style.display = 'block';
            }
        }

        // 更新个人中心的头像
        const profileAvatarImg = document.getElementById('profileAvatarImg');
        const profileAvatarIcon = document.getElementById('profileAvatarIcon');

        if (profileAvatarImg && profileAvatarIcon) {
            if (avatarUrl) {
                profileAvatarImg.src = avatarUrl;
                profileAvatarImg.style.display = 'block';
                profileAvatarIcon.style.display = 'none';
            } else {
                profileAvatarImg.style.display = 'none';
                profileAvatarIcon.style.display = 'block';
            }
        }

        console.log('所有头像已更新:', avatarUrl ? '显示用户头像' : '显示默认图标');
    }

    // 重置头像上传
    resetUpload() {
        this.currentAvatarFile = null;
        
        // 重置预览
        const preview = document.getElementById('avatarPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const saveBtn = document.getElementById('saveAvatarBtn');
        
        if (preview) preview.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        if (saveBtn) saveBtn.disabled = true;
        
        // 重置文件输入
        const fileInput = document.getElementById('avatarFileInput');
        if (fileInput) fileInput.value = '';
        
        // 隐藏相机和裁剪区域
        const cameraSection = document.getElementById('cameraSection');
        const cropSection = document.getElementById('cropSection');
        if (cameraSection) cameraSection.style.display = 'none';
        if (cropSection) cropSection.style.display = 'none';
        
        // 显示上传控件
        const uploadPreview = document.querySelector('.upload-preview');
        const uploadControls = document.querySelector('.upload-controls');
        if (uploadPreview) uploadPreview.style.display = 'block';
        if (uploadControls) uploadControls.style.display = 'flex';
        
        // 关闭相机流
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    // 在设置模态框打开时加载用户头像
    loadUserAvatar() {
        if (window.authCore && window.authCore.currentUser && window.authCore.currentUser.avatar) {
            this.updateDisplay(window.authCore.currentUser.avatar);
        } else {
            this.updateDisplay(null);
        }
    }

    // 模拟头像上传API
    async simulateUpload(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 将文件转换为base64格式，这样刷新页面后仍然有效
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Avatar = e.target.result;
                    resolve({
                        success: true,
                        avatarUrl: base64Avatar,
                        message: '头像上传成功'
                    });
                };
                reader.readAsDataURL(file);
            }, 1000); // 模拟网络延迟
        });
    }
}

// 导出模块
window.AvatarManager = AvatarManager;
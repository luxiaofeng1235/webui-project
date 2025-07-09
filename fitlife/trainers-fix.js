/**
 * 教练详情功能修复补丁
 * 修复点击查看详情按钮和图片加载中的问题
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('应用教练详情修复补丁...');
    
    // 等待所有模块加载完成
    setTimeout(() => {
        applyTrainersFix();
    }, 1000);
});

function applyTrainersFix() {
    console.log('开始修复教练详情功能...');
    
    // 修复教练图片加载问题
    fixTrainerImages();
    
    // 修复查看详情按钮
    fixTrainerDetailButtons();
    
    // 确保模态框事件正确绑定
    fixTrainerModal();
    
    console.log('✅ 教练详情修复补丁已应用');
}

// 修复教练图片加载问题
function fixTrainerImages() {
    const trainerImages = document.querySelectorAll('.trainer-image img');
    
    trainerImages.forEach((img, index) => {
        // 添加加载状态
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'image-loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff6b35;
            font-size: 14px;
            text-align: center;
            z-index: 10;
        `;
        
        // 设置父容器为相对定位
        if (img.parentElement) {
            img.parentElement.style.position = 'relative';
            img.parentElement.appendChild(loadingDiv);
        }
        
        // 图片加载成功处理
        img.onload = function() {
            console.log(`教练图片加载成功: ${this.src}`);
            if (loadingDiv && loadingDiv.parentElement) {
                loadingDiv.remove();
            }
            this.style.opacity = '1';
        };
        
        // 图片加载失败处理
        img.onerror = function() {
            console.warn(`教练图片加载失败: ${this.src}`);

            // 使用备用图片
            this.src = 'images/pexels-photo-1552242.webp';
            this.onerror = function() {
                // 最终备用图片也失败，隐藏图片
                this.style.display = 'none';
                this.onerror = null;
            };

            if (loadingDiv && loadingDiv.parentElement) {
                loadingDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 图片加载失败';
                setTimeout(() => {
                    if (loadingDiv.parentElement) {
                        loadingDiv.remove();
                    }
                }, 2000);
            }
        };
        
        // 设置初始透明度
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// 修复查看详情按钮
function fixTrainerDetailButtons() {
    const detailButtons = document.querySelectorAll('.trainer-actions .btn-secondary');
    console.log(`找到 ${detailButtons.length} 个查看详情按钮`);
    
    detailButtons.forEach((button, index) => {
        // 移除现有事件监听器
        button.removeEventListener('click', handleTrainerDetailClick);
        
        // 添加新的事件监听器
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trainerKeys = ['zhang', 'li', 'wang', 'chen'];
            const trainerId = trainerKeys[index];
            
            console.log(`点击查看详情按钮，教练ID: ${trainerId}`);
            
            // 确保有教练管理器实例
            if (window.trainerManager) {
                window.trainerManager.showTrainerDetail(trainerId);
            } else if (window.showTrainerDetail) {
                // 降级处理
                window.showTrainerDetail(trainerId);
            } else {
                // 手动显示详情
                showTrainerDetailFallback(trainerId);
            }
        });
        
        // 添加视觉反馈
        button.style.cursor = 'pointer';
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// 备用教练详情显示函数
function showTrainerDetailFallback(trainerId) {
    console.log(`使用备用方法显示教练详情: ${trainerId}`);
    
    const trainersData = {
        'zhang': { name: '张强', title: '首席力量教练', image: 'images/hero-1.jpg' },
        'li': { name: '李美丽', title: '瑜伽&普拉提导师', image: 'images/trainer-1.jpg' },
        'wang': { name: '王健', title: '有氧训练专家', image: 'images/trainer-2.jpg' },
        'chen': { name: '陈雪', title: '女性塑形专家', image: 'images/trainer-1.jpg' }
    };
    
    const trainer = trainersData[trainerId];
    if (!trainer) {
        console.error('教练数据未找到:', trainerId);
        alert('教练信息暂时无法显示，请稍后重试');
        return;
    }
    
    // 创建简单的模态框
    const modal = createSimpleTrainerModal(trainer);
    document.body.appendChild(modal);
    
    // 显示模态框
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
    }, 100);
}

// 创建简单的教练模态框
function createSimpleTrainerModal(trainer) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        position: relative;
    `;
    
    content.innerHTML = `
        <div style="padding: 30px;">
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                    style="position: absolute; top: 15px; right: 15px; background: none; border: none; 
                           font-size: 24px; cursor: pointer; color: #666;">×</button>
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${trainer.image}" alt="${trainer.name}" 
                     style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%; margin-bottom: 15px;"
                     onerror="this.src='images/pexels-photo-1552242.webp'">
                <h2 style="margin: 0; color: #333;">${trainer.name}</h2>
                <p style="margin: 5px 0; color: #ff6b35; font-weight: 600;">${trainer.title}</p>
            </div>
            <div style="text-align: center;">
                <p style="color: #666; margin-bottom: 20px;">详细信息加载中，请稍后...</p>
                <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                        style="background: #ff6b35; color: white; border: none; padding: 12px 24px; 
                               border-radius: 6px; cursor: pointer;">关闭</button>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// 修复教练模态框
function fixTrainerModal() {
    const modal = document.getElementById('trainer-modal');
    if (!modal) {
        console.warn('教练模态框未找到');
        return;
    }
    
    // 确保关闭按钮工作
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.removeEventListener('click', closeTrainerModalHandler);
        closeBtn.addEventListener('click', closeTrainerModalHandler);
    }
    
    // 点击外部关闭
    modal.removeEventListener('click', modalBackgroundClickHandler);
    modal.addEventListener('click', modalBackgroundClickHandler);
}

// 事件处理函数
function handleTrainerDetailClick(e) {
    // 这个函数用于removeEventListener
}

function closeTrainerModalHandler() {
    const modal = document.getElementById('trainer-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function modalBackgroundClickHandler(e) {
    if (e.target.id === 'trainer-modal') {
        closeTrainerModalHandler();
    }
}

// 手动修复函数
window.fixTrainerDetails = function() {
    console.log('手动修复教练详情功能...');
    applyTrainersFix();
};

// 监听应用初始化完成事件
document.addEventListener('appInitialized', function() {
    console.log('应用初始化完成，应用教练详情修复...');
    setTimeout(() => {
        applyTrainersFix();
    }, 500);
});

// 为全局访问暴露函数
window.showTrainerDetailFallback = showTrainerDetailFallback;
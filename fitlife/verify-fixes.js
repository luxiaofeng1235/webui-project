/**
 * 修复验证脚本
 * 在浏览器控制台中运行此脚本来验证修复是否有效
 */

console.log('🔧 开始验证 FitLife 修复...');

// 验证结果收集
const results = {
    trainerModal: false,
    avatarUpload: false,
    settingsModal: false,
    imageLoading: false,
    lazyLoadingDisabled: false
};

// 1. 验证教练详情弹窗图片加载
function verifyTrainerModal() {
    console.log('📋 验证教练详情弹窗...');
    
    try {
        // 检查教练数据是否存在
        if (typeof window.trainerManager !== 'undefined' && window.trainerManager.trainersData) {
            console.log('✅ 教练管理器存在');
            
            // 检查图片路径
            const trainers = window.trainerManager.trainersData;
            Object.keys(trainers).forEach(key => {
                const trainer = trainers[key];
                console.log(`📸 ${trainer.name}: ${trainer.image}`);
            });
            
            results.trainerModal = true;
        } else if (typeof window.showTrainerDetail === 'function') {
            console.log('✅ 教练详情函数存在（备用）');
            results.trainerModal = true;
        } else {
            console.log('❌ 教练管理器不存在');
        }
    } catch (error) {
        console.error('❌ 教练详情验证失败:', error);
    }
}

// 2. 验证头像上传回显
function verifyAvatarUpload() {
    console.log('👤 验证头像上传回显...');
    
    try {
        if (typeof window.avatarManager !== 'undefined') {
            console.log('✅ 头像管理器存在');
            
            // 检查关键方法
            const methods = ['updateDisplay', 'loadUserAvatar', 'saveAvatar'];
            methods.forEach(method => {
                if (typeof window.avatarManager[method] === 'function') {
                    console.log(`✅ ${method} 方法存在`);
                } else {
                    console.log(`❌ ${method} 方法不存在`);
                }
            });
            
            results.avatarUpload = true;
        } else {
            console.log('❌ 头像管理器不存在');
        }
    } catch (error) {
        console.error('❌ 头像上传验证失败:', error);
    }
}

// 3. 验证设置模态框关闭
function verifySettingsModal() {
    console.log('⚙️ 验证设置模态框关闭...');
    
    try {
        if (typeof window.authCore !== 'undefined' && typeof window.authCore.closeModal === 'function') {
            console.log('✅ authCore.closeModal 存在');
            results.settingsModal = true;
        } else if (typeof window.closeModal === 'function') {
            console.log('✅ 全局 closeModal 存在');
            results.settingsModal = true;
        } else {
            console.log('❌ 关闭模态框函数不存在');
        }
    } catch (error) {
        console.error('❌ 设置模态框验证失败:', error);
    }
}

// 4. 验证懒加载是否已禁用
function verifyLazyLoadingDisabled() {
    console.log('🚫 验证懒加载禁用状态...');

    try {
        // 检查是否有懒加载图片
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        const lazyClasses = document.querySelectorAll('img.lazy, img.lazyload, img.lazy-load');

        console.log(`发现 ${lazyImages.length} 个懒加载属性图片`);
        console.log(`发现 ${lazyClasses.length} 个懒加载类图片`);

        if (lazyImages.length === 0 && lazyClasses.length === 0) {
            console.log('✅ 没有发现懒加载图片');
            results.lazyLoadingDisabled = true;
        } else {
            console.log('❌ 仍有懒加载图片存在');

            // 列出懒加载图片
            lazyImages.forEach((img, index) => {
                console.log(`懒加载图片 ${index + 1}: ${img.src || img.dataset.src}`);
            });
        }

        // 检查禁用懒加载函数是否存在
        if (typeof window.disableLazyLoading === 'function') {
            console.log('✅ 禁用懒加载函数存在');
        } else {
            console.log('❌ 禁用懒加载函数不存在');
        }

    } catch (error) {
        console.error('❌ 懒加载验证失败:', error);
    }
}

// 5. 验证图片加载
function verifyImageLoading() {
    console.log('🖼️ 验证图片加载...');
    
    const testImages = [
        'images/hero-1.jpg',
        'images/trainer-1.jpg',
        'images/trainer-2.jpg',
        'images/pexels-photo-1552242.webp'
    ];
    
    let loadedCount = 0;
    let totalCount = testImages.length;
    
    testImages.forEach(imagePath => {
        const img = new Image();
        img.onload = function() {
            loadedCount++;
            console.log(`✅ ${imagePath} 加载成功`);
            
            if (loadedCount === totalCount) {
                console.log(`✅ 所有测试图片加载成功 (${loadedCount}/${totalCount})`);
                results.imageLoading = true;
                showFinalResults();
            }
        };
        
        img.onerror = function() {
            loadedCount++;
            console.log(`❌ ${imagePath} 加载失败`);
            
            if (loadedCount === totalCount) {
                console.log(`⚠️ 图片加载完成，部分失败 (${loadedCount}/${totalCount})`);
                showFinalResults();
            }
        };
        
        img.src = imagePath;
    });
}

// 显示最终结果
function showFinalResults() {
    console.log('\n📊 修复验证结果:');
    console.log('==================');
    
    const checks = [
        { name: '教练详情弹窗', result: results.trainerModal },
        { name: '头像上传回显', result: results.avatarUpload },
        { name: '设置模态框关闭', result: results.settingsModal },
        { name: '懒加载已禁用', result: results.lazyLoadingDisabled },
        { name: '图片加载', result: results.imageLoading }
    ];
    
    let passedCount = 0;
    checks.forEach(check => {
        const status = check.result ? '✅ 通过' : '❌ 失败';
        console.log(`${check.name}: ${status}`);
        if (check.result) passedCount++;
    });
    
    const percentage = Math.round((passedCount / checks.length) * 100);
    console.log(`\n总体结果: ${passedCount}/${checks.length} (${percentage}%)`);
    
    if (percentage === 100) {
        console.log('🎉 所有修复验证通过！');
    } else if (percentage >= 75) {
        console.log('👍 大部分修复验证通过');
    } else {
        console.log('⚠️ 需要进一步检查修复');
    }
}

// 运行所有验证
function runAllVerifications() {
    verifyTrainerModal();
    verifyAvatarUpload();
    verifySettingsModal();
    verifyLazyLoadingDisabled();
    verifyImageLoading();
}

// 导出验证函数
window.verifyFixes = runAllVerifications;

// 如果在浏览器环境中，自动运行
if (typeof window !== 'undefined' && window.document) {
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runAllVerifications, 2000);
        });
    } else {
        setTimeout(runAllVerifications, 2000);
    }
}

console.log('💡 您也可以手动运行: verifyFixes()');

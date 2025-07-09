/**
 * 社区互动模块
 * 负责健身挑战、评价系统、论坛等社区功能
 */

class CommunityManager {
    constructor() {
        this.init();
    }

    init() {
        this.initCommunityTabs();
        this.initChallenges();
        this.initStarRating();
        this.initReviewSystem();
        this.initForum();
    }

    // 社区标签切换
    initCommunityTabs() {
        const communityTabs = document.querySelectorAll('.community-tab');
        const communityContents = document.querySelectorAll('.community-content');
        
        communityTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // 移除所有活动状态
                communityTabs.forEach(t => t.classList.remove('active'));
                communityContents.forEach(c => c.classList.remove('active'));
                
                // 添加活动状态
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // 健身挑战功能
    initChallenges() {
        const challengeJoinButtons = document.querySelectorAll('.challenge-join');
        challengeJoinButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleChallengeJoin(button);
            });
        });
    }

    handleChallengeJoin(button) {
        const challengeCard = button.closest('.challenge-card');
        const challengeName = challengeCard.querySelector('h4').textContent;
        
        if (button.textContent === '加入挑战') {
            button.textContent = '继续挑战';
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
            
            // 更新进度条
            const progressFill = challengeCard.querySelector('.progress-fill');
            const progressText = challengeCard.querySelector('.challenge-progress span');
            if (progressFill && progressText) {
                progressFill.style.width = '5%';
                progressText.textContent = '1/21 天';
            }
            
            // 更新参与人数
            const participantsSpan = challengeCard.querySelector('.challenge-participants span');
            if (participantsSpan) {
                const currentCount = parseInt(participantsSpan.textContent.match(/\d+/)[0]);
                participantsSpan.innerHTML = `<i class="fas fa-users"></i> ${currentCount + 1}人参与`;
            }
            
            alert(`恭喜您成功加入"${challengeName}"！坚持就是胜利！`);
        } else {
            alert(`继续加油！您在"${challengeName}"中的表现很棒！`);
        }
    }

    // 星级评分功能
    initStarRating() {
        const starRatings = document.querySelectorAll('.star-rating');
        starRatings.forEach(rating => {
            this.setupStarRating(rating);
        });
    }

    setupStarRating(rating) {
        const stars = rating.querySelectorAll('i');
        let selectedRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                this.highlightStars(stars, index + 1);
            });
            
            star.addEventListener('mouseleave', () => {
                this.highlightStars(stars, selectedRating);
            });
            
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                this.highlightStars(stars, selectedRating);
                rating.setAttribute('data-rating', selectedRating);
            });
        });
    }

    highlightStars(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    // 评价系统
    initReviewSystem() {
        const reviewForm = document.querySelector('.review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                this.handleReviewSubmit(e);
            });
        }

        // 评价点赞功能
        this.initReviewLikes();
    }

    handleReviewSubmit(e) {
        e.preventDefault();
        
        const target = document.getElementById('review-target')?.value;
        const rating = document.querySelector('.star-rating')?.getAttribute('data-rating');
        const content = document.getElementById('review-content')?.value;
        
        if (!target || !rating || !content) {
            alert('请填写完整的评价信息！');
            return;
        }
        
        // 创建新评价
        const newReview = this.createReviewElement({
            target,
            rating: parseInt(rating),
            content,
            author: '匿名用户',
            date: new Date().toLocaleDateString(),
            likes: 0
        });
        
        // 添加到评价列表
        const reviewsList = document.querySelector('.reviews-list');
        if (reviewsList) {
            reviewsList.insertBefore(newReview, reviewsList.firstChild);
        }
        
        // 重置表单
        e.target.reset();
        document.querySelector('.star-rating').setAttribute('data-rating', '0');
        this.highlightStars(document.querySelectorAll('.star-rating i'), 0);
        
        alert('评价提交成功！感谢您的反馈！');
    }

    createReviewElement(reviewData) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        reviewDiv.innerHTML = `
            <div class="review-header">
                <div class="review-author">${reviewData.author}</div>
                <div class="review-rating">
                    ${this.generateStarsHTML(reviewData.rating)}
                </div>
                <div class="review-date">${reviewData.date}</div>
            </div>
            <div class="review-content">${reviewData.content}</div>
            <div class="review-actions">
                <button class="review-like" data-likes="${reviewData.likes}">
                    <i class="far fa-thumbs-up"></i> ${reviewData.likes}
                </button>
            </div>
        `;
        
        // 添加点赞事件
        const likeBtn = reviewDiv.querySelector('.review-like');
        likeBtn.addEventListener('click', () => this.handleReviewLike(likeBtn));
        
        return reviewDiv;
    }

    generateStarsHTML(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }

    // 评价点赞功能
    initReviewLikes() {
        document.querySelectorAll('.review-like').forEach(button => {
            button.addEventListener('click', () => this.handleReviewLike(button));
        });
    }

    handleReviewLike(button) {
        const currentLikes = parseInt(button.getAttribute('data-likes'));
        const newLikes = currentLikes + 1;
        
        button.setAttribute('data-likes', newLikes);
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${newLikes}`;
        button.classList.add('liked');
        button.disabled = true;
    }

    // 论坛功能
    initForum() {
        this.initForumPost();
        this.initForumFilter();
        this.initForumInteractions();
    }

    initForumPost() {
        const postForm = document.querySelector('.forum-post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                this.handleForumPost(e);
            });
        }
    }

    handleForumPost(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title')?.value;
        const content = document.getElementById('post-content')?.value;
        const category = document.getElementById('post-category')?.value;
        
        if (!title || !content || !category) {
            alert('请填写完整的帖子信息！');
            return;
        }
        
        // 创建新帖子
        const newPost = this.createForumPostElement({
            title,
            content,
            category,
            author: '匿名用户',
            date: new Date().toLocaleDateString(),
            replies: 0,
            likes: 0
        });
        
        // 添加到论坛列表
        const forumList = document.querySelector('.forum-posts');
        if (forumList) {
            forumList.insertBefore(newPost, forumList.firstChild);
        }
        
        // 重置表单
        e.target.reset();
        alert('帖子发布成功！');
    }

    createForumPostElement(postData) {
        const postDiv = document.createElement('div');
        postDiv.className = 'forum-post';
        postDiv.innerHTML = `
            <div class="post-header">
                <h4>${postData.title}</h4>
                <span class="post-category">${postData.category}</span>
            </div>
            <div class="post-content">${postData.content}</div>
            <div class="post-meta">
                <span class="post-author">作者：${postData.author}</span>
                <span class="post-date">${postData.date}</span>
                <span class="post-replies">${postData.replies} 回复</span>
                <button class="post-like" data-likes="${postData.likes}">
                    <i class="far fa-thumbs-up"></i> ${postData.likes}
                </button>
            </div>
        `;
        
        // 添加点赞事件
        const likeBtn = postDiv.querySelector('.post-like');
        likeBtn.addEventListener('click', () => this.handlePostLike(likeBtn));
        
        return postDiv;
    }

    initForumFilter() {
        const filterButtons = document.querySelectorAll('.forum-filter button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleForumFilter(button);
            });
        });
    }

    handleForumFilter(button) {
        const category = button.getAttribute('data-category');
        
        // 更新按钮状态
        document.querySelectorAll('.forum-filter button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // 过滤帖子
        const posts = document.querySelectorAll('.forum-post');
        posts.forEach(post => {
            const postCategory = post.querySelector('.post-category')?.textContent;
            if (category === 'all' || postCategory === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    initForumInteractions() {
        document.querySelectorAll('.post-like').forEach(button => {
            button.addEventListener('click', () => this.handlePostLike(button));
        });
    }

    handlePostLike(button) {
        const currentLikes = parseInt(button.getAttribute('data-likes'));
        const newLikes = currentLikes + 1;
        
        button.setAttribute('data-likes', newLikes);
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${newLikes}`;
        button.classList.add('liked');
        button.disabled = true;
    }
}

// 导出模块
window.CommunityManager = CommunityManager;
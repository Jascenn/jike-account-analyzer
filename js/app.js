/**
 * 即刻账号分析工具
 * 功能：分析自媒体博主内容，根据关键词筛选感兴趣的内容
 */

// DOM元素
const form = document.getElementById('analyzer-form');
const accountUrlInput = document.getElementById('account-url');
const keywordsInput = document.getElementById('keywords');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const accountInfoEl = document.getElementById('account-info');
const contentListEl = document.getElementById('content-list');
const onlyShowFilteredCheckbox = document.getElementById('only-show-filtered');
const sortOptionSelect = document.getElementById('sort-option');

// 全局变量
let accountData = null;
let contentData = [];
let filteredContent = [];
let keywords = [];
let newContentData = []; // 存储新增的内容数据
let feishuConfig = {
    appId: '',
    appSecret: '',
    appToken: '',
    tableId: ''
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 绑定事件
    form.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', clearResults);
    onlyShowFilteredCheckbox.addEventListener('change', renderContentList);
    sortOptionSelect.addEventListener('change', renderContentList);
    
    // 隐藏结果区域
    resultSection.style.display = 'none';
    loadingSection.style.display = 'none';
    
    // 加载历史数据和飞书配置
    loadHistoryData();
    loadFeishuConfig();
});

/**
 * 加载历史数据
 */
function loadHistoryData() {
    const historyData = localStorage.getItem('jikeAnalyzerHistory');
    if (historyData) {
        try {
            return JSON.parse(historyData);
        } catch (e) {
            console.error('解析历史数据失败:', e);
            return null;
        }
    }
    return null;
}

/**
 * 保存历史数据
 * @param {string} accountUrl - 账号链接
 * @param {Array} content - 内容数据
 */
function saveHistoryData(accountUrl, content) {
    const historyData = {
        accountUrl,
        content,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('jikeAnalyzerHistory', JSON.stringify(historyData));
}

/**
 * 加载飞书配置
 */
function loadFeishuConfig() {
    const config = localStorage.getItem('feishuConfig');
    if (config) {
        feishuConfig = JSON.parse(config);
    }
}

/**
 * 保存飞书配置
 */
function saveFeishuConfig() {
    localStorage.setItem('feishuConfig', JSON.stringify(feishuConfig));
}

/**
 * 同步数据到飞书多维表格
 * @param {Array} data - 要同步的数据
 */
async function syncToFeishu(data) {
    if (!feishuConfig.appId || !feishuConfig.appSecret || !feishuConfig.appToken || !feishuConfig.tableId) {
        showError('请先配置飞书应用信息');
        return false;
    }

    try {
        // 这里应该实现实际的API调用逻辑
        // 由于跨域限制，这里使用模拟实现
        console.log('模拟同步数据到飞书:', data);
        return true;
    } catch (error) {
        console.error('同步到飞书失败:', error);
        return false;
    }
}

/**
 * 处理表单提交
 * @param {Event} e - 事件对象
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // 获取输入值
    const accountUrl = accountUrlInput.value.trim();
    const keywordsText = keywordsInput.value.trim();
    
    // 验证输入
    if (!accountUrl) {
        showError('请输入博主账号链接');
        return;
    }
    
    // 解析关键词
    keywords = keywordsText ? keywordsText.split(/[,，;；\s]+/).filter(k => k.trim()) : [];
    
    // 显示加载状态
    showLoading(true);
    
    try {
        // 获取账号数据
        accountData = await fetchAccountData(accountUrl);
        
        // 获取内容数据
        contentData = await fetchContentData(accountUrl);
        
        // 筛选内容
        filteredContent = filterContentByKeywords(contentData, keywords);
        
        // 检查是否有新增数据
        checkNewContent(accountUrl, contentData);
        
        // 渲染结果
        renderResults();
        
        // 如果有新增数据，显示提示
        if (newContentData.length > 0) {
            showNewContentNotification(newContentData.length);
        }
    } catch (error) {
        showError(`获取数据失败: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

/**
 * 检查是否有新增数据
 * @param {string} accountUrl - 账号链接
 * @param {Array} currentContent - 当前内容数据
 */
function checkNewContent(accountUrl, currentContent) {
    // 获取历史数据
    const historyData = loadHistoryData();
    
    // 重置新增数据
    newContentData = [];
    
    // 如果有历史数据且账号相同
    if (historyData && historyData.accountUrl === accountUrl) {
        const oldContent = historyData.content;
        
        // 找出新增的内容
        newContentData = currentContent.filter(current => {
            // 检查当前内容是否存在于历史数据中
            return !oldContent.some(old => old.id === current.id);
        });
    } else {
        // 如果没有历史数据或账号不同，则所有内容都视为新增
        newContentData = [...currentContent];
    }
    
    // 保存当前数据作为历史数据
    saveHistoryData(accountUrl, currentContent);
}

/**
 * 获取账号数据
 * @param {string} url - 账号链接
 * @returns {Promise<Object>} - 账号数据
 */
async function fetchAccountData(url) {
    // 在实际应用中，这里应该发送请求到服务器获取数据
    // 由于跨域限制，这里使用模拟数据
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 从URL中提取用户名或ID
    const username = extractUsernameFromUrl(url);
    
    // 返回模拟数据
    return {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: username,
        nickname: username + '的即刻',
        avatar: 'https://via.placeholder.com/80',
        bio: '这是一个即刻用户的个人简介，展示用户的基本信息和特点。',
        followersCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        postsCount: Math.floor(Math.random() * 500)
    };
}

/**
 * 获取内容数据
 * @param {string} url - 账号链接
 * @returns {Promise<Array>} - 内容数据数组
 */
async function fetchContentData(url) {
    // 在实际应用中，这里应该发送请求到服务器获取数据
    // 由于跨域限制，这里使用模拟数据
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 生成模拟数据
    const topics = [
        '科技', '设计', '摄影', '旅行', '美食', '电影', '音乐', '阅读',
        '健身', '职场', '编程', '投资', '创业', '时尚', '游戏', '教育'
    ];
    
    const contents = [];
    const count = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < count; i++) {
        // 随机选择1-3个主题
        const postTopics = [];
        const topicCount = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < topicCount; j++) {
            const topic = topics[Math.floor(Math.random() * topics.length)];
            if (!postTopics.includes(topic)) {
                postTopics.push(topic);
            }
        }
        
        // 创建内容
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        contents.push({
            id: 'post_' + Math.random().toString(36).substr(2, 9),
            title: `关于${postTopics.join('和')}的一些思考`,
            content: generateRandomContent(postTopics),
            topics: postTopics,
            publishTime: date.toISOString(),
            likes: Math.floor(Math.random() * 200),
            comments: Math.floor(Math.random() * 50),
            hasImage: Math.random() > 0.5
        });
    }
    
    // 按时间排序（最新的在前）
    return contents.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
}

/**
 * 根据关键词筛选内容
 * @param {Array} contents - 内容数组
 * @param {Array} keywords - 关键词数组
 * @returns {Array} - 筛选后的内容数组
 */
function filterContentByKeywords(contents, keywords) {
    // 如果没有关键词，返回所有内容
    if (!keywords || keywords.length === 0) {
        return [...contents];
    }
    
    // 筛选包含关键词的内容
    return contents.filter(item => {
        const text = `${item.title} ${item.content} ${item.topics.join(' ')}`;
        return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    });
}

/**
 * 渲染结果
 */
function renderResults() {
    // 显示结果区域
    resultSection.style.display = 'block';
    
    // 渲染账号信息
    renderAccountInfo();
    
    // 渲染新增数据提示
    renderNewContentNotice();
    
    // 渲染内容列表
    renderContentList();
}

/**
 * 显示新增内容通知
 * @param {number} count - 新增内容数量
 */
function showNewContentNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'new-content-notification';
    notification.innerHTML = `
        <p>发现${count}条新内容！</p>
        <button id="sync-to-feishu" class="btn">同步到飞书多维表格</button>
    `;
    
    const accountInfoEl = document.getElementById('account-info');
    accountInfoEl.insertAdjacentElement('afterend', notification);
    
    // 绑定同步按钮事件
    document.getElementById('sync-to-feishu').addEventListener('click', async () => {
        const success = await syncToFeishu(newContentData);
        if (success) {
            alert('数据已成功同步到飞书多维表格');
            notification.remove();
        }
    });
}

/**
 * 渲染新增数据提示
 */
function renderNewContentNotice() {
    // 检查是否已存在通知元素，如果存在则移除
    const existingNotice = document.getElementById('new-content-notice');
    if (existingNotice) {
        existingNotice.remove();
    }
    
    // 创建新的通知元素
    const noticeEl = document.createElement('div');
    noticeEl.id = 'new-content-notice';
    noticeEl.className = 'new-content-notice';
    
    // 根据是否有新增数据设置不同的内容
    if (newContentData.length > 0) {
        noticeEl.innerHTML = `
            <div class="notice-content has-new">
                <div class="notice-icon">🔔</div>
                <div class="notice-text">
                    <p>检测到 <strong>${newContentData.length}</strong> 条新增内容</p>
                    <a href="https://nxrigsymta.feishu.cn/base/bascnRBgdnkxMBZsZZvZzZvHBjg" class="table-link" target="_blank">
                        <span>查看多维表格</span>
                        <span class="arrow">→</span>
                    </a>
                </div>
            </div>
        `;
    } else {
        noticeEl.innerHTML = `
            <div class="notice-content no-new">
                <div class="notice-icon">✓</div>
                <div class="notice-text">
                    <p>没有检测到新增内容</p>
                </div>
            </div>
        `;
    }
    
    // 将通知元素插入到账号信息之后
    const accountInfoEl = document.getElementById('account-info');
    accountInfoEl.after(noticeEl);
}

/**
 * 渲染账号信息
 */
function renderAccountInfo() {
    if (!accountData) return;
    
    accountInfoEl.innerHTML = `
        <img src="${accountData.avatar}" alt="${accountData.nickname}" class="account-avatar">
        <div class="account-details">
            <h3>${accountData.nickname}</h3>
            <p>@${accountData.username}</p>
            <p>${accountData.bio}</p>
            <p>
                <span>${accountData.followersCount} 关注者</span> · 
                <span>${accountData.followingCount} 关注中</span> · 
                <span>${accountData.postsCount} 动态</span>
            </p>
        </div>
    `;
}

/**
 * 渲染内容列表
 */
function renderContentList() {
    // 清空内容列表
    contentListEl.innerHTML = '';
    
    // 获取排序选项
    const sortOption = sortOptionSelect.value;
    
    // 获取是否只显示筛选结果
    const onlyShowFiltered = onlyShowFilteredCheckbox.checked;
    
    // 确定要显示的内容
    let displayContent = onlyShowFiltered ? filteredContent : contentData;
    
    // 排序内容
    displayContent = sortContent(displayContent, sortOption);
    
    // 如果没有内容
    if (displayContent.length === 0) {
        contentListEl.innerHTML = `<p class="no-content">没有找到符合条件的内容</p>`;
        return;
    }
    
    // 渲染内容卡片
    displayContent.forEach(item => {
        const isHighlighted = filteredContent.includes(item);
        const cardEl = createContentCard(item, isHighlighted);
        contentListEl.appendChild(cardEl);
    });
}

/**
 * 创建内容卡片
 * @param {Object} item - 内容项
 * @param {boolean} isHighlighted - 是否高亮显示
 * @returns {HTMLElement} - 卡片元素
 */
function createContentCard(item, isHighlighted) {
    const cardEl = document.createElement('div');
    cardEl.className = `content-card ${isHighlighted ? 'highlight' : ''}`;
    
    // 格式化日期
    const publishDate = new Date(item.publishTime);
    const formattedDate = publishDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 高亮关键词
    let highlightedContent = item.content;
    if (keywords.length > 0) {
        keywords.forEach(keyword => {
            if (keyword.trim()) {
                const regex = new RegExp(keyword, 'gi');
                highlightedContent = highlightedContent.replace(regex, match => 
                    `<span class="highlight-text">${match}</span>`
                );
            }
        });
    }
    
    // 构建卡片HTML
    cardEl.innerHTML = `
        <div class="card-header">
            <h3>${item.title}</h3>
            <span class="post-time">${formattedDate}</span>
        </div>
        <div class="card-body">
            <p>${highlightedContent}</p>
            ${item.hasImage ? `<img src="https://via.placeholder.com/300x200" alt="内容图片" class="content-image">` : ''}
            <div class="topics">
                ${item.topics.map(topic => `<span class="topic">#${topic}</span>`).join(' ')}
            </div>
        </div>
        <div class="card-footer">
            <div class="stats">
                <span><i>👍</i> ${item.likes}</span>
                <span><i>💬</i> ${item.comments}</span>
            </div>
            <a href="#" class="view-original" onclick="alert('这是一个演示，实际应用中会跳转到原始内容'); return false;">查看原文</a>
        </div>
    `;
    
    return cardEl;
}

/**
 * 排序内容
 * @param {Array} content - 内容数组
 * @param {string} option - 排序选项
 * @returns {Array} - 排序后的内容数组
 */
function sortContent(content, option) {
    const contentCopy = [...content];
    
    switch (option) {
        case 'time-desc':
            return contentCopy.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
        case 'time-asc':
            return contentCopy.sort((a, b) => new Date(a.publishTime) - new Date(b.publishTime));
        case 'likes-desc':
            return contentCopy.sort((a, b) => b.likes - a.likes);
        case 'comments-desc':
            return contentCopy.sort((a, b) => b.comments - a.comments);
        default:
            return contentCopy;
    }
}

/**
 * 清除结果
 */
function clearResults() {
    // 重置表单
    form.reset();
    
    // 清空数据
    accountData = null;
    contentData = [];
    filteredContent = [];
    keywords = [];
    newContentData = [];
    
    // 隐藏结果区域
    resultSection.style.display = 'none';
    
    // 清除本地存储的历史数据
    localStorage.removeItem('jikeAnalyzerHistory');
}

/**
 * 显示/隐藏加载状态
 * @param {boolean} show - 是否显示
 */
function showLoading(show) {
    loadingSection.style.display = show ? 'block' : 'none';
    analyzeBtn.disabled = show;
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
    alert(message);
}

/**
 * 从URL中提取用户名
 * @param {string} url - 账号链接
 * @returns {string} - 用户名
 */
function extractUsernameFromUrl(url) {
    // 尝试从URL中提取用户名或ID
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        
        // 移除空字符串
        const filteredParts = pathParts.filter(part => part.trim());
        
        // 如果有路径部分，返回最后一个作为用户名
        if (filteredParts.length > 0) {
            return filteredParts[filteredParts.length - 1];
        }
    } catch (e) {
        // 如果URL解析失败，尝试其他方法
    }
    
    // 如果无法提取，返回URL的一部分作为用户名
    return url.replace(/https?:\/\//, '').split('/')[0];
}

/**
 * 生成随机内容
 * @param {Array} topics - 主题数组
 * @returns {string} - 随机生成的内容
 */
function generateRandomContent(topics) {
    const sentences = [
        `今天研究了一下关于${topics[0]}的最新进展，发现了一些有趣的东西。`,
        `分享一下我对${topics.join('和')}的一些思考和见解。`,
        `最近在学习${topics[0]}相关的知识，感觉收获很多。`,
        `关于${topics[0]}，我有一些新的想法想和大家分享。`,
        `${topics[0]}领域正在发生一些有趣的变化，值得关注。`,
        `今天看到一篇关于${topics[0]}的文章，引发了我的一些思考。`,
        `${topics.join('、')}这些领域之间有什么联系？我尝试做了一些分析。`,
        `作为${topics[0]}爱好者，我想分享一些个人经验。`,
        `${topics[0]}的发展趋势值得我们关注，特别是与${topics[1] || '其他领域'}的交叉部分。`,
        `如果你也对${topics.join('或')}感兴趣，欢迎一起交流讨论。`
    ];
    
    // 随机选择2-4个句子
    const count = 2 + Math.floor(Math.random() * 3);
    const selected = [];
    
    for (let i = 0; i < count; i++) {
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        if (!selected.includes(sentence)) {
            selected.push(sentence);
        }
    }
    
    return selected.join(' ');
}
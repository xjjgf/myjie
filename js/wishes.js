/**
 * 新年祝福弹窗模块
 * 提供精美的新年祝福弹窗，可自定义内容和显示时机
 */

class NewYearWishes {
  constructor() {
    // 获取配置
    const cfg = window.config || { wishes: {} };
    this.config = cfg.wishes || {};
    
    // 默认配置
    this.showOnLoad = this.config.showOnLoad !== false; // 默认页面加载时显示
    this.delay = this.config.delay || 3000; // 延迟显示时间（毫秒）
    this.wishes = this.config.wishes || this.getDefaultWishes();
    
    // 状态
    this.wishIndex = 0;
    this.modal = null;
    
    // 初始化
    this.init();
  }
  
  // 初始化祝福弹窗
  init() {
    // 如果配置为页面加载时显示
    if (this.showOnLoad) {
      setTimeout(() => {
        this.showRandomWish();
      }, this.delay);
    }
    
    // 设置倒计时完成时显示祝福（如果存在倒计时）
    if (window.countdown && window.countdown.showCompletedMessage) {
      const originalMethod = window.countdown.showCompletedMessage;
      window.countdown.showCompletedMessage = () => {
        // 调用原始方法
        originalMethod.call(window.countdown);
        
        // 显示特别的新年祝福
        setTimeout(() => {
          this.showSpecialWish();
        }, 2000);
      };
    }
  }
  
  // 获取默认祝福语
  getDefaultWishes() {
    return [
      {
        title: '新年快乐！',
        message: '愿2026年带给你无尽的欢乐与幸福！',
        emoji: '🎉',
        color: '#ff0080'
      },
      {
        title: 'Happy New Year!',
        message: 'Wishing you prosperity and joy in 2026!',
        emoji: '🎊',
        color: '#00c3ff'
      },
      {
        title: '新年吉祥！',
        message: '身体健康，万事如意，财源滚滚！',
        emoji: '💰',
        color: '#ffd700'
      },
      {
        title: '新年快乐！',
        message: '新的一年，新的开始，新的希望！',
        emoji: '🌟',
        color: '#00ff88'
      }
    ];
  }
  
  // 显示随机祝福
  showRandomWish() {
    const randomIndex = Math.floor(Math.random() * this.wishes.length);
    this.wishIndex = randomIndex;
    this.showWish(this.wishes[randomIndex]);
  }
  
  // 显示特别的新年祝福
  showSpecialWish() {
    const specialWish = {
      title: '新年快乐！🎉',
      message: '2025已经过去，2026年正式来临！\n愿你在新的一年里梦想成真，万事如意！',
      emoji: '🎇',
      color: '#ff0080',
      special: true
    };
    this.showWish(specialWish);
  }
  
  // 显示指定祝福
  showWish(wish) {
    // 如果已经有弹窗存在，先移除
    if (this.modal) {
      this.removeModal();
    }
    
    // 创建弹窗元素
    this.createModal(wish);
    
    // 添加动画类
    setTimeout(() => {
      if (this.modal) {
        this.modal.classList.add('wish-modal-visible');
      }
    }, 10);
    
    // 为祝福添加烟花效果
    this.addWishFireworks();
    
    // 如果是特别祝福，添加额外效果
    if (wish.special) {
      this.addSpecialEffects();
    }
  }
  
  // 为祝福添加烟花效果
  addWishFireworks() {
    // 确保烟花实例存在
    if (!window.fireworks) return;
    
    // 发射多个烟花，形成壮观效果
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        window.fireworks.launchFirework(
          Math.random() * window.innerWidth,
          window.innerHeight,
          Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
          Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.15
        );
      }, i * 200);
    }
  }
  
  // 创建弹窗DOM结构
  createModal(wish) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'wish-overlay';
    overlay.onclick = () => this.closeModal();
    
    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.className = 'wish-modal';
    modal.style.setProperty('--wish-color', wish.color);
    
    // 阻止点击弹窗内容时关闭
    modal.onclick = (e) => e.stopPropagation();
    
    // 创建弹窗内容
    modal.innerHTML = `
      <div class="wish-emoji">${wish.emoji}</div>
      <h2 class="wish-title">${wish.title}</h2>
      <p class="wish-message">${wish.message.replace(/\\n/g, '<br>')}</p>
      <div class="wish-actions">
        <button class="wish-button wish-primary" onclick="window.newYearWishes.closeModal()">
          收下祝福
        </button>
        ${!wish.special ? 
          '<button class="wish-button wish-secondary" onclick="window.newYearWishes.showNextWish()">另一条祝福</button>' : ''
        }
      </div>
    `;
    
    // 添加到页面
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 存储引用
    this.modal = overlay;
    
    // 添加键盘事件
    document.addEventListener('keydown', this.handleKeydown);
  }
  
  // 显示下一条祝福
  showNextWish() {
    this.wishIndex = (this.wishIndex + 1) % this.wishes.length;
    this.showWish(this.wishes[this.wishIndex]);
  }
  
  // 关闭弹窗
  closeModal() {
    if (!this.modal) return;
    
    // 添加关闭动画
    this.modal.classList.remove('wish-modal-visible');
    this.modal.classList.add('wish-modal-closing');
    
    // 动画结束后移除
    setTimeout(() => {
      this.removeModal();
    }, 300);
  }
  
  // 移除弹窗
  removeModal() {
    if (!this.modal) return;
    
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown);
    
    // 移除DOM元素
    if (this.modal.parentNode) {
      document.body.removeChild(this.modal);
    }
    
    this.modal = null;
  }
  
  // 键盘事件处理
  handleKeydown = (e) => {
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }
  
  // 添加特别效果（用于倒计时结束时）
  addSpecialEffects() {
    // 添加粒子效果
    this.createConfetti();
    
    // 如果有雪花效果，增强雪花
    if (window.snowfall && window.snowfall.intensifySnowfall) {
      window.snowfall.intensifySnowfall(2);
    }
  }
  
  // 创建彩带动画效果
  createConfetti() {
    const colors = ['#ff0080', '#00c3ff', '#ffd700', '#00ff88', '#ffffff'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'wish-confetti';
      
      // 随机颜色和形状
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const rotation = Math.random() * 360;
      
      // 随机位置
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 3 + 2;
      
      // 设置样式
      confetti.style.backgroundColor = color;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.left = `${left}vw`;
      confetti.style.transform = `rotate(${rotation}deg)`;
      confetti.style.animation = `confetti-fall ${duration}s linear forwards`;
      confetti.style.animationDelay = `${delay}s`;
      
      // 添加到弹窗中
      if (this.modal) {
        this.modal.appendChild(confetti);
      }
      
      // 动画结束后移除
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, (duration + delay) * 1000);
    }
  }
  
  // 添加自定义祝福
  addWish(wish) {
    this.wishes.push(wish);
  }
}

// 当DOM加载完成后初始化祝福弹窗
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保config已加载
  setTimeout(() => {
    // 全局暴露祝福弹窗实例
    window.newYearWishes = new NewYearWishes();
  }, 100);
});

/**
 * 倒计时模块
 * 计算并显示从当前时间到目标时间的倒计时
 */

class Countdown {
  constructor(containerId = 'countdown-container') {
    // 获取配置
    const cfg = window.config || { countdown: {} };
    this.config = cfg.countdown || {};
    
    // 获取DOM元素
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('找不到倒计时容器元素');
      return;
    }
    
    this.targetDate = this.config.targetDate || new Date('2026-01-01T00:00:00');
    this.updateInterval = this.config.updateInterval || 1000;
    this.intervalId = null;
    
    // 创建倒计时DOM结构
    this.init();
  }
  
  // 初始化倒计时DOM结构
  init() {
    // 创建标题元素
    const title = document.createElement('h1');
    title.className = 'countdown-title';
    title.textContent = this.config.title || '2025 → 2026';
    this.container.appendChild(title);
    
    // 创建数字容器
    const numbersContainer = document.createElement('div');
    numbersContainer.className = 'countdown-numbers';
    this.container.appendChild(numbersContainer);
    
    // 创建各个倒计时项
    this.countdownItems = {
      days: this.createCountdownItem(numbersContainer, 'days', '天'),
      hours: this.createCountdownItem(numbersContainer, 'hours', '时'),
      minutes: this.createCountdownItem(numbersContainer, 'minutes', '分'),
      seconds: this.createCountdownItem(numbersContainer, 'seconds', '秒')
    };
    
    // 立即更新一次
    this.updateCountdown();
    
    // 开始定时器更新
    this.start();
  }
  
  // 创建单个倒计时项（数字和标签）
  createCountdownItem(parent, id, label) {
    const item = document.createElement('div');
    item.className = 'countdown-item';
    
    // 创建数字容器，添加边框和阴影效果
    const numberContainer = document.createElement('div');
    numberContainer.className = 'countdown-number-container';
    
    const number = document.createElement('div');
    number.id = `countdown-${id}`;
    number.className = 'countdown-number';
    number.textContent = '00';
    
    // 添加装饰元素
    const decoration = document.createElement('div');
    decoration.className = 'countdown-decoration';
    decoration.innerHTML = '✨';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'countdown-label';
    labelEl.textContent = label;
    
    numberContainer.appendChild(number);
    item.appendChild(numberContainer);
    item.appendChild(decoration);
    item.appendChild(labelEl);
    parent.appendChild(item);
    
    return {
      container: item,
      number,
      label: labelEl
    };
  }
  
  // 开始倒计时
  start() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, this.updateInterval);
  }
  
  // 停止倒计时
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  // 更新倒计时显示
  updateCountdown() {
    const now = new Date();
    const diff = this.targetDate - now;
    
    // 如果已经过了目标时间
    if (diff <= 0) {
      this.updateDisplay(0, 0, 0, 0);
      this.stop();
      this.showCompletedMessage();
      return;
    }
    
    // 计算剩余时间
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 计算总剩余秒数
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    
    // 当剩余时间≤60秒时，添加放大效果
    if (totalSeconds <= 60) {
      this.container.classList.add('countdown-large');
      
      // 每10秒增加一个更强的放大效果
      if (totalSeconds <= 10) {
        this.container.classList.add('countdown-huge');
      } else {
        this.container.classList.remove('countdown-huge');
      }
    } else {
      this.container.classList.remove('countdown-large', 'countdown-huge');
    }
    
    // 更新显示
    this.updateDisplay(days, hours, minutes, seconds);
  }
  
  // 更新DOM显示的数字
  updateDisplay(days, hours, minutes, seconds) {
    // 获取当前显示的数字
    const currentDays = parseInt(this.countdownItems.days.number.textContent);
    const currentHours = parseInt(this.countdownItems.hours.number.textContent);
    const currentMinutes = parseInt(this.countdownItems.minutes.number.textContent);
    const currentSeconds = parseInt(this.countdownItems.seconds.number.textContent);
    
    // 更新数字并添加动画效果
    if (currentDays !== days) {
      this.updateWithAnimation(this.countdownItems.days.number, this.formatNumber(days), 'countdown-bounce');
    } else {
      this.countdownItems.days.number.textContent = this.formatNumber(days);
    }
    
    if (currentHours !== hours) {
      this.updateWithAnimation(this.countdownItems.hours.number, this.formatNumber(hours), 'countdown-bounce');
    } else {
      this.countdownItems.hours.number.textContent = this.formatNumber(hours);
    }
    
    if (currentMinutes !== minutes) {
      this.updateWithAnimation(this.countdownItems.minutes.number, this.formatNumber(minutes), 'countdown-bounce');
    } else {
      this.countdownItems.minutes.number.textContent = this.formatNumber(minutes);
    }
    
    // 秒数总是添加脉冲动画
    this.updateWithAnimation(this.countdownItems.seconds.number, this.formatNumber(seconds), 'countdown-pulse');
  }
  
  // 添加动画效果的数字更新方法
  updateWithAnimation(element, newText, animationClass) {
    // 添加动画类
    element.classList.add(animationClass);
    
    // 更新文本
    element.textContent = newText;
    
    // 移除动画类以便下次触发
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 500);
  }
  
  // 格式化数字，确保两位数显示
  formatNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  // 显示倒计时完成的消息
  showCompletedMessage() {
    // 创建庆祝消息元素
    const celebrationMsg = document.createElement('div');
    celebrationMsg.className = 'celebration-message';
    celebrationMsg.innerHTML = `
      <h2>🎉 新年快乐！ 🎉</h2>
      <p>2025 → 2026</p>
      <p>愿你在新的一年里万事如意！</p>
    `;
    
    // 添加到容器并居中显示
    this.container.innerHTML = '';
    this.container.appendChild(celebrationMsg);
    
    // 添加闪烁动画
    celebrationMsg.classList.add('celebration-pulse');
    
    // 添加爆竹动画
    this.addFirecrackerAnimation();
    
    // 触发全屏烟花效果
      if (window.fireworks) {
        // 发射大量烟花庆祝，持续更长时间
        for (let i = 0; i < 80; i++) {
          setTimeout(() => {
            window.fireworks.launchFirework(
              Math.random() * window.innerWidth,
              window.innerHeight,
              Math.random() * window.innerWidth,
              Math.random() * window.innerHeight * 0.6,
              true
            );
          }, i * 50);
        }
        
        // 增强自动发射效果
        window.fireworks.intensifyAutoLaunch();
        
        // 持续发射更多烟花
        this.continuousFireworks = setInterval(() => {
          for (let i = 0; i < 8; i++) {
            window.fireworks.launchFirework(
              Math.random() * window.innerWidth,
              window.innerHeight,
              Math.random() * window.innerWidth,
              Math.random() * window.innerHeight * 0.6,
              true
            );
          }
        }, 600);
        
        // 90秒后停止持续发射，恢复正常自动发射
        setTimeout(() => {
          clearInterval(this.continuousFireworks);
          // 恢复正常自动发射
          window.fireworks.resetAutoLaunch();
        }, 90000);
      }
  }
  
  // 添加爆竹动画效果
  addFirecrackerAnimation() {
    const firecrackerCount = 50;
    
    // 初始爆发
    for (let i = 0; i < firecrackerCount; i++) {
      setTimeout(() => {
        this.createFirecracker();
      }, i * 100);
    }
    
    // 持续创建爆竹，持续60秒
    this.firecrackerInterval = setInterval(() => {
      // 每次发射3-5个爆竹
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.createFirecracker();
        }, i * 50);
      }
    }, 800);
    
    // 60秒后停止
    setTimeout(() => {
      clearInterval(this.firecrackerInterval);
    }, 60000);
  }
  
  // 创建单个爆竹
  createFirecracker() {
    // 限制同时存在的爆竹数量，优化性能
    const currentFirecrackers = document.querySelectorAll('.firecracker, .firecracker-explosion').length;
    if (currentFirecrackers > 100) {
      return;
    }
    
    const firecracker = document.createElement('div');
    firecracker.className = 'firecracker';
    
    // 随机选择爆竹类型
    const firecrackerTypes = ['🧨', '🎇', '🎆', '✨'];
    firecracker.innerHTML = firecrackerTypes[Math.floor(Math.random() * firecrackerTypes.length)];
    
    // 随机位置和样式
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 50;
    const endY = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.05;
    
    // 随机大小和速度
    const size = Math.random() * 25 + 15;
    const speed = Math.random() * 1 + 1.5;
    const rotationSpeed = Math.random() * 20 - 10;
    
    // 随机颜色
    const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    firecracker.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${size}px;
      color: ${color};
      z-index: 100;
      pointer-events: none;
      animation: firecracker-burst 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      animation-duration: ${2 + Math.random() * 2}s;
      animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
      transform-origin: center;
      will-change: transform, opacity;
    `;
    
    // 添加自定义属性用于动画
    firecracker.style.setProperty('--end-y', `${endY}px`);
    firecracker.style.setProperty('--rotation-speed', `${rotationSpeed}deg`);
    firecracker.style.setProperty('--size', `${size}px`);
    
    document.body.appendChild(firecracker);
    
    // 动画结束后移除
    setTimeout(() => {
      if (firecracker.parentNode) {
        firecracker.parentNode.removeChild(firecracker);
      }
    }, 4000);
    
    // 添加爆炸效果
    setTimeout(() => {
      this.createExplosion(startX, endY, color);
    }, (2 + Math.random() * 1) * 1000);
  }
  
  // 创建爆炸效果
  createExplosion(x, y, color) {
    const explosion = document.createElement('div');
    explosion.className = 'firecracker-explosion';
    
    // 随机选择爆炸类型
    const explosionTypes = ['💥', '✨', '🎇', '🎆'];
    explosion.innerHTML = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
    
    const size = Math.random() * 40 + 30;
    
    explosion.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}px;
      color: ${color};
      z-index: 101;
      pointer-events: none;
      animation: explosion 1s ease-out forwards;
      text-shadow: 0 0 20px ${color}, 0 0 40px ${color};
      transform-origin: center;
    `;
    
    document.body.appendChild(explosion);
    
    // 动画结束后移除
    setTimeout(() => {
      if (explosion.parentNode) {
        explosion.parentNode.removeChild(explosion);
      }
    }, 1000);
  }
}

// 当DOM加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保config已加载
  setTimeout(() => {
    // 检查页面是否包含倒计时容器
    if (document.getElementById('countdown-container')) {
      window.countdown = new Countdown();
    }
  }, 50);
});
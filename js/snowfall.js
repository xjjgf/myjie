/**
 * 雪花飘落动画模块
 * 创建逼真的雪花飘落效果，增强跨年氛围
 */

class Snowfall {
  constructor() {
    // 获取配置
    const cfg = window.config || { snowfall: {} };
    this.config = cfg.snowfall || {};
    
    // 默认配置
    this.snowflakeCount = this.config.count || 100;
    this.snowflakeSizeRange = this.config.sizeRange || [1, 8];
    this.fallSpeedRange = this.config.speedRange || [1, 5];
    this.windForce = this.config.windForce || 0.5;
    
    // 跟踪雪花元素和动画状态
    this.snowflakes = [];
    this.animationId = null;
    this.isPaused = false;
    
    // 初始化雪花
    this.init();
  }
  
  // 初始化雪花效果
  init() {
    // 获取或创建雪花容器
    this.container = document.getElementById('snow-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'snow-container';
      this.container.className = 'snow-container';
      document.body.appendChild(this.container);
    }
    
    // 设置容器样式
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '5';
    
    // 创建雪花
    for (let i = 0; i < this.snowflakeCount; i++) {
      this.createSnowflake();
    }
    
    // 开始动画
    this.animate();
  }
  
  // 创建单个雪花元素
  createSnowflake() {
    // 创建雪花元素
    const snowflake = document.createElement('div');
    
    // 随机大小
    const size = Math.random() * 
      (this.snowflakeSizeRange[1] - this.snowflakeSizeRange[0]) + 
      this.snowflakeSizeRange[0];
    
    // 随机下落速度
    const fallSpeed = Math.random() * 
      (this.fallSpeedRange[1] - this.fallSpeedRange[0]) + 
      this.fallSpeedRange[0];
    
    // 随机水平位置
    const startX = Math.random() * window.innerWidth;
    
    // 随机透明度
    const opacity = Math.random() * 0.8 + 0.2;
    
    // 设置雪花样式
    snowflake.innerHTML = '❄️'; // 雪花表情符号
    snowflake.style.position = 'absolute';
    snowflake.style.left = `${startX}px`;
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.opacity = opacity;
    snowflake.style.userSelect = 'none';
    snowflake.style.willChange = 'transform';
    
    // 添加到容器
    this.container.appendChild(snowflake);
    
    // 存储雪花状态
    this.snowflakes.push({
      element: snowflake,
      x: startX,
      y: -20,
      size: size,
      speed: fallSpeed,
      windOffset: 0,
      windPhase: Math.random() * Math.PI * 2, // 随机相位使雪花飘动不同步
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 2 // 随机旋转速度
    });
  }
  
  // 动画循环
  animate() {
    this.animationId = requestAnimationFrame(() => {
      if (this.isPaused) return;
      
      const now = Date.now() * 0.001; // 转换为秒
      
      this.snowflakes.forEach((snowflake, index) => {
        // 更新垂直位置（下落）
        snowflake.y += snowflake.speed;
        
        // 更新水平位置（随风飘动）
        snowflake.windPhase += 0.01;
        snowflake.windOffset = Math.sin(snowflake.windPhase) * this.windForce * snowflake.size;
        snowflake.x += snowflake.windOffset;
        
        // 更新旋转
        snowflake.rotation += snowflake.rotationSpeed;
        
        // 应用变换
        snowflake.element.style.transform = `translate(${snowflake.x}px, ${snowflake.y}px) rotate(${snowflake.rotation}deg)`;
        
        // 检查是否需要重置雪花位置
        if (snowflake.y > window.innerHeight + 20 || 
            snowflake.x < -100 || snowflake.x > window.innerWidth + 100) {
          // 移除旧雪花
          this.container.removeChild(snowflake.element);
          this.snowflakes.splice(index, 1);
          
          // 创建新雪花
          this.createSnowflake();
        }
      });
      
      // 继续动画循环
      this.animate();
    });
  }
  
  // 增加雪花密度（用于特殊时刻）
  intensifySnowfall(factor = 2) {
    const targetCount = this.snowflakeCount * factor;
    
    // 快速添加更多雪花
    for (let i = this.snowflakes.length; i < targetCount; i++) {
      this.createSnowflake();
    }
    
    // 5秒后恢复正常
    setTimeout(() => {
      this.normalizeSnowfall();
    }, 5000);
  }
  
  // 恢复正常雪花密度
  normalizeSnowfall() {
    // 如果雪花过多，移除一些
    while (this.snowflakes.length > this.snowflakeCount) {
      const snowflake = this.snowflakes.pop();
      if (snowflake && snowflake.element && snowflake.element.parentNode) {
        this.container.removeChild(snowflake.element);
      }
    }
  }
  
  // 暂停雪花动画
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.isPaused = true;
    }
  }
  
  // 恢复雪花动画
  resume() {
    if (this.isPaused && !this.animationId) {
      this.isPaused = false;
      this.animate();
    }
  }
  
  // 切换雪花显示状态
  toggleVisibility() {
    if (this.container) {
      if (this.container.style.display === 'none') {
        this.container.style.display = 'block';
        this.resume();
      } else {
        this.container.style.display = 'none';
        this.pause();
      }
    }
  }
}

// 当DOM加载完成后初始化雪花效果
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保config已加载
  setTimeout(() => {
    // 全局暴露雪花效果实例
    window.snowfall = new Snowfall();
    
    // 全局雪花切换函数
    window.toggleSnowfall = function() {
      if (window.snowfall) {
        window.snowfall.toggleVisibility();
      }
    };
    
    // 如果存在倒计时，可以在倒计时结束时增强雪花效果
    if (window.countdown) {
      // 这里可以扩展倒计时完成时的雪花特效
      const originalComplete = window.countdown.showCompletedMessage;
      window.countdown.showCompletedMessage = function() {
        // 调用原始方法
        originalComplete();
        // 增强雪花效果
        window.snowfall && window.snowfall.intensifySnowfall(3);
      };
    }
  }, 100);
});

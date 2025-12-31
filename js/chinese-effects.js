/**
 * 中国风特效增强脚本
 * 为跨年页面添加更多中国传统元素和交互效果
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 为中国结添加更自然的摆动效果
  animateChineseKnots();
  
  // 为灯笼添加更生动的动画
  animateLanterns();
  
  // 为龙年装饰元素添加动态效果
  animateDragonElements();
  
  // 为页面元素添加滚动渐显效果
  setupScrollAnimation();
  
  // 为按钮添加更丰富的悬停效果
  enhanceButtonEffects();
  
  // 检查是否为新年，如果是则显示特殊祝福
  checkNewYear();
});

/**
 * 为中国结添加自然摆动动画
 */
function animateChineseKnots() {
  const knots = document.querySelectorAll('.chinese-knot');
  knots.forEach((knot, index) => {
    // 每个中国结使用不同的动画参数
    const duration = 3 + Math.random() * 2;
    const delay = index * 0.5;
    
    knot.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    // 添加轻微旋转
    let rotation = -5 + Math.random() * 10;
    let rotationDirection = 1;
    
    setInterval(() => {
      rotation += rotationDirection * 0.5;
      if (Math.abs(rotation) > 10) {
        rotationDirection *= -1;
      }
      knot.style.transform = `rotate(${rotation}deg)`;
    }, 100);
  });
}

/**
 * 为灯笼添加生动的动画效果
 */
function animateLanterns() {
  const lanterns = document.querySelectorAll('.lantern');
  lanterns.forEach((lantern, index) => {
    // 创建随机的动画参数
    const duration = 3.5 + Math.random() * 1.5;
    const delay = index * 0.3;
    
    // 使用自定义灯笼摆动动画
    lantern.style.animation = `lantern-swing ${duration}s ease-in-out ${delay}s infinite`;
    
    // 添加亮度变化效果
    setInterval(() => {
      const brightness = 0.8 + Math.random() * 0.4;
      lantern.style.filter = `brightness(${brightness})`;
    }, 500);
  });
}

/**
 * 为龙年装饰元素添加动态效果
 */
function animateDragonElements() {
  const dragonElements = document.querySelectorAll('.chinese-dragon');
  
  if (dragonElements.length === 0) return;
  
  dragonElements.forEach(dragon => {
    // 已在CSS中添加了动画，这里添加一些JS控制的随机变化
    setInterval(() => {
      const scale = Math.random() * 0.1 + 0.95;
      const rotation = Math.random() * 4 - 2;
      
      dragon.style.transform = `translateX(-50%) rotate(${rotation}deg) scale(${scale})`;
    }, 3000);
  });
}

/**
 * 设置页面元素滚动渐显效果
 */
function setupScrollAnimation() {
  const elements = document.querySelectorAll('.new-year-title, .new-year-subtitle, .countdown-container, .action-buttons');
  
  // 初始设置透明度为0
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // 检查元素是否在视口中
  function checkVisibility() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;
      
      if (isVisible) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }
  
  // 初始检查
  checkVisibility();
  
  // 滚动时检查
  window.addEventListener('scroll', checkVisibility);
}

/**
 * 增强按钮交互效果
 */
function enhanceButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    // 鼠标悬停时的效果
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = this.style.boxShadow.replace('0 6px', '0 8px');
    });
    
    // 鼠标离开时的效果
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = this.style.boxShadow.replace('0 8px', '0 6px');
    });
    
    // 按钮点击时的效果
    btn.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = this.style.boxShadow.replace('0 8px', '0 2px');
    });
    
    // 按钮释放时的效果
    btn.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = this.style.boxShadow.replace('0 2px', '0 8px');
    });
  });
}

/**
 * 检查是否为新年，如果是则显示特殊祝福
 */
function checkNewYear() {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript月份从0开始
  const day = now.getDate();
  
  // 检查是否是1月1日
  if (month === 1 && day === 1) {
    setTimeout(() => {
      // 如果已经加载了祝福模块，则显示特别祝福
      if (window.newYearWishes && window.newYearWishes.showRandomWish) {
        window.newYearWishes.showRandomWish('special');
      }
    }, 1000);
  }
}

/**
 * 创建传统中国风粒子效果
 * @param {number} x - 起始X坐标
 * @param {number} y - 起始Y坐标
 * @param {number} count - 粒子数量
 * @param {string} color - 粒子颜色
 */
window.createChineseParticleEffect = function(x, y, count = 15, color = '#ECC94B') {
  const container = document.body;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    
    // 设置粒子样式
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '100';
    
    // 随机角度和速度
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    // 添加粒子到容器
    container.appendChild(particle);
    
    // 粒子动画
    let animationId;
    let currentX = x;
    let currentY = y;
    let lifetime = 60 + Math.random() * 40;
    
    function animate() {
      lifetime--;
      if (lifetime <= 0) {
        container.removeChild(particle);
        return;
      }
      
      // 更新位置
      currentX += vx;
      currentY += vy;
      
      // 应用重力
      vy += 0.1;
      
      // 应用空气阻力
      vx *= 0.99;
      vy *= 0.99;
      
      // 更新粒子样式
      particle.style.left = `${currentX}px`;
      particle.style.top = `${currentY}px`;
      particle.style.opacity = lifetime / 100;
      particle.style.transform = `scale(${lifetime / 100})`;
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
  }
};

// 为按钮点击添加粒子效果
// 点击效果已集成到enhanceButtonEffects函数中

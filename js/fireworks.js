/**
 * 烟花效果模块
 * 使用Canvas实现高性能烟花动画，支持自动发射和点击触发
 */

class Fireworks {
  constructor(canvasId = 'fireworks-canvas') {
    // 获取配置
    const cfg = window.config || { fireworks: {}, sound: {} };
    this.config = cfg.fireworks || {};
    this.soundConfig = cfg.sound || {};
    
    // 获取Canvas元素
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('找不到烟花Canvas元素');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];     // 存储发射中的烟花
    this.particles = [];     // 存储爆炸后的粒子
    this.animationId = null; // 动画帧ID
    this.audioContext = null;
    
    // 初始化
    this.init();
  }
  
  // 初始化Canvas和事件监听
  init() {
    // 设置Canvas尺寸
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // 点击事件监听
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    
    // 初始化音频上下文（延迟到用户交互后）
    this.canvas.addEventListener('click', () => this.initAudio(), { once: true });
    
    // 开始动画循环
    this.startAnimation();
    
    // 开始自动发射烟花
    this.startAutoLaunch();
  }
  
  // 调整Canvas尺寸以适应屏幕
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  // 初始化音频上下文
  initAudio() {
    if (!this.soundConfig.enabled) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API不受支持:', e);
    }
  }
  
  // 开始动画循环
  startAnimation() {
    const animate = () => {
      // 清空画布
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 限制同时存在的粒子数量，优化性能
      if (this.particles.length > 1500) {
        this.particles = this.particles.slice(-1500);
      }
      
      // 更新和绘制烟花
      this.updateFireworks();
      
      // 更新和绘制粒子
      this.updateParticles();
      
      // 继续动画
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // 开始自动发射烟花
  startAutoLaunch() {
    this.autoLaunchInterval = setInterval(() => {
      // 每次发射3-5个烟花，增加烟花数量
      const count = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.launchFirework(
            Math.random() * this.canvas.width,
            this.canvas.height,
            Math.random() * this.canvas.width,
            Math.random() * (this.canvas.height * 0.6) + this.canvas.height * 0.05
          );
        }, i * 100);
      }
    }, this.config.launchInterval || 800); // 保持合适的发射间隔
  }
  
  // 增强自动发射效果
  intensifyAutoLaunch() {
    // 清除原有定时器
    if (this.autoLaunchInterval) {
      clearInterval(this.autoLaunchInterval);
    }
    
    // 增加发射频率和数量
    this.autoLaunchInterval = setInterval(() => {
      // 每次发射5-8个烟花
      const count = 5 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.launchFirework(
            Math.random() * this.canvas.width,
            this.canvas.height,
            Math.random() * this.canvas.width,
            Math.random() * (this.canvas.height * 0.6) + this.canvas.height * 0.05
          );
        }, i * 80);
      }
    }, this.config.launchInterval || 500); // 缩短发射间隔
  }
  
  // 重置自动发射效果
  resetAutoLaunch() {
    // 清除原有定时器
    if (this.autoLaunchInterval) {
      clearInterval(this.autoLaunchInterval);
    }
    
    // 重新开始标准自动发射
    this.startAutoLaunch();
  }
  
  // 发射烟花
  launchFirework(x, y, targetX, targetY, isManual = false) {
    const firework = {
      x,
      y,
      targetX,
      targetY,
      dx: (targetX - x) / 60, // 60帧到达目标
      dy: (targetY - y) / 60,
      color: this.getRandomColor(),
      isManual
    };
    
    this.fireworks.push(firework);
    
    // 增加音效播放频率，增强听觉效果
    if (isManual || Math.random() > 0.5) {
      this.playSound();
    }
  }
  
  // 更新烟花
  updateFireworks() {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const firework = this.fireworks[i];
      
      // 更新位置
      firework.x += firework.dx;
      firework.y += firework.dy;
      
      // 绘制烟花（发射轨迹）
      this.ctx.beginPath();
      this.ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgb(${firework.color[0]}, ${firework.color[1]}, ${firework.color[2]})`;
      this.ctx.fill();
      
      // 检查是否到达目标位置
      const dx = firework.targetX - firework.x;
      const dy = firework.targetY - firework.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        // 爆炸
        this.explode(firework.x, firework.y, firework.color, firework.isManual);
        // 播放音效
        if (firework.isManual) {
          this.playSound();
        }
        // 移除烟花
        this.fireworks.splice(i, 1);
      }
    }
  }
  
  // 烟花爆炸
  explode(x, y, color, isManual = false) {
    // 增加粒子数量，让烟花更壮观
    const particleCount = isManual ? (this.config.particleCount || 150) : (this.config.particleCount || 120);
    const brightness = isManual ? (this.config.manualFireworkBrightness || 2) : 1;
    
    // 增加爆炸类型
    const explosionTypes = ['circle', 'random', 'star', 'flower'];
    const explosionType = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
    
    for (let i = 0; i < particleCount; i++) {
      let angle, speed;
      
      // 根据爆炸类型计算角度
      if (explosionType === 'circle') {
        angle = (i / particleCount) * Math.PI * 2;
      } else if (explosionType === 'star') {
        // 星形爆炸，8个方向
        const starAngles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        angle = starAngles[Math.floor((i / particleCount) * starAngles.length)] + (Math.random() - 0.5) * 0.5;
      } else if (explosionType === 'flower') {
        // 花形爆炸，6个花瓣
        const flowerAngles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];
        angle = flowerAngles[Math.floor((i / particleCount) * flowerAngles.length)] + (Math.random() - 0.5) * 0.7;
      } else {
        // 随机角度
        angle = Math.random() * Math.PI * 2;
      }
      
      // 增加速度范围，让烟花更有层次感
      speed = (this.config.minSpeed || 1.5) + Math.random() * ((this.config.maxSpeed || 10) - (this.config.minSpeed || 1.5));
      
      // 增加随机性，让烟花更自然
      angle += (Math.random() - 0.5) * 0.4;
      speed *= 0.8 + Math.random() * 0.4;
      
      // 增强颜色变化
      const colorVariation = () => {
        const base = color[i % 3] * brightness;
        return Math.max(0, Math.min(255, base + (Math.random() - 0.5) * 100));
      };
      
      // 增加粒子类型
      const particleTypes = ['normal', 'sparkle', 'trail'];
      const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      const particle = {
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: [
          colorVariation(),
          colorVariation(),
          colorVariation()
        ],
        life: (this.config.particleLifetime || 70) + Math.random() * 30,
        maxLife: (this.config.particleLifetime || 70) + Math.random() * 30,
        gravity: 0.01 + Math.random() * 0.04,
        size: particleType === 'sparkle' ? 2 + Math.random() * 3 : 1 + Math.random() * 2.5,
        sparkle: particleType === 'sparkle',
        trail: particleType === 'trail', // 启用轨迹效果
        type: particleType
      };
      
      this.particles.push(particle);
    }
  }
  
  // 更新粒子
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // 更新位置
      particle.x += particle.dx;
      particle.y += particle.dy;
      
      // 应用重力
      particle.dy += particle.gravity;
      
      // 减少生命值
      particle.life--;
      
      // 计算透明度和大小变化
      const alpha = particle.life / particle.maxLife;
      const size = Math.max(0, particle.size * alpha); // 确保半径不会为负数
      
      // 绘制粒子光晕效果
      if (particle.sparkle && size > 0) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha * 0.3})`;
        this.ctx.fill();
      }
      
      // 绘制粒子
      if (size > 0) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha})`;
        this.ctx.fill();
      }
      
      // 绘制轨迹
      if (particle.trail) {
        const trailLength = 10;
        const trailX = particle.x - particle.dx * trailLength;
        const trailY = particle.y - particle.dy * trailLength;
        
        this.ctx.beginPath();
        this.ctx.moveTo(trailX, trailY);
        this.ctx.lineTo(particle.x, particle.y);
        this.ctx.strokeStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha * 0.5})`;
        this.ctx.lineWidth = size * 0.5;
        this.ctx.stroke();
      }
      
      // 移除死亡粒子
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  // 获取随机颜色
  getRandomColor() {
    const colors = this.config.colors || [[255, 255, 255]];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // 播放烟花音效
  playSound() {
    if (!this.audioContext || !this.soundConfig.enabled) return;
    
    try {
      // 解锁音频上下文（某些浏览器需要）
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // 创建振荡器
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 设置音频参数
      const minFreq = this.soundConfig.minFrequency || 80;
      const maxFreq = this.soundConfig.maxFrequency || 120;
      const frequency = minFreq + Math.random() * (maxFreq - minFreq);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      // 设置音量包络
      const volume = this.soundConfig.volume || 0.5;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      // 播放音效
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn('播放音效失败:', e);
    }
  }
  
  // 点击事件处理
  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 在点击位置发射烟花
    this.launchFirework(
      this.canvas.width / 2,
      this.canvas.height,
      x,
      y,
      true
    );
  }
  
  // 销毁方法（清理资源）
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.fireworks = [];
    this.particles = [];
  }
}

// 当DOM加载完成后初始化烟花
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保config已加载
  setTimeout(() => {
    window.fireworks = new Fireworks();
  }, 50);
});
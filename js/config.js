/**
 * 跨年静态站点 - 配置文件
 * 所有可定制的变量都集中在这里，方便用户修改
 */

const config = {
  // 烟花配置
  fireworks: {
    // 烟花颜色数组（RGB格式）
    colors: [
      [255, 0, 0],     // 红色
      [0, 255, 0],     // 绿色
      [0, 0, 255],     // 蓝色
      [255, 255, 0],   // 黄色
      [255, 0, 255],   // 紫色
      [0, 255, 255],   // 青色
      [255, 165, 0],   // 橙色
      [255, 192, 203]  // 粉色
    ],
    // 自动发射烟花的间隔时间（毫秒）
    launchInterval: 1000,
    // 烟花爆炸粒子数量
    particleCount: 100,
    // 粒子最小/最大速度
    minSpeed: 1,
    maxSpeed: 5,
    // 粒子生命周期（帧）
    particleLifetime: 60,
    // 手动点击烟花的亮度倍率
    manualFireworkBrightness: 2
  },
  
  // 倒计时配置
  countdown: {
    // 目标日期时间（2026年元旦）
    targetDate: new Date('2026-01-01T00:00:00'),
    // 倒计时更新间隔（毫秒）
    updateInterval: 1000,
    // 标题文本
    title: '2025 → 2026'
  },
  
  // 音效配置
  sound: {
    // 是否开启音效
    enabled: true,
    // 音效音量 (0-1)
    volume: 0.5,
    // 烟花爆炸音效频率范围（Hz）
    minFrequency: 80,
    maxFrequency: 120,
    // 音效持续时间（毫秒）
    duration: 300
  },
  
  // 新年祝福弹窗配置
  wishes: {
    showOnLoad: true, // 是否在页面加载时显示
    delay: 3000, // 延迟显示时间（毫秒）
    wishes: [ // 自定义祝福内容
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
    ]
  },
  
  // 节日装饰配置
  decorations: {
    showSnowfall: true,        // 是否显示雪花
    showDecorations: true,     // 是否显示节日装饰
    celebrationMode: true      // 是否启用庆祝模式
  },
  
  // 雪花效果配置
  snowfall: {
    count: 100,                // 雪花数量
    sizeRange: [1, 8],         // 雪花大小范围（像素）
    speedRange: [1, 5],        // 下落速度范围
    windForce: 0.5             // 风力影响因子
  },
  
  // 相册配置
  gallery: {
    // 支持的图片文件扩展名
    allowedExtensions: ['.jpg', '.jpeg', '.png'],
    // 缩略图加载失败时显示的颜色
    fallbackColor: '#333333',
    // 图片排序方式：'name'按文件名，'random'随机
    sortOrder: 'name'
  }
};

// 导出配置对象
try {
  module.exports = config;
} catch (e) {
  // 浏览器环境下直接使用全局变量
  window.config = config;
}
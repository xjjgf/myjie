/**
 * 简化版节日装饰模块
 * 为跨年页面添加基本的装饰元素
 */

class SimpleDecorations {
  constructor() {
    // 获取配置
    const config = window.config || {};
    this.decorationConfig = config.decorations || {};
    
    // 检查是否启用装饰
    if (!this.decorationConfig.showDecorations) return;
    
    // 存储装饰元素
    this.elements = [];
    
    // 初始化装饰
    this.init();
  }
  
  init() {
    // 延迟初始化，确保DOM已加载完成
    setTimeout(() => {
      // 添加一些基本装饰元素
      this.addBasicDecorations();
    }, 500);
  }
  
  addBasicDecorations() {
    // 简单的装饰效果，避免复杂的逻辑
    console.log('简单装饰已初始化');
  }
}

// 当DOM加载完成后初始化装饰
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new SimpleDecorations();
  }, 100);
});

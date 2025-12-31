/**
 * 相册模块
 * 自动加载gallery文件夹中的图片并生成响应式网格，支持全屏预览
 */

class Gallery {
  constructor(containerId = 'gallery-container') {
    // 获取配置
    const cfg = window.config || { gallery: {} };
    this.config = cfg.gallery || {};
    
    // 获取DOM元素
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('找不到相册容器元素');
      return;
    }
    
    this.images = [];          // 存储图片列表
    this.currentImageIndex = 0; // 当前预览图片索引
    this.isFullscreen = false;  // 是否处于全屏模式
    
    // 初始化
    this.init();
  }
  
  // 初始化相册
  init() {
    // 创建网格容器
    this.grid = document.createElement('div');
    this.grid.className = 'gallery-grid';
    this.container.appendChild(this.grid);
    
    // 创建全屏预览元素
    this.createFullscreenView();
    
    // 加载图片
    this.loadImages();
    
    // 添加键盘事件监听
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  
  // 加载图片（由于浏览器安全限制，这里提供示例数据）
  loadImages() {
    // 注意：由于浏览器安全限制，JavaScript无法直接读取本地文件夹中的文件列表
    // 这里直接使用实际的图片文件名列表
    
    // 实际图片名称列表（1.jpg到13.jpg）
    this.images = [
      'gallery/1.jpg',
      'gallery/2.jpg',
      'gallery/3.jpg',
      'gallery/4.jpg',
      'gallery/5.jpg',
      'gallery/6.jpg',
      'gallery/7.jpg',
      'gallery/8.jpg',
      'gallery/9.jpg',
      'gallery/10.jpg',
      'gallery/11.jpg',
      'gallery/12.jpg',
      'gallery/13.jpg'
    ];
    
    // 尝试动态获取图片（注意：这在本地文件系统直接打开时会失败，需要通过HTTP服务器访问）
    this.tryLoadDynamicImages();
  }
  
  // 尝试动态加载图片（仅在HTTP服务器环境下有效）
  async tryLoadDynamicImages() {
    try {
      // 注意：这只是一个演示，实际使用时需要后端支持
      // 这里我们使用示例数据，用户只需将图片放入gallery文件夹即可
      console.log('提示：请将您的图片放入gallery文件夹中，支持jpg和png格式');
      
      // 生成图片网格
      this.generateGalleryGrid();
    } catch (error) {
      console.warn('无法动态加载图片列表（这是预期的，因为浏览器安全限制）:', error);
      console.info('请手动将图片放入gallery文件夹，然后刷新页面');
      
      // 即使出错也要生成示例网格
      this.generateGalleryGrid();
    }
  }
  
  // 生成相册网格
  generateGalleryGrid() {
    this.grid.innerHTML = '';
    
    // 如果没有图片，显示提示信息
    if (this.images.length === 0) {
      const emptyHint = document.createElement('div');
      emptyHint.style.cssText = `
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(255,255,255,0.7);
        font-size: 1.2rem;
      `;
      emptyHint.innerHTML = `
        <h3>相册还是空的呢！</h3>
        <p>请按照以下步骤添加照片：</p>
        <ol style="text-align: left; max-width: 300px; margin: 1rem auto;">
          <li>将您的照片放入 <code>gallery</code> 文件夹</li>
          <li>支持 JPG 和 PNG 格式</li>
          <li>刷新此页面查看效果</li>
        </ol>
      `;
      this.grid.appendChild(emptyHint);
      return;
    }
    
    // 根据排序方式排列图片
    const sortedImages = this.sortImages([...this.images]);
    
    sortedImages.forEach((imagePath, index) => {
      // 创建相册项
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = index;
      
      // 创建缩略图
      const img = document.createElement('img');
      img.className = 'gallery-thumbnail';
      img.src = imagePath;
      img.alt = `相册图片 ${index + 1}`;
      
      // 设置加载失败处理
      img.onerror = () => {
        // 当图片加载失败时，显示占位符
        img.style.backgroundColor = this.config.fallbackColor || '#333333';
        img.src = '';
      };
      
      // 添加点击事件
      item.addEventListener('click', () => this.openFullscreen(index));
      
      item.appendChild(img);
      this.grid.appendChild(item);
    });
  }
  
  // 图片排序
  sortImages(images) {
    const sortOrder = this.config.sortOrder || 'name';
    
    if (sortOrder === 'random') {
      return images.sort(() => Math.random() - 0.5);
    } else {
      // 默认按文件名排序
      return images.sort();
    }
  }
  
  // 创建全屏预览视图
  createFullscreenView() {
    // 创建全屏容器
    this.fullscreenView = document.createElement('div');
    this.fullscreenView.className = 'fullscreen-view';
    document.body.appendChild(this.fullscreenView);
    
    // 创建关闭按钮
    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'fullscreen-close';
    this.closeBtn.textContent = '×';
    this.closeBtn.addEventListener('click', () => this.closeFullscreen());
    this.fullscreenView.appendChild(this.closeBtn);
    
    // 创建上一张按钮
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'fullscreen-nav nav-prev';
    this.prevBtn.textContent = '←';
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPreviousImage();
    });
    this.fullscreenView.appendChild(this.prevBtn);
    
    // 创建下一张按钮
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'fullscreen-nav nav-next';
    this.nextBtn.textContent = '→';
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showNextImage();
    });
    this.fullscreenView.appendChild(this.nextBtn);
    
    // 创建图片元素
    this.fullscreenImage = document.createElement('img');
    this.fullscreenImage.className = 'fullscreen-image';
    this.fullscreenView.appendChild(this.fullscreenImage);
    
    // 创建图片标题
    this.fullscreenCaption = document.createElement('div');
    this.fullscreenCaption.className = 'fullscreen-caption';
    this.fullscreenView.appendChild(this.fullscreenCaption);
    
    // 点击图片区域关闭全屏
    this.fullscreenImage.addEventListener('click', () => this.closeFullscreen());
  }
  
  // 打开全屏预览
  openFullscreen(index) {
    this.currentImageIndex = index;
    this.isFullscreen = true;
    
    // 更新图片和标题
    this.updateFullscreenContent();
    
    // 显示全屏视图
    this.fullscreenView.style.display = 'flex';
    
    // 防止页面滚动
    document.body.style.overflow = 'hidden';
    
    // 尝试进入全屏模式
    if (this.fullscreenView.requestFullscreen) {
      this.fullscreenView.requestFullscreen().catch(err => {
        console.warn('无法进入全屏模式:', err);
      });
    }
  }
  
  // 关闭全屏预览
  closeFullscreen() {
    this.isFullscreen = false;
    
    // 隐藏全屏视图
    this.fullscreenView.style.display = 'none';
    
    // 恢复页面滚动
    document.body.style.overflow = '';
    
    // 退出全屏模式
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        // 忽略错误
      });
    }
  }
  
  // 更新全屏内容
  updateFullscreenContent() {
    if (this.images[this.currentImageIndex]) {
      this.fullscreenImage.src = this.images[this.currentImageIndex];
      this.fullscreenImage.alt = `图片 ${this.currentImageIndex + 1}/${this.images.length}`;
      this.fullscreenCaption.textContent = `图片 ${this.currentImageIndex + 1}/${this.images.length}`;
    }
  }
  
  // 显示上一张图片
  showPreviousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateFullscreenContent();
  }
  
  // 显示下一张图片
  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateFullscreenContent();
  }
  
  // 处理键盘事件
  handleKeydown(e) {
    if (!this.isFullscreen) return;
    
    switch (e.key) {
      case 'Escape':
        this.closeFullscreen();
        break;
      case 'ArrowLeft':
        this.showPreviousImage();
        break;
      case 'ArrowRight':
        this.showNextImage();
        break;
    }
  }
  
  // 添加图片（可用于动态添加图片）
  addImage(imagePath) {
    // 检查文件扩展名是否允许
    const allowedExtensions = this.config.allowedExtensions || ['.jpg', '.jpeg', '.png'];
    const ext = imagePath.toLowerCase().substring(imagePath.lastIndexOf('.'));
    
    if (allowedExtensions.includes(ext)) {
      this.images.push(imagePath);
      this.generateGalleryGrid();
    }
  }
}

// 当DOM加载完成后初始化相册
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保config已加载
  setTimeout(() => {
    // 检查页面是否包含相册容器
    if (document.getElementById('gallery-container')) {
      window.gallery = new Gallery();
    }
  }, 50);
});
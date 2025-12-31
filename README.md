# 跨年静态站点

这是一个纯前端的跨年倒计时和相册静态站点，使用原生HTML/CSS/JavaScript实现，无需后端支持，可直接部署到GitHub Pages。

## 功能特点

- 🎆 全屏烟花背景效果，支持自动燃放和点击触发
- ⏱️ 实时倒计时到2026年元旦
- 📷 响应式相册功能，支持全屏预览
- 🎵 点击烟花时的音效反馈
- 📱 完全适配移动端和桌面端
- 🎨 易于定制的颜色和参数

## 本地预览

1. 下载或克隆本项目
2. 直接双击 `index.html` 文件在浏览器中打开
3. 或者使用任何静态文件服务器（如VSCode的Live Server插件）

## 添加照片到相册

1. 将您的照片（支持jpg和png格式）放入项目根目录的 `gallery` 文件夹中
2. 刷新 `gallery.html` 页面，照片将自动显示在相册中
3. 点击照片可进入全屏预览模式，支持左右箭头切换和ESC退出

## 发布到GitHub Pages

### 方法一：通过GitHub网站（推荐新手）

1. 在GitHub上创建一个新的仓库
2. 点击「上传文件」按钮，将项目所有文件上传到仓库
3. 上传完成后，进入仓库的「Settings」页面
4. 向下滚动找到「GitHub Pages」部分
5. 在「Source」下拉菜单中选择「main」分支
6. 点击「Save」按钮
7. 等待几秒钟，刷新页面，即可看到您的网站地址！

### 方法二：使用Git命令行

```bash
# 初始化Git仓库
git init

# 添加远程仓库
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 推送到GitHub
git push -u origin master
```

然后按照方法一中的步骤3-7开启GitHub Pages功能。

## 自定义配置

打开 `js/config.js` 文件，您可以自定义以下参数：

- **烟花颜色**：修改 `fireworks.colors` 数组
- **倒计时目标日期**：修改 `countdown.targetDate`
- **音效开关**：修改 `sound.enabled` 为 `false` 可关闭音效
- **相册排序**：修改 `gallery.sortOrder` 为 `"random"` 可随机排序

## 目录结构

```
项目根目录/
├── index.html          # 首页（倒计时页面）
├── gallery.html        # 相册页面
├── css/
│   └── style.css       # 共用样式文件
├── js/
│   ├── config.js       # 配置文件
│   ├── fireworks.js    # 烟花效果
│   ├── countdown.js    # 倒计时功能
│   └── gallery.js      # 相册功能
├── gallery/            # 存放照片的文件夹
└── README.md           # 使用说明（当前文件）
```

## 技术说明

- 使用HTML5 Canvas实现高性能烟花动画
- 使用Web Audio API生成烟花音效
- 完全响应式设计，适配各种屏幕尺寸
- 无依赖，纯原生代码实现
- 支持现代浏览器：Chrome、Firefox、Edge、Safari

## 注意事项

1. 请勿直接删除任何文件或文件夹，否则可能导致功能失效
2. 照片文件不要过大，建议压缩后再放入gallery文件夹
3. 在某些浏览器中，由于安全限制，直接打开本地文件可能无法正常使用某些功能，建议通过HTTP服务器访问

祝您新年快乐！🎉
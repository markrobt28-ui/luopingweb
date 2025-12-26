# 飘飘洒洒 - 智能小工具

基于 React + Vite + Tailwind CSS 开发的现代化前端项目，采用卡片式布局展示 20 个智能工具。

## 技术栈

- **框架**: React 18.3
- **构建工具**: Vite 5.4
- **路由**: React Router DOM 6.22
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **图标**: Font Awesome 6.4 + Lucide React 0.344
- **语言**: TypeScript 5.6

## 项目结构

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── src/
│   ├── main.tsx           # 应用入口
│   ├── App.tsx            # 根组件
│   ├── index.css          # 全局样式
│   ├── components/        # 公共组件
│   │   ├── Header.tsx     # 顶部导航
│   │   ├── Footer.tsx     # 页脚
│   │   ├── ContactButton.tsx  # 咨询按钮
│   │   └── ToolCard.tsx   # 工具卡片组件
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 首页
│   │   ├── ToolLibrary.tsx  # 工具库页
│   │   └── About.tsx     # 关于我
│   └── data/              # 数据文件
│       └── tools.ts       # 工具数据（20个工具）
```

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## 功能特性

### 首页
- 科技感设计风格
- 首屏大标题展示
- 精选工具展示（6个）
- 平滑滚动动画

### 工具库
- 20个工具卡片展示
- 分类筛选功能（7个分类）
- 卡片悬停动画效果
- 响应式网格布局

### 关于我
- 个人介绍
- 三个操作按钮（免费咨询、工具下载、加入社群）

### 通用特性
- 响应式设计（移动端/平板/桌面）
- 科技感背景和网格线效果
- 流畅的动画和过渡效果
- 玻璃拟态卡片设计
- 渐变按钮和发光效果

## 工具数据配置

编辑 `src/data/tools.ts` 文件可以修改工具数据：

```typescript
export const tools = [
  {
    id: '1',
    name: '工具名称',
    description: '工具描述',
    icon: 'fa-icon-name',
    category: '分类名称',
    link: '跳转链接（可选）',
    rating: 5, // 1-5星
  },
  // ... 更多工具
];
```

## 样式主题

项目使用自定义主题颜色，可在 `tailwind.config.js` 中修改：

```javascript
colors: {
  primary: {
    blue: '#0a192f',      // 深蓝背景
    secondary: '#112240',  // 深蓝卡片
    accent: '#64ffda',      // 蓝绿色点缀
    gold: '#ffd700',       // 金色点缀
  },
  text: {
    light: '#ccd6f6',      // 浅色文字
    muted: '#8892b0',      // 次要文字
    highlight: '#e6f1ff',  // 高亮文字
  },
}
```

## 路由

- `/` - 首页
- `/tools` - 工具库
- `/about` - 关于我

## API 代理

开发环境下，前端通过 Vite 代理到后端 API：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 开发建议

1. **添加新工具**: 在 `src/data/tools.ts` 中添加新的工具对象
2. **修改样式**: 编辑 `src/index.css` 或 `tailwind.config.js`
3. **添加新页面**: 在 `src/pages/` 下创建新组件并在 `App.tsx` 中添加路由
4. **修改组件**: 在 `src/components/` 下修改或创建新组件

## 许可证

MIT

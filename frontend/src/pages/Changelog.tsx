import { motion } from 'framer-motion';

const Changelog = () => {
  const updates = [
    {
      version: 'v1.0.0',
      date: '2024-12-24',
      type: 'major',
      changes: [
        {
          category: '🎉 新功能',
          items: [
            '全新的现代化UI设计，采用深色主题和玻璃态效果',
            '博客系统上线，支持文章发布、标签分类和评论功能',
            '用户认证系统，支持注册、登录和个人中心',
            '管理后台，支持用户管理、工具管理和博客管理',
            '10+实用在线工具集成',
          ],
        },
        {
          category: '🎨 设计优化',
          items: [
            '震撼的视觉效果和动画',
            '流畅的页面过渡动画',
            '响应式设计，完美适配移动端',
            '优化的色彩方案和渐变效果',
          ],
        },
        {
          category: '⚡ 性能提升',
          items: [
            '使用 Vite 构建，极速开发体验',
            '代码分割和懒加载',
            '优化的资源加载策略',
          ],
        },
      ],
    },
    {
      version: 'v0.9.0',
      date: '2024-12-20',
      type: 'minor',
      changes: [
        {
          category: '✨ 功能改进',
          items: [
            '优化工具卡片展示效果',
            '添加工具分类筛选',
            '改进搜索功能',
          ],
        },
        {
          category: '🐛 Bug修复',
          items: [
            '修复移动端菜单显示问题',
            '修复部分工具链接错误',
            '优化页面加载速度',
          ],
        },
      ],
    },
    {
      version: 'v0.8.0',
      date: '2024-12-15',
      type: 'minor',
      changes: [
        {
          category: '🔧 技术升级',
          items: [
            '升级到 React 18',
            '集成 Framer Motion 动画库',
            '使用 Tailwind CSS 3.0',
          ],
        },
        {
          category: '📝 文档',
          items: [
            '添加 API 文档',
            '完善部署指南',
            '添加开发文档',
          ],
        },
      ],
    },
    {
      version: 'v0.5.0',
      date: '2024-12-10',
      type: 'minor',
      changes: [
        {
          category: '🎯 初始版本',
          items: [
            '基础框架搭建',
            '首页和工具库页面',
            '基础工具集成',
          ],
        },
      ],
    },
  ];

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
      case 'minor':
        return 'bg-gradient-to-r from-green-600 to-teal-600';
      case 'patch':
        return 'bg-gradient-to-r from-orange-600 to-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* 标题 */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-500/30 mx-auto">
              📝
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text">
            更新日志
          </h1>
          <p className="text-gray-400 text-lg">
            记录每一次进步和改进
          </p>
        </div>

        {/* 时间线 */}
        <div className="relative">
          {/* 垂直线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent"></div>

          {/* 更新列表 */}
          <div className="space-y-12">
            {updates.map((update, index) => (
              <motion.div
                key={update.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* 时间点 */}
                <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white text-2xl">🚀</span>
                </div>

                {/* 内容卡片 */}
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                  {/* 版本头部 */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 ${getVersionBadgeColor(update.type)} text-white font-bold rounded-full text-sm`}>
                      {update.version}
                    </span>
                    <span className="text-gray-400 text-sm">
                      📅 {update.date}
                    </span>
                  </div>

                  {/* 更新内容 */}
                  <div className="space-y-6">
                    {update.changes.map((change, changeIndex) => (
                      <div key={changeIndex}>
                        <h3 className="text-xl font-bold text-white mb-3">
                          {change.category}
                        </h3>
                        <ul className="space-y-2">
                          {change.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3 text-gray-300"
                            >
                              <span className="text-blue-400 mt-1">▸</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-6 rounded-2xl text-center"
        >
          <p className="text-gray-400 mb-4">
            💡 我们持续改进和优化，为您提供更好的体验
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:188016226@qq.com"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              反馈建议
            </a>
            <a
              href="weixin://dl/addfriend?username=LP20241688"
              className="px-6 py-2 glass-card text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              联系我们
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Changelog;

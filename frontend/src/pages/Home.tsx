import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import ToolCard from '../components/ToolCard';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  domain?: string;
  htmlFile?: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const Home = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await apiRequest('tools?isActive=true');
      setTools(data);
    } catch (error) {
      console.error('加载工具失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredTools = tools.slice(0, 6);

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
      {/* Hero Section - 超震撼的主视觉 */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center py-20 md:py-32 px-4 md:px-8 rounded-3xl overflow-hidden"
      >
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(102,126,234,0.1),transparent_70%)]"></div>
        
        {/* 动态光圈 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10">
          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 gradient-text tracking-tight leading-tight neon-glow"
          >
            智捷小工具
          </motion.h1>

          {/* CTA按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/tools"
              className="group relative inline-flex items-center px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg md:text-xl font-bold text-white glow-button overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                立即探索
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center px-10 md:px-14 py-4 md:py-5 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-full text-lg md:text-xl font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              了解更多
            </Link>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 md:mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: `${tools.length}+`, label: '精选工具' },
              { number: '10K+', label: '用户使用' },
              { number: '99%', label: '好评率' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </motion.section>

      {/* Featured Tools Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 md:mt-32"
      >
        {/* 标题区域 */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 gradient-text"
          >
            热门工具
          </motion.h2>
        </div>

        {/* 工具卡片网格 */}
        {!loading && featuredTools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-400">加载中...</p>
          </div>
        )}

        {/* 查看更多按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            to="/tools"
            className="group inline-flex items-center px-8 md:px-10 py-3 md:py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-full text-base md:text-lg font-bold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            查看全部工具
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.section>

      {/* 特性展示区 */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 md:mt-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: '⚡',
              title: '极速体验',
              description: '毫秒级响应，流畅如丝般的使用体验'
            },
            {
              icon: '🔒',
              title: '安全可靠',
              description: '数据加密传输，隐私保护第一优先级'
            },
            {
              icon: '🎨',
              title: '精美设计',
              description: '现代化界面设计，赏心悦目的视觉体验'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

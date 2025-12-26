import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolCard from '../components/ToolCard';
import { apiRequest } from '../services/api';

interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryId: string;
  category?: ToolCategory;
  domain?: string;
  htmlFile?: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const ToolLibrary = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [toolsData, categoriesData] = await Promise.all([
        apiRequest('tools?isActive=true'),
        apiRequest('tool-categories?isActive=true'),
      ]);
      setTools(toolsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.categoryId === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-2xl font-bold text-white mb-2">加载中...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 gradient-text">
          工具库
        </h1>
      </motion.div>

      {/* 搜索框 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-8 md:mb-12"
      >
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索工具..."
            className="w-full px-6 py-4 pl-14 rounded-2xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </motion.div>

      {/* 分类筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16"
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
              : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          全部工具
        </motion.button>
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (index + 1) * 0.05 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* 工具网格 */}
      {filteredTools.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">未找到相关工具</h3>
          <p className="text-gray-400">试试其他关键词或分类</p>
        </motion.div>
      )}
    </div>
  );
};

export default ToolLibrary;

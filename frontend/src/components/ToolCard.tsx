import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category?: {
      id: string;
      name: string;
    };
    domain?: string;
    htmlFile?: string;
    rating: number;
  };
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const categoryName = tool.category?.name || '未分类';
  const hasOnlineAccess = !!tool.domain;
  const hasDownload = !!tool.htmlFile;

  const handleToolClick = () => {
    if (tool.domain) {
      console.log('打开工具链接:', tool.domain);
      window.open(tool.domain, '_blank');
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('打开下载链接:', tool.htmlFile);
    if (tool.htmlFile) {
      window.open(tool.htmlFile, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl card-hover"
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-80"></div>
      
      {/* 玻璃态效果 */}
      <div className="absolute inset-0 glass-card"></div>
      
      {/* 悬停光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
      
      {/* 扫描光束 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* 内容区域 */}
      <div className="relative h-full p-6 md:p-7 flex flex-col min-h-[280px]">
        {/* 分类标签 */}
        <div className="flex items-start justify-end mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-blue-300 border border-white/20">
            {categoryName}
          </span>
        </div>

        {/* 标题 - 可点击区域 */}
        <div
          onClick={handleToolClick}
          className={`${hasOnlineAccess ? 'cursor-pointer' : ''}`}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-1 transition-all duration-300">
            <span className="inline-block group-hover:scale-105 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
              {tool.name}
            </span>
          </h3>
        </div>

        {/* 描述 - 可点击区域 */}
        <div
          onClick={handleToolClick}
          className={`flex-grow mb-4 ${hasOnlineAccess ? 'cursor-pointer' : ''}`}
        >
          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
            {tool.description}
          </p>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {/* 评分 */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < tool.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* 下载按钮 */}
          <div className="flex items-center gap-2">
            {hasDownload && (
              <button
                onClick={handleDownloadClick}
                className="flex items-center gap-1 text-green-400 font-semibold text-sm hover:text-green-300 transition-colors z-10 relative"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>下载</span>
              </button>
            )}
            {!hasOnlineAccess && !hasDownload && (
              <span className="text-gray-500 text-sm">敬请期待</span>
            )}
          </div>
        </div>
      </div>

      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-500 pointer-events-none"></div>
      
      {/* 顶部光带 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>
    </motion.div>
  );
};

export default ToolCard;

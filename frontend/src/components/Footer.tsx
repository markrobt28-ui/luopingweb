import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      
      <div className="relative glass-card">
        <div className="container mx-auto px-4 py-8">
          {/* 主要内容 */}
          <div className="flex flex-col items-center gap-6">
            {/* 链接 */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                隐私政策
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                服务条款
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/changelog"
                className="text-gray-400 hover:text-white transition-colors"
              >
                更新日志
              </Link>
            </div>

            {/* 版权和备案 */}
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                © {currentYear} <span className="text-blue-400 font-semibold">飘飘洒洒</span> 保留所有权利
              </p>
              <p>
                <a 
                  href="https://beian.miit.gov.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  滇ICP备2025066033号
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

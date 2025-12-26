import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', path: '/', icon: '🏠' },
    { name: '工具库', path: '/tools', icon: '🛠️' },
    { name: '博客', path: '/blog', icon: '📝' },
    { name: '联系我们', path: '/contact', icon: '📞' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-card shadow-lg shadow-blue-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
              智
            </div>
          </div>
          <span className="text-xl md:text-2xl font-black gradient-text hidden sm:block">
            智捷小工具
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-white bg-white/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="relative flex items-center gap-2">
                <span className="text-lg">{link.icon}</span>
                <span className="text-base">{link.name}</span>
              </span>
              {location.pathname === link.path && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-semibold text-base max-w-24 truncate">{user.username}</span>
              </div>
              <Link
                to="/account"
                className="px-5 py-2.5 glass-card rounded-xl font-semibold text-base text-white hover:bg-white/10 transition-all duration-300"
              >
                中心
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 glass-card rounded-xl font-semibold text-base text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 glass-card rounded-xl font-semibold text-base text-white hover:bg-white/10 transition-all duration-300"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-base text-white glow-button"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center glass-card rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col gap-1.5">
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden glass-card border-t border-white/10 py-4 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all ${
                location.pathname === link.path
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-4 mt-4">
            {isAuthenticated && user ? (
              <>
                <div className="py-3 px-4 text-white font-semibold">
                  👋 {user.username}
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span>⚙️</span>
                  用户中心
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <span>🚪</span>
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span>🔑</span>
                  登录
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 mt-2"
                >
                  <span>✨</span>
                  注册
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService, User } from '../services/authService';

const Account = () => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('获取用户信息失败:', error);
          const storedUser = authService.getUser();
          setUser(storedUser);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-500/30 mx-auto mb-6">
            🔒
          </div>
          <h2 className="text-3xl font-black mb-4 gradient-text">
            需要登录
          </h2>
          <p className="text-gray-400 mb-8">
            请先登录以访问用户中心
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold glow-button"
            >
              立即登录
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 glass-card text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              注册账号
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* 标题 */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2 gradient-text">
            用户中心
          </h1>
          <p className="text-gray-400">管理您的账户和偏好设置</p>
        </div>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {user.username}
              </h2>
              <p className="text-gray-400 text-base mb-3">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {user.role === 'ADMIN' ? '👑 管理员' : '👤 普通用户'}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-semibold">
                  ✓ 已激活
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                注册时间：{new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex-shrink-0 flex flex-col gap-3">
              {user.role === 'ADMIN' && (
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
                >
                  管理后台
                </a>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 glass-card text-red-400 rounded-xl font-semibold hover:bg-red-500/10 transition-all"
              >
                退出登录
              </button>
            </div>
          </div>
        </motion.div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: '🛠️', 
              title: '工具库', 
              desc: '浏览所有在线工具', 
              link: '/tools',
              color: 'from-blue-600 to-cyan-600'
            },
            { 
              icon: '📝', 
              title: '博客', 
              desc: '阅读技术文章', 
              link: '/blog',
              color: 'from-purple-600 to-pink-600'
            },
            { 
              icon: '📞', 
              title: '联系我们', 
              desc: '了解更多信息', 
              link: '/contact',
              color: 'from-orange-600 to-red-600'
            },
            { 
              icon: '🔒', 
              title: '隐私政策', 
              desc: '查看隐私保护政策', 
              link: '/privacy',
              color: 'from-green-600 to-teal-600'
            },
            { 
              icon: '📋', 
              title: '服务条款', 
              desc: '阅读服务条款', 
              link: '/terms',
              color: 'from-indigo-600 to-blue-600'
            },
            { 
              icon: '📅', 
              title: '更新日志', 
              desc: '查看最新更新', 
              link: '/changelog',
              color: 'from-pink-600 to-rose-600'
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <Link
                to={item.link}
                className="block glass-card rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 账户统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-8 glass-card rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">账户统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '注册天数', value: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)), unit: '天' },
              { label: '账户状态', value: user.isActive ? '正常' : '禁用', unit: '' },
              { label: '用户角色', value: user.role === 'ADMIN' ? '管理员' : '用户', unit: '' },
              { label: '账户ID', value: user.id.slice(0, 8), unit: '...' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text mb-1">
                  {stat.value}{stat.unit}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Account;

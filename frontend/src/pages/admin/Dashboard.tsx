import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Wrench, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTools: 0,
    activeTools: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [usersRes, toolsRes] = await Promise.all([
        fetch('http://localhost:3000/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:3000/tools'),
      ]);

      const users = await usersRes.json();
      const tools = await toolsRes.json();

      setStats({
        totalUsers: users.length,
        totalTools: tools.length,
        activeTools: tools.filter((t: any) => t.isActive).length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">管理后台</h1>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">总用户数</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">总工具数</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalTools}</p>
              </div>
              <Wrench className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">活跃工具</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeTools}</p>
              </div>
              <Activity className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl p-8 text-left transition-all duration-300 hover:scale-105"
          >
            <Users className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">用户管理</h3>
            <p className="text-white/80">管理系统用户，设置权限</p>
          </button>

          <button
            onClick={() => navigate('/admin/tools')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-8 text-left transition-all duration-300 hover:scale-105"
          >
            <Wrench className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">工具管理</h3>
            <p className="text-white/80">添加、编辑和管理工具</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

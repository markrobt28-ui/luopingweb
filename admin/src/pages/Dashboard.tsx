import { useEffect, useState } from 'react';
import { authApiRequest } from '../services/api';

interface Stats {
  totalUsers: number;
  totalTools: number;
  activeTools: number;
  adminUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalComments: number;
  pendingComments: number;
  totalTags: number;
  totalToolCategories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTools: 0,
    activeTools: 0,
    adminUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    totalTags: 0,
    totalToolCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, tools, posts, comments, tags, toolCategories] = await Promise.all([
        authApiRequest('admin/users'),
        authApiRequest('tools'),
        authApiRequest('admin/posts'),
        authApiRequest('admin/comments'),
        authApiRequest('tags'),
        authApiRequest('tool-categories'),
      ]);

      setStats({
        totalUsers: users.length,
        totalTools: tools.length,
        activeTools: tools.filter((t: any) => t.isActive).length,
        adminUsers: users.filter((u: any) => u.role === 'ADMIN').length,
        totalPosts: posts.length,
        publishedPosts: posts.filter((p: any) => p.isPublished).length,
        totalComments: comments.length,
        pendingComments: comments.filter((c: any) => !c.isApproved).length,
        totalTags: tags.length,
        totalToolCategories: toolCategories.length,
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">仪表板</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总用户数"
          value={stats.totalUsers}
          icon="👥"
          color="text-blue-600"
        />
        <StatCard
          title="总工具数"
          value={stats.totalTools}
          icon="🛠️"
          color="text-green-600"
        />
        <StatCard
          title="活跃工具"
          value={stats.activeTools}
          icon="✅"
          color="text-purple-600"
        />
        <StatCard
          title="管理员"
          value={stats.adminUsers}
          icon="👑"
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总文章数"
          value={stats.totalPosts}
          icon="📝"
          color="text-indigo-600"
        />
        <StatCard
          title="已发布文章"
          value={stats.publishedPosts}
          icon="📄"
          color="text-green-600"
        />
        <StatCard
          title="总评论数"
          value={stats.totalComments}
          icon="💬"
          color="text-blue-600"
        />
        <StatCard
          title="待审核评论"
          value={stats.pendingComments}
          icon="⏳"
          color="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="标签数量"
          value={stats.totalTags}
          icon="🏷️"
          color="text-pink-600"
        />
        <StatCard
          title="工具分类"
          value={stats.totalToolCategories}
          icon="📂"
          color="text-teal-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">欢迎使用管理后台</h2>
        <p className="text-gray-600">
          您可以通过左侧菜单管理用户和工具。
        </p>
      </div>
    </div>
  );
}

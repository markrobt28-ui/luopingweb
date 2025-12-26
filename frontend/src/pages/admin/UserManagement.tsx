import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Edit, ArrowLeft, Shield, User } from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [currentUser, navigate]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此用户吗？')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('删除失败');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('更新失败');
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">加载中...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">用户管理</h1>
          </div>
          <div className="text-white/70">共 {users.length} 个用户</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">用户名</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">邮箱</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">角色</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">状态</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">注册时间</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/50" />
                        <span className="text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/80">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, role: e.target.value as 'USER' | 'ADMIN' })
                          }
                          className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.isActive ? 'true' : 'false'}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })
                          }
                          className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
                        >
                          <option value="true">激活</option>
                          <option value="false">禁用</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.isActive
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {user.isActive ? '激活' : '禁用'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(user.id, editingUser)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              title="删除"
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

import { useEffect, useState } from 'react';
import { authApiRequest } from '../services/api';

interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category?: ToolCategory;
  domain?: string;
  htmlFile?: string;
  rating: number;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function ToolManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    domain: '',
    htmlFile: '',
    rating: 5,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    loadTools();
    loadCategories();
  }, []);

  const loadTools = async () => {
    try {
      const data = await authApiRequest('tools');
      setTools(data);
    } catch (error) {
      console.error('加载工具失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await authApiRequest('tool-categories?isActive=true');
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 过滤掉空字符串，只发送有值的字段
      const payload: any = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        rating: formData.rating,
        isActive: formData.isActive,
        order: formData.order,
      };

      // 只在有值时添加可选字段
      if (formData.domain) payload.domain = formData.domain;
      if (formData.htmlFile) payload.htmlFile = formData.htmlFile;

      if (editingTool) {
        await authApiRequest(`admin/tools/${editingTool.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await authApiRequest('admin/tools', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      await loadTools();
      closeModal();
    } catch (error: any) {
      alert('操作失败: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此工具吗？')) return;

    try {
      await authApiRequest(`admin/tools/${id}`, {
        method: 'DELETE',
      });
      await loadTools();
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    }
  };

  const openModal = (tool?: Tool) => {
    // 如果没有分类，提示用户先创建分类
    if (!tool && categories.length === 0) {
      alert('请先创建至少一个工具分类');
      return;
    }

    if (tool) {
      setEditingTool(tool);
      setFormData({
        name: tool.name,
        description: tool.description,
        categoryId: tool.categoryId,
        domain: tool.domain || '',
        htmlFile: tool.htmlFile || '',
        rating: tool.rating,
        isActive: tool.isActive,
        order: tool.order,
      });
    } else {
      setEditingTool(null);
      setFormData({
        name: '',
        description: '',
        categoryId: categories[0].id,
        domain: '',
        htmlFile: '',
        rating: 5,
        isActive: true,
        order: 0,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTool(null);
  };

  const toggleToolStatus = async (tool: Tool) => {
    try {
      await authApiRequest(`admin/tools/${tool.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !tool.isActive }),
      });
      await loadTools();
    } catch (error: any) {
      alert('更新失败: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">工具管理</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          添加工具
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                工具名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                在线链接/下载链接
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                评分
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {tool.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {tool.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {tool.category?.name || '未分类'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 line-clamp-2">
                    {tool.description}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-500 space-y-1">
                    {tool.domain && (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">🌐</span>
                        <span className="truncate max-w-[200px]" title={tool.domain}>
                          {tool.domain}
                        </span>
                      </div>
                    )}
                    {tool.htmlFile && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">📥</span>
                        <span className="truncate max-w-[200px]" title={tool.htmlFile}>
                          {tool.htmlFile}
                        </span>
                      </div>
                    )}
                    {!tool.domain && !tool.htmlFile && <div>-</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {'⭐'.repeat(tool.rating)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{tool.order}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tool.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tool.isActive ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => openModal(tool)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => toggleToolStatus(tool)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {tool.isActive ? '禁用' : '启用'}
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tools.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无工具，点击上方按钮添加第一个工具
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingTool ? '编辑工具' : '添加工具'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    工具名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类 *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">请选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    评分 (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    在线访问链接 (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    用户点击工具卡片后跳转的在线访问链接
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    下载链接 (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.htmlFile}
                    onChange={(e) =>
                      setFormData({ ...formData, htmlFile: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://pan.baidu.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    提供给用户下载工具的网盘链接
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  启用工具
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  {editingTool ? '更新' : '创建'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

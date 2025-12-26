import { useEffect, useState } from 'react';
import { authApiRequest } from '../services/api';

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  isApproved: boolean;
  createdAt: string;
  post?: {
    id: string;
    title: string;
  };
}

export default function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await authApiRequest('admin/comments');
      setComments(data);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await authApiRequest(`admin/comments/${id}/approve`, {
        method: 'PUT',
      });
      await loadComments();
    } catch (error: any) {
      alert('审核失败: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此评论吗？')) return;

    try {
      await authApiRequest(`admin/comments/${id}`, {
        method: 'DELETE',
      });
      await loadComments();
    } catch (error: any) {
      alert('删除失败: ' + error.message);
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.isApproved;
    if (filter === 'approved') return comment.isApproved;
    return true;
  });

  const pendingCount = comments.filter(c => !c.isApproved).length;

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">评论管理</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            全部 ({comments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            待审核 ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            已审核 ({comments.length - pendingCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white rounded-lg shadow p-6 ${
              !comment.isApproved ? 'border-l-4 border-yellow-400' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {comment.author}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {comment.email}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      comment.isApproved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {comment.isApproved ? '已审核' : '待审核'}
                  </span>
                </div>
                {comment.post && (
                  <div className="text-sm text-gray-600 mb-2">
                    评论文章: {comment.post.title}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
              <div className="flex space-x-2">
                {!comment.isApproved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 text-sm"
                  >
                    审核通过
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm"
                >
                  删除
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {filter === 'all' && '暂无评论'}
            {filter === 'pending' && '暂无待审核评论'}
            {filter === 'approved' && '暂无已审核评论'}
          </div>
        )}
      </div>
    </div>
  );
}
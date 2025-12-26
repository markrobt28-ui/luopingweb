import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiRequest, authApiRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  user?: {
    username: string;
  };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  author: {
    id: string;
    username: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [commentForm, setCommentForm] = useState({
    content: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      loadComments();
      // 检查是否已经点赞过
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setLiked(likedPosts.includes(post.id));
    }
  }, [post]);

  const loadPost = async () => {
    try {
      const data = await apiRequest(`posts/slug/${slug}`);
      setPost(data);
    } catch (err) {
      setError('文章不存在或已被删除');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!post) return;
    
    try {
      const data = await apiRequest(`posts/${post.id}/comments`);
      setComments(data);
    } catch (err) {
      console.error('加载评论失败:', err);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;
    
    try {
      await apiRequest(`posts/${post.id}/like`, { method: 'POST' });
      setPost({ ...post, likeCount: post.likeCount + 1 });
      setLiked(true);
      
      // 记录到 localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      likedPosts.push(post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentForm.content.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const payload = {
        postId: post.id,
        content: commentForm.content
      };
      console.log('提交评论:', payload);
      
      await authApiRequest('comments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setCommentForm({ content: '' });
      alert('评论提交成功，等待审核后显示');
      loadComments();
    } catch (err: any) {
      console.error('评论提交失败:', err);
      alert('评论提交失败: ' + (err.message || '请重试'));
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="pt-20 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-20 md:pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-white mb-2">{error || '文章不存在'}</h3>
            <Link to="/blog" className="text-blue-400 hover:text-blue-300">
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8"
      >
        {/* 返回链接 */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回博客</span>
        </Link>

        {/* 封面图 */}
        {post.coverImage && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={post.coverImage}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tagItem) => (
            <span
              key={tagItem.tag.id}
              className="px-3 py-1 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: `${tagItem.tag.color}20`,
                color: tagItem.tag.color,
              }}
            >
              {tagItem.tag.name}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
          {post.title}
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-white/10">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author.username}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.viewCount} 阅读
          </span>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* 点赞按钮 */}
        <div className="flex items-center justify-center mb-12">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              liked 
                ? 'bg-red-500/20 text-red-400 cursor-not-allowed' 
                : 'bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
            }`}
          >
            <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likeCount} {liked ? '已点赞' : '点赞'}
          </button>
        </div>

        {/* 评论区 */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8">评论 ({comments.length})</h3>
          
          {/* 评论表单 */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="glass-card rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">发表评论</h4>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              
              <textarea
                placeholder="写下你的评论..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({ content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              
              <button
                type="submit"
                disabled={submittingComment || !commentForm.content.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingComment ? '提交中...' : '发表评论'}
              </button>
            </form>
          ) : (
            <div className="glass-card rounded-2xl p-6 mb-8 text-center">
              <p className="text-gray-400 mb-4">请登录后发表评论</p>
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                立即登录
              </Link>
            </div>
          )}

          {/* 评论列表 */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(comment.user?.username || comment.author).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {comment.user?.username || comment.author}
                      </div>
                      <div className="text-sm text-gray-400">{formatDate(comment.createdAt)}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              暂无评论，快来发表第一条评论吧！
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPost;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiRequest } from '../services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
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
  _count: {
    comments: number;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await apiRequest('posts');
      setPosts(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
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
      <div className="pt-20 md:pt-24 px-4 md:px-6 lg:px-8 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">加载中...</p>
        </div>
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
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 gradient-text">
            博客
          </h1>
        </div>

        {/* 文章列表 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl overflow-hidden group h-80 md:h-96"
              >
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  {/* 背景图片 */}
                  <div className="absolute inset-0">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:3000${post.coverImage}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // 图片加载失败时显示渐变背景
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            const gradient = document.createElement('div');
                            gradient.className = 'w-full h-full bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40';
                            e.currentTarget.parentElement.appendChild(gradient);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40"></div>
                    )}
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                  </div>

                  {/* 内容叠加层 */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    {/* 右上角日期 */}
                    <div className="flex justify-end">
                      <span className="px-3 py-1.5 text-xs font-medium text-white bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>

                    {/* 底部内容 */}
                    <div>
                      {/* 标题 */}
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all drop-shadow-lg">
                        {post.title}
                      </h2>

                      {/* 摘要 */}
                      {post.summary && (
                        <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 drop-shadow-md">
                          {post.summary}
                        </p>
                      )}

                      {/* 元信息 */}
                      <div className="flex items-center justify-between text-sm text-gray-300 flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {post._count.comments}
                          </span>
                        </div>
                        {/* 标签 */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.tags.slice(0, 4).map((tagItem) => (
                            <span
                              key={tagItem.tag.id}
                              className="px-2 py-0.5 text-xs font-semibold rounded-full backdrop-blur-sm"
                              style={{
                                backgroundColor: `${tagItem.tag.color}40`,
                                color: '#fff',
                                border: `1px solid ${tagItem.tag.color}60`,
                              }}
                            >
                              {tagItem.tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 边框光效 */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-white/30 transition-colors duration-500 pointer-events-none"></div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">暂无文章</h3>
            <p className="text-gray-400">敬请期待更多精彩内容</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Blog;

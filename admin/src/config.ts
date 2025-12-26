// API配置
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // 认证
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  PROFILE: `${API_BASE_URL}/profile`,
  
  // 用户管理
  USERS: `${API_BASE_URL}/admin/users`,
  USER: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
  
  // 工具管理
  TOOLS: `${API_BASE_URL}/admin/tools`,
  TOOL: (id: string) => `${API_BASE_URL}/admin/tools/${id}`,
  PUBLIC_TOOLS: `${API_BASE_URL}/tools`,
  
  // 工具分类管理
  TOOL_CATEGORIES: `${API_BASE_URL}/admin/tool-categories`,
  TOOL_CATEGORY: (id: string) => `${API_BASE_URL}/admin/tool-categories/${id}`,
  PUBLIC_TOOL_CATEGORIES: `${API_BASE_URL}/tool-categories`,
  
  // 文章管理
  POSTS: `${API_BASE_URL}/admin/posts`,
  POST: (id: string) => `${API_BASE_URL}/admin/posts/${id}`,
  PUBLIC_POSTS: `${API_BASE_URL}/posts`,
  
  // 评论管理
  COMMENTS: `${API_BASE_URL}/admin/comments`,
  COMMENT: (id: string) => `${API_BASE_URL}/admin/comments/${id}`,
  APPROVE_COMMENT: (id: string) => `${API_BASE_URL}/admin/comments/${id}/approve`,
  
  // 标签管理
  TAGS: `${API_BASE_URL}/admin/tags`,
  TAG: (id: string) => `${API_BASE_URL}/admin/tags/${id}`,
  PUBLIC_TAGS: `${API_BASE_URL}/tags`,
};

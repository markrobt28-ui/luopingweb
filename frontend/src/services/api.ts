// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API请求封装
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const { headers, ...restOptions } = options;
  
  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络请求失败，请检查网络连接');
  }
};

// 带认证的API请求
export const authApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  console.log('authApiRequest - token:', token ? '存在' : '不存在');
  
  if (!token) {
    throw new Error('用户未登录');
  }

  const { headers, ...restOptions } = options;

  return apiRequest(endpoint, {
    ...restOptions,
    headers: {
      ...(headers as Record<string, string>),
      'Authorization': `Bearer ${token}`,
    },
  });
};

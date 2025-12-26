// API基础配置
const { VITE_API_BASE_URL } = import.meta.env as { VITE_API_BASE_URL?: string };
const API_BASE_URL = VITE_API_BASE_URL || 'http://localhost:3000';

// API请求封装
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  // 提取 headers，确保正确合并
  const { headers: optionHeaders, ...restOptions } = options;
  
  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(optionHeaders as Record<string, string>),
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      console.error('API请求失败:', { url, status: response.status, errorData });
      throw new Error(errorMsg);
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

  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  return apiRequest(endpoint, config);
};

export const authUploadRequest = async (endpoint: string, formData: FormData) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('用户未登录');
  }

  const url = `${API_BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

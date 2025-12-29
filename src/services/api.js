import axios from 'axios';

// Sử dụng proxy trong development để tránh CORS, hoặc direct URL nếu có env variable
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Trong development, ưu tiên dùng proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Production fallback
  return 'http://localhost:3000';
};

const API_BASE_URL = getBaseURL();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// GET /problem/:id
export const getProblem = async (id) => {
  try {
    const response = await api.get(`/problem/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    let errorMessage = 'Không thể tải đề bài';
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Không thể kết nối đến server';
    } else {
      errorMessage = error.message || 'Đã xảy ra lỗi';
    }
    throw new Error(errorMessage);
  }
};

// POST /problem/submit
export const submitCode = async (problemId, code, file = null) => {
  try {
    let response;
    
    if (file) {
      // Nếu có file, gửi FormData với file
      const formData = new FormData();
      formData.append('codefile', file);
      formData.append('problemId', problemId);
      
      // Sử dụng axios với config đặc biệt cho FormData
      response = await api.post('/problem/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Nếu không có file, gửi code text như cũ
      response = await api.post('/problem/submit', {
        problemId,
        code,
        language: 'cpp',
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Submit Error:', error);
    let errorMessage = 'Lỗi khi submit code';
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Không thể kết nối đến server';
    } else {
      errorMessage = error.message || 'Đã xảy ra lỗi';
    }
    throw new Error(errorMessage);
  }
};

// GET /problem (for problem list)
export const getProblems = async () => {
  try {
    const response = await api.get('/problem');
    console.log('API Response:', response);
    // Đảm bảo trả về array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Nếu không phải array, trả về array rỗng hoặc wrap trong array
    return response.data ? [response.data] : [];
  } catch (error) {
    console.error('API Error:', error);
    // Xử lý error message tốt hơn
    let errorMessage = 'Không thể kết nối đến server';
    if (error.response) {
      // Server trả về response nhưng có lỗi
      errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
    } else {
      // Lỗi khi setup request
      errorMessage = error.message || 'Đã xảy ra lỗi';
    }
    throw new Error(errorMessage);
  }
};

// Admin APIs
// GET /admin/problems
export const getAdminProblems = async () => {
  try {
    const response = await api.get('/admin/problems');
    console.log('Admin API Response:', response);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data ? [response.data] : [];
  } catch (error) {
    console.error('Admin API Error:', error);
    let errorMessage = 'Không thể kết nối đến server';
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
    } else {
      errorMessage = error.message || 'Đã xảy ra lỗi';
    }
    throw new Error(errorMessage);
  }
};

// GET /admin/problems/:id
export const getAdminProblem = async (id) => {
  try {
    const response = await api.get(`/admin/problems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Admin API Error:', error);
    let errorMessage = 'Không thể tải đề bài';
    if (error.response) {
      errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Không thể kết nối đến server';
    } else {
      errorMessage = error.message || 'Đã xảy ra lỗi';
    }
    throw new Error(errorMessage);
  }
};

export default api;


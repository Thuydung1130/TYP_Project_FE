// import axios from 'axios';

// // Sử dụng proxy trong development để tránh CORS, hoặc direct URL nếu có env variable
// const getBaseURL = () => {
//   if (import.meta.env.VITE_API_URL) {
//     return import.meta.env.VITE_API_URL;
//   }
//   // Trong development, ưu tiên dùng proxy
//   if (import.meta.env.DEV) {
//     return '/api';
//   }
//   // Production fallback
//   return 'http://localhost:3000';
// };

// const API_BASE_URL = getBaseURL();

// console.log('API Base URL:', API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10 seconds timeout
// });

// // GET /problem/:id
// export const getProblem = async (id) => {
//   try {
//     const response = await api.get(`/problem/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error);
//     let errorMessage = 'Không thể tải đề bài';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // POST /problem/submit
// export const submitCode = async (problemId, code, file = null) => {
//   try {
//     let response;
    
//     if (file) {
//       // Nếu có file, gửi FormData với file
//       const formData = new FormData();
//       formData.append('codefile', file);
//       formData.append('problemId', problemId);
      
//       // Sử dụng axios với config đặc biệt cho FormData
//       response = await api.post('/problem/submit', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//     } else {
//       // Nếu không có file, gửi code text như cũ
//       response = await api.post('/problem/submit', {
//         problemId,
//         code,
//         language: 'cpp',
//       });
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('Submit Error:', error);
//     let errorMessage = 'Lỗi khi submit code';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // GET testcase sample for a problem (using admin API)
// export const getTestcaseSample = async (problemId) => {
//   try {
//     const response = await api.get('/admin/testcase', { 
//       params: { problem_id: problemId } 
//     });
//     const testcases = response.data?.data || [];
//     // Return first testcase as sample
//     return testcases.length > 0 ? testcases[0] : null;
//   } catch (error) {
//     console.error('API Error:', error);
//     // Return null if error, don't throw
//     return null;
//   }
// };

// // GET /problem (for problem list)
// export const getProblems = async () => {
//   try {
//     const response = await api.get('/problem');
//     console.log('API Response:', response);
//     // Đảm bảo trả về array
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
//     // Nếu không phải array, trả về array rỗng hoặc wrap trong array
//     return response.data ? [response.data] : [];
//   } catch (error) {
//     console.error('API Error:', error);
//     // Xử lý error message tốt hơn
//     let errorMessage = 'Không thể kết nối đến server';
//     if (error.response) {
//       // Server trả về response nhưng có lỗi
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
//     } else if (error.request) {
//       // Request được gửi nhưng không nhận được response
//       errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
//     } else {
//       // Lỗi khi setup request
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // Admin APIs
// // GET /admin/problems
// export const getAdminProblems = async () => {
//   try {
//     const response = await api.get('/admin/problems');
//     console.log('Admin API Response:', response);
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
//     return response.data ? [response.data] : [];
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể kết nối đến server';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}: ${error.response.statusText}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // GET /admin/problems/:id
// export const getAdminProblem = async (id) => {
//   try {
//     const response = await api.get(`/admin/problems/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể tải đề bài';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // POST /admin/problems
// export const createAdminProblem = async (problemData) => {
//   try {
//     const response = await api.post('/admin/problems', problemData);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể tạo bài tập';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // PUT /admin/problems/:id
// export const updateAdminProblem = async (id, problemData) => {
//   try {
//     const response = await api.put(`/admin/problems/${id}`, problemData);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể cập nhật bài tập';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // DELETE /admin/problems/:id
// export const deleteAdminProblem = async (id) => {
//   try {
//     const response = await api.delete(`/admin/problems/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể xóa bài tập';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // Testcase APIs
// // GET /admin/testcase?problem_id=xxx
// export const getAdminTestcases = async (problemId = null) => {
//   try {
//     const params = problemId ? { problem_id: problemId } : {};
//     const response = await api.get('/admin/testcase', { params });
//     return response.data?.data || [];
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể tải danh sách testcase';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // POST /admin/testcase/:problem_id
// export const createAdminTestcases = async (problemId, testcases) => {
//   try {
//     const response = await api.post(`/admin/testcase/${problemId}`, { testcases });
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể tạo testcase';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // PUT /admin/testcase/:id
// export const updateAdminTestcase = async (id, testcaseData) => {
//   try {
//     const response = await api.put(`/admin/testcase/${id}`, testcaseData);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể cập nhật testcase';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// // DELETE /admin/testcase/:id
// export const deleteAdminTestcase = async (id) => {
//   try {
//     const response = await api.delete(`/admin/testcase/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Admin API Error:', error);
//     let errorMessage = 'Không thể xóa testcase';
//     if (error.response) {
//       errorMessage = error.response.data?.error || error.response.data?.message || `Lỗi ${error.response.status}`;
//     } else if (error.request) {
//       errorMessage = 'Không thể kết nối đến server';
//     } else {
//       errorMessage = error.message || 'Đã xảy ra lỗi';
//     }
//     throw new Error(errorMessage);
//   }
// };

// export default api;

import axios from 'axios';

// ✅ Lấy baseURL
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  if (import.meta.env.DEV) return '/api';
  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ✅ Hàm xử lý lỗi chung
const handleApiError = (error, defaultMessage = 'Đã xảy ra lỗi') => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data?.error ||
           error.response.data?.message ||
           `Lỗi ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
  } else {
    return error.message || defaultMessage;
  }
};

// ✅ Helper API gọi gọn gàng
const apiRequest = async (method, url, options = {}, defaultMessage = 'Đã xảy ra lỗi') => {
  try {
    const response = await api({ method, url, ...options });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error, defaultMessage));
  }
};

//
// ────────────────────────────────────────────────
// 🧩 AUTH APIs — Login bằng Google
// ────────────────────────────────────────────────
//


// Gửi credential Google từ frontend lên backend để xác thực
export const googleLogin = (credential) =>
  apiRequest('post', '/auth/google', { data: { credential } }, 'Đăng nhập Google thất bại');

// Lưu token & user vào localStorage
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Xoá token khi logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};





//
// ────────────────────────────────────────────────
// 🧩 Các API chính
// ────────────────────────────────────────────────
//

// Problem APIs
export const getProblems = () => apiRequest('get', '/problem', {}, 'Không thể tải danh sách bài tập');
export const getProblem = (id) => apiRequest('get', `/problem/${id}`, {}, 'Không thể tải đề bài');

export const submitCode = (problemId, code, file = null) => {
  const url = '/problem/submit';
  if (file) {
    const formData = new FormData();
    formData.append('codefile', file);
    formData.append('problemId', problemId);
    return apiRequest('post', url, { data: formData, headers: { 'Content-Type': 'multipart/form-data' } }, 'Lỗi khi submit code');
  }
  return apiRequest('post', url, { data: { problemId, code, language: 'cpp' } }, 'Lỗi khi submit code');
};

export const getTestcaseSample = async (problemId) => {
  try {
    const data = await apiRequest('get', '/admin/testcase', { params: { problem_id: problemId } });
    return data?.data?.[0] || null;
  } catch {
    return null; // Không ném lỗi, chỉ trả về null
  }
};

// Admin Problem APIs
export const getAdminProblems = () => apiRequest('get', '/admin/problems', {}, 'Không thể tải danh sách bài tập');
export const getAdminProblem = (id) => apiRequest('get', `/admin/problems/${id}`, {}, 'Không thể tải đề bài');
export const createAdminProblem = (problemData) => apiRequest('post', '/admin/problems', { data: problemData }, 'Không thể tạo bài tập');
export const updateAdminProblem = (id, problemData) => apiRequest('put', `/admin/problems/${id}`, { data: problemData }, 'Không thể cập nhật bài tập');
export const deleteAdminProblem = (id) => apiRequest('delete', `/admin/problems/${id}`, {}, 'Không thể xóa bài tập');

// Admin Testcase APIs
export const getAdminTestcases = (problemId = null) =>
  apiRequest('get', '/admin/testcase', { params: problemId ? { problem_id: problemId } : {} }, 'Không thể tải danh sách testcase');

export const createAdminTestcases = (problemId, testcases) =>
  apiRequest('post', `/admin/testcase/${problemId}`, { data: { testcases } }, 'Không thể tạo testcase');

export const updateAdminTestcase = (id, testcaseData) =>
  apiRequest('put', `/admin/testcase/${id}`, { data: testcaseData }, 'Không thể cập nhật testcase');

export const deleteAdminTestcase = (id) =>
  apiRequest('delete', `/admin/testcase/${id}`, {}, 'Không thể xóa testcase');

export default api;

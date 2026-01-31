

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
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Response interceptor để xử lý token hết hạn
api.interceptors.response.use(
  (response) => response, // Trả về response thành công bình thường
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) hoặc 403 (Forbidden) - token hết hạn hoặc không hợp lệ
    // Backend trả về:
    // - 401 khi thiếu token hoặc định dạng sai
    // - 403 khi token hết hạn hoặc không hợp lệ
    const status = error.response?.status;
    if (status === 401 || status === 403||status===500) {
      // Xóa token và user khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const currentPath = window.location.pathname;
      // Chỉ redirect về login nếu đang ở client routes (không phải admin và không phải login)
      // Admin routes không cần login nên không redirect
      if (currentPath !== '/login' && !currentPath.startsWith('/admin')) {
        // Sử dụng window.location.href để đảm bảo redirect ngay lập tức
        // Force redirect ngay cả khi đang trong quá trình render
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

// Kiểm tra xem có token hay không
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
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
export const getAdminTestcases = async (problemId = null) => {
  try {
    const data = await apiRequest('get', '/admin/testcase', { params: problemId ? { problem_id: problemId } : {} }, 'Không thể tải danh sách testcase');
    // Backend trả về { data: testcases }, cần extract data.data
    return data?.data || [];
  } catch (error) {
    throw error;
  }
};

export const createAdminTestcases = (problemId, testcases) =>
  apiRequest('post', `/admin/testcase/${problemId}`, { data: { testcases } }, 'Không thể tạo testcase');

export const updateAdminTestcase = (id, testcaseData) =>
  apiRequest('put', `/admin/testcase/${id}`, { data: testcaseData }, 'Không thể cập nhật testcase');

export const deleteAdminTestcase = (id) =>
  apiRequest('delete', `/admin/testcase/${id}`, {}, 'Không thể xóa testcase');

export default api;

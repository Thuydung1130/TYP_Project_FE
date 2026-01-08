import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { googleLogin, saveAuth } from '../../services/api.js'; 
import './LoginPage.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const handleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    const decoded = jwtDecode(credential);
    console.log('Google user:', decoded);

    // Gửi credential lên backend để xác thực & lấy token hệ thống
    try {
      const res = await googleLogin(credential);
      saveAuth(res.token, res.user);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng bạn đến với C++ Code Grader</p>
          </div>
          <div className="login-content">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Đăng nhập thất bại')}
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

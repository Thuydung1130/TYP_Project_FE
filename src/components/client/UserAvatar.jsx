import { useState, useEffect, useRef } from 'react';
import { logout } from '../../services/api';
import './UserAvatar.css';

function UserAvatar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    // Lắng nghe sự kiện click bên ngoài để đóng dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  return (
    <div className="user-avatar-container" ref={dropdownRef}>
      <button
        className="user-avatar-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="User menu"
      >
        <img
          src={user.avatar || 'https://via.placeholder.com/40'}
          alt={user.name || 'User'}
          className="user-avatar-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40';
          }}
        />
      </button>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <img
              src={user.avatar || 'https://via.placeholder.com/60'}
              alt={user.name || 'User'}
              className="user-dropdown-avatar"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/60';
              }}
            />
            <div className="user-dropdown-info">
              <div className="user-dropdown-name">{user.name || 'User'}</div>
              <div className="user-dropdown-email">{user.email || ''}</div>
            </div>
          </div>
          <div className="user-dropdown-divider"></div>
          <button className="user-dropdown-logout" onClick={handleLogout}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;





import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../services/api';
import './ProblemList.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProblems();
      console.log('Problems data:', data);
      
      // Kiểm tra nếu data là array và có dữ liệu
      if (Array.isArray(data) && data.length > 0) {
        // Backend trả về array với _id và title, description
        const formattedProblems = data.map((problem) => ({
          id: problem._id || problem.id,
          title: problem.title || 'Không có tiêu đề',
          description: problem.description || 'Không có mô tả',
        }));
        setProblems(formattedProblems);
      } else {
        // Nếu không có dữ liệu, set empty array
        setProblems([]);
      }
    } catch (err) {
      console.error('Error loading problems:', err);
      setError(err.message || 'Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách bài tập...</div>;
  }

  if (error) {
    return (
      <div className="problem-list">
        <h2>Danh sách bài tập</h2>
        <div className="error">
          <p><strong>Lỗi:</strong> {error}</p>
          <button 
            onClick={loadProblems} 
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-list">
      <h2>Danh sách bài tập</h2>
      <div className="problems-grid">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            className="problem-card"
          >
            <div className="problem-card-header">
              <h3>{problem.title}</h3>
            </div>
            <div className="problem-card-body">
              <p>{problem.description || 'Bài tập lập trình'}</p>
            </div>
          </Link>
        ))}
      </div>
      {problems.length === 0 && !loading && (
        <div className="empty-state">
          <p>Chưa có bài tập nào trong hệ thống</p>
        </div>
      )}
    </div>
  );
}

export default ProblemList;


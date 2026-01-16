import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../../services/api';
import './ProblemList.css';

function ProblemList() {
  const [allProblems, setAllProblems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProblems();
      //console.log('Problems data:', data);
      
      // Kiểm tra nếu data là array và có dữ liệu
      if (Array.isArray(data) && data.length > 0) {
        // Backend trả về array với _id và title, description, difficulty
        const formattedProblems = data.map((problem) => ({
          id: problem._id || problem.id,
          title: problem.title || 'Không có tiêu đề',
          description: problem.description || 'Không có mô tả',
          difficulty: problem.difficulty || 'EASY',
        }));
        setAllProblems(formattedProblems);
        setProblems(formattedProblems);
      } else {
        // Nếu không có dữ liệu, set empty array
        setAllProblems([]);
        setProblems([]);
      }
    } catch (err) {
      console.error('Error loading problems:', err);
      setError(err.message || 'Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  // Filter problems based on difficulty
  useEffect(() => {
    if (difficultyFilter === 'all') {
      setProblems(allProblems);
    } else {
      const filtered = allProblems.filter(problem => 
        problem.difficulty?.toUpperCase() === difficultyFilter.toUpperCase()
      );
      setProblems(filtered);
    }
  }, [difficultyFilter, allProblems]);

  const getDifficultyClass = (difficulty) => {
    const diff = (difficulty || 'EASY').toUpperCase();
    if (diff === 'EASY') return 'difficulty-easy';
    if (diff === 'MEDIUM') return 'difficulty-medium';
    if (diff === 'HARD') return 'difficulty-hard';
    return 'difficulty-easy';
  };

  const getDifficultyLabel = (difficulty) => {
    const diff = (difficulty || 'EASY').toUpperCase();
    if (diff === 'EASY') return 'Easy';
    if (diff === 'MEDIUM') return 'Medium';
    if (diff === 'HARD') return 'Hard';
    return 'Easy';
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
      
      <div className="filter-container">
        <label htmlFor="difficulty-filter" className="filter-label">
          Lọc theo độ khó:
        </label>
        <select
          id="difficulty-filter"
          className="difficulty-filter"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        {difficultyFilter !== 'all' && (
          <span className="filter-result">
            ({problems.length} bài {getDifficultyLabel(difficultyFilter)})
          </span>
        )}
      </div>

      <div className="problems-grid">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            className="problem-card"
          >
            <div className="problem-card-header">
              <h3>{problem.title}</h3>
              <span className={`difficulty ${getDifficultyClass(problem.difficulty)}`}>
                {getDifficultyLabel(problem.difficulty)}
              </span>
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






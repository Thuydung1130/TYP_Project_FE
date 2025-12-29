import { useState, useEffect } from 'react';
import { getAdminProblems, getAdminProblem } from '../services/api';
import './AdminProblems.css';

function AdminProblems() {
  const [allProblems, setAllProblems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminProblems();
      if (Array.isArray(data)) {
        setAllProblems(data);
        setProblems(data);
      } else {
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

  // Filter problems based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setProblems(allProblems);
    } else {
      const filtered = allProblems.filter((problem) => {
        const title = (problem.title || '').toLowerCase();
        const description = (problem.description || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return title.includes(search) || description.includes(search);
      });
      setProblems(filtered);
    }
  }, [searchTerm, allProblems]);

  const handleAdd = () => {
    setSelectedProblem(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    try {
      const problem = await getAdminProblem(id);
      setSelectedProblem(problem);
      setModalMode('edit');
      setShowModal(true);
    } catch (err) {
      alert('Không thể tải thông tin bài tập: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      // TODO: Implement delete API call when backend is ready
      alert('Chức năng xóa sẽ được thêm khi backend hỗ trợ');
    }
  };

  const handleSave = () => {
    // TODO: Implement save API call when backend is ready
    alert('Chức năng thêm/sửa sẽ được thêm khi backend hỗ trợ');
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="admin-problems">
        <div className="loading">Đang tải danh sách bài tập...</div>
      </div>
    );
  }

  return (
    <div className="admin-problems">
      <div className="problems-header">
        <h1 className="page-title">Problems Management</h1>
        <button className="btn-add" onClick={handleAdd}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Problem
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadProblems}>Thử lại</button>
        </div>
      )}

      <div className="search-container">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
              title="Xóa tìm kiếm"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            Tìm thấy {problems.length} bài tập
          </div>
        )}
      </div>

      <div className="problems-table-container">
        <table className="problems-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  Chưa có bài tập nào trong hệ thống
                </td>
              </tr>
            ) : (
              problems.map((problem, index) => (
                <tr key={problem._id || problem.id}>
                  <td className="id-cell">{index + 1}</td>
                  <td className="title-cell">{problem.title || 'N/A'}</td>
                  <td className="description-cell">
                    {problem.description ? (
                      problem.description.length > 100 
                        ? `${problem.description.substring(0, 100)}...` 
                        : problem.description
                    ) : 'N/A'}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(problem._id || problem.id)}
                      title="Edit"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(problem._id || problem.id)}
                      title="Delete"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Problem' : 'Edit Problem'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  defaultValue={selectedProblem?.title || ''}
                  placeholder="Enter problem title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  defaultValue={selectedProblem?.description || ''}
                  placeholder="Enter problem description"
                  rows="5"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                {modalMode === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProblems;


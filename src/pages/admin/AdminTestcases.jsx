import { useState, useEffect } from 'react';
import { getAdminTestcases, createAdminTestcases, updateAdminTestcase, deleteAdminTestcase, getAdminProblems } from '../../services/api';
import './AdminTestcases.css';

function AdminTestcases() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [testcases, setTestcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTestcase, setEditingTestcase] = useState(null);
  const [newTestcases, setNewTestcases] = useState([{ input: '', output: '' }]);

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      loadTestcases();
    } else {
      setTestcases([]);
    }
  }, [selectedProblemId]);

  const loadProblems = async () => {
    try {
      const data = await getAdminProblems();
      if (Array.isArray(data)) {
        setProblems(data);
        if (data.length > 0 && !selectedProblemId) {
          setSelectedProblemId(data[0]._id || data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading problems:', err);
      setError('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const loadTestcases = async () => {
    if (!selectedProblemId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminTestcases(selectedProblemId);
      console.log('Testcases data received:', data);
      setTestcases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading testcases:', err);
      setError(err.message || 'Không thể tải danh sách testcase');
      setTestcases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestcase = () => {
    setNewTestcases([{ input: '', output: '' }]);
    setShowAddModal(true);
  };

  const handleAddMoreTestcase = () => {
    setNewTestcases([...newTestcases, { input: '', output: '' }]);
  };

  const handleRemoveTestcase = (index) => {
    if (newTestcases.length > 1) {
      setNewTestcases(newTestcases.filter((_, i) => i !== index));
    }
  };

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...newTestcases];
    updated[index][field] = value;
    setNewTestcases(updated);
  };

  const handleSaveTestcases = async () => {
    // Validate
    const validTestcases = newTestcases.filter(tc => tc.input.trim() && tc.output.trim());
    
    if (validTestcases.length === 0) {
      alert('Vui lòng nhập ít nhất một testcase hợp lệ');
      return;
    }

    try {
      await createAdminTestcases(selectedProblemId, validTestcases);
      alert(`Thêm ${validTestcases.length} testcase thành công!`);
      setShowAddModal(false);
      setNewTestcases([{ input: '', output: '' }]);
      loadTestcases();
    } catch (err) {
      alert('Lỗi khi thêm testcase: ' + err.message);
    }
  };

  const handleEdit = (testcase) => {
    setEditingTestcase({ ...testcase });
    setShowEditModal(true);
  };

  const handleUpdateTestcase = async () => {
    if (!editingTestcase.input.trim() || !editingTestcase.output.trim()) {
      alert('Vui lòng nhập đầy đủ input và output');
      return;
    }

    try {
      await updateAdminTestcase(editingTestcase._id, {
        input: editingTestcase.input,
        output: editingTestcase.output
      });
      alert('Cập nhật testcase thành công!');
      setShowEditModal(false);
      setEditingTestcase(null);
      loadTestcases();
    } catch (err) {
      alert('Lỗi khi cập nhật testcase: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa testcase này?')) {
      try {
        await deleteAdminTestcase(id);
        alert('Xóa testcase thành công!');
        loadTestcases();
      } catch (err) {
        alert('Lỗi khi xóa testcase: ' + err.message);
      }
    }
  };

  const selectedProblem = problems.find(p => (p._id || p.id) === selectedProblemId);

  if (loading && problems.length === 0) {
    return (
      <div className="admin-testcases">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-testcases">
      <div className="testcases-header">
        <h1 className="page-title">Testcases Management</h1>
        <div className="header-actions">
          <select 
            className="problem-select"
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
          >
            <option value="">-- Chọn bài tập --</option>
            {problems.map((problem) => (
              <option key={problem._id || problem.id} value={problem._id || problem.id}>
                {problem.title || 'N/A'}
              </option>
            ))}
          </select>
          {selectedProblemId && (
            <button className="btn-add" onClick={handleAddTestcase}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Testcases
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadTestcases}>Thử lại</button>
        </div>
      )}

      {selectedProblemId && (
        <div className="problem-info">
          <h3>{selectedProblem?.title || 'N/A'}</h3>
          <p>{selectedProblem?.description || 'Không có mô tả'}</p>
        </div>
      )}

      {selectedProblemId ? (
        <div className="testcases-table-container">
          {loading ? (
            <div className="loading">Đang tải testcases...</div>
          ) : testcases.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có testcase nào cho bài tập này</p>
              <button className="btn-add" onClick={handleAddTestcase}>
                Thêm testcase đầu tiên
              </button>
            </div>
          ) : (
            <table className="testcases-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testcases.map((testcase, index) => (
                  <tr key={testcase._id || testcase.id}>
                    <td className="id-cell">{index + 1}</td>
                    <td className="input-cell">
                      <pre>{testcase.input || 'N/A'}</pre>
                    </td>
                    <td className="output-cell">
                      <pre>{testcase.output || 'N/A'}</pre>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(testcase)}
                        title="Edit"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(testcase._id || testcase.id)}
                        title="Delete"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>Vui lòng chọn bài tập để xem testcases</p>
        </div>
      )}

      {/* Modal for Add Multiple Testcases */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm Testcases</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="testcases-list">
                {newTestcases.map((testcase, index) => (
                  <div key={index} className="testcase-item">
                    <div className="testcase-header">
                      <h4>Testcase {index + 1}</h4>
                      {newTestcases.length > 1 && (
                        <button 
                          className="btn-remove-testcase"
                          onClick={() => handleRemoveTestcase(index)}
                          title="Xóa testcase này"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Input <span className="required">*</span></label>
                        <textarea
                          value={testcase.input}
                          onChange={(e) => handleTestcaseChange(index, 'input', e.target.value)}
                          placeholder="Nhập input..."
                          rows="4"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Output <span className="required">*</span></label>
                        <textarea
                          value={testcase.output}
                          onChange={(e) => handleTestcaseChange(index, 'output', e.target.value)}
                          placeholder="Nhập output..."
                          rows="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-add-more" onClick={handleAddMoreTestcase}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm testcase khác
              </button>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveTestcases}>
                Thêm {newTestcases.filter(tc => tc.input.trim() && tc.output.trim()).length} testcase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Edit Testcase */}
      {showEditModal && editingTestcase && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh sửa Testcase</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Input <span className="required">*</span></label>
                <textarea
                  value={editingTestcase.input}
                  onChange={(e) => setEditingTestcase({ ...editingTestcase, input: e.target.value })}
                  placeholder="Nhập input..."
                  rows="6"
                  required
                />
              </div>
              <div className="form-group">
                <label>Output <span className="required">*</span></label>
                <textarea
                  value={editingTestcase.output}
                  onChange={(e) => setEditingTestcase({ ...editingTestcase, output: e.target.value })}
                  placeholder="Nhập output..."
                  rows="6"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleUpdateTestcase}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTestcases;




import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, submitCode } from '../services/api';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import './ProblemDetail.css';

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    // Viết code của bạn ở đây
    
    return 0;
}`;

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [submitMode, setSubmitMode] = useState('code'); // 'code' or 'file'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProblem(id);
      console.log('Problem data:', data);
      
      // Backend trả về object với _id, title, description
      if (data) {
        setProblem({
          id: data._id || id,
          title: data.title || 'Không có tiêu đề',
          description: data.description || 'Không có mô tả',
        });
      } else {
        setError('Không tìm thấy đề bài');
      }
    } catch (err) {
      console.error('Error loading problem:', err);
      setError(err.message || 'Không thể tải đề bài');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra extension
      if (!file.name.endsWith('.cpp') && !file.name.endsWith('.c++') && !file.name.endsWith('.cc')) {
        setError('Vui lòng chọn file C++ (.cpp, .c++, .cc)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      setSubmitMode('file');
      setError(null); // Clear previous errors
      
      // Đọc nội dung file để hiển thị trong editor
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target.result);
      };
      reader.onerror = () => {
        setError('Lỗi khi đọc file');
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
    setSubmitMode('code');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra nếu submit bằng file
    if (submitMode === 'file' && !selectedFile) {
      setError('Vui lòng chọn file để nộp');
      return;
    }
    
    // Kiểm tra nếu submit bằng code
    if (submitMode === 'code' && !code.trim()) {
      setError('Vui lòng nhập code hoặc chọn file');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSubmitResult(null);
      
      // Gọi API submit với file hoặc code
      const result = await submitCode(id, code, selectedFile);
      setSubmitResult(result);
    } catch (err) {
      setError(err.message || 'Lỗi khi submit code');
      setSubmitResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải đề bài...</div>;
  }

  if (error && !problem) {
    return (
      <div className="error">
        <p>Lỗi: {error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="problem-detail">
      <div className="problem-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Quay lại
        </button>
        <h2>{problem?.title}</h2>
      </div>

      {error && <div className="error">Lỗi: {error}</div>}

      <div className="problem-detail-content">
        <div className="problem-info">
          <div className="problem-section">
            <h3>Mô tả</h3>
            <p>{problem?.description || 'Chưa có mô tả cho bài tập này.'}</p>
          </div>
        </div>

        <div className="code-section">
          <div className="code-section-header">
            <h3>Code Editor (C++)</h3>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Đang submit...' : 'Submit'}
            </button>
          </div>

          {/* File Upload Section */}
          <div className="file-upload-section">
            <div className="file-upload-controls">
              <label className="file-upload-button">
                📁 Chọn file C++
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".cpp,.c++,.cc"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              {fileName && (
                <div className="file-info">
                  <span className="file-name">✓ {fileName}</span>
                  <button
                    onClick={handleRemoveFile}
                    className="file-remove-button"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
            <div className="file-upload-hint">
              {submitMode === 'file' && selectedFile 
                ? 'Bạn đang nộp bằng file. File sẽ được sử dụng để submit.'
                : 'Hoặc nhập code trực tiếp vào editor bên dưới.'}
            </div>
          </div>

          <CodeEditor value={code} onChange={setCode} />

          {submitResult && (
            <TestResults result={submitResult} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;


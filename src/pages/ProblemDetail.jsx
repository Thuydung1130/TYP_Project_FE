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
      // Backend trả về object với _id, title, description
      setProblem({
        id: data._id,
        title: data.title,
        description: data.description,
      });
    } catch (err) {
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
    // Reset về code mặc định nếu muốn
    // setCode(DEFAULT_CODE);
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
            <p>{problem?.description}</p>
          </div>

          <div className="problem-section">
            <h3>Định dạng đầu vào</h3>
            <pre>{problem?.inputFormat}</pre>
          </div>

          <div className="problem-section">
            <h3>Định dạng đầu ra</h3>
            <pre>{problem?.outputFormat}</pre>
          </div>

          {problem?.examples && problem.examples.length > 0 && (
            <div className="problem-section">
              <h3>Ví dụ</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="example">
                  <div className="example-item">
                    <strong>Input:</strong>
                    <pre>{example.input}</pre>
                  </div>
                  <div className="example-item">
                    <strong>Output:</strong>
                    <pre>{example.output}</pre>
                  </div>
                  {example.explanation && (
                    <div className="example-explanation">
                      <strong>Giải thích:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem?.constraints && (
            <div className="problem-section">
              <h3>Ràng buộc</h3>
              <pre>{problem.constraints}</pre>
            </div>
          )}
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
          <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <label style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', border: 'none' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ {fileName}</span>
                  <button
                    onClick={handleRemoveFile}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
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


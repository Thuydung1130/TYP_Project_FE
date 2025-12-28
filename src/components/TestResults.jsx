import './TestResults.css';

function TestResults({ result }) {
  if (!result) return null;

  // Backend trả về: { status: "AC|WA|TLE|MLE|RE|CE", results: [...], error?: "..." }
  const finalStatus = result.status || 'UNKNOWN';
  const testResults = result.results || [];
  const compileError = result.error; // Lỗi compile nếu status = "CE"
  
  // Đếm số test case pass
  const totalTests = testResults.length;
  const passedTests = testResults.filter(test => test.status === 'AC').length;

  // Map status sang màu và icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'AC':
        return { label: 'ACCEPTED', icon: '✅', color: 'success', bgColor: '#d4edda', textColor: '#155724' };
      case 'WA':
        return { label: 'WRONG ANSWER', icon: '❌', color: 'error', bgColor: '#f8d7da', textColor: '#721c24' };
      case 'TLE':
        return { label: 'TIME LIMIT EXCEEDED', icon: '⏱️', color: 'warning', bgColor: '#fff3cd', textColor: '#856404' };
      case 'MLE':
        return { label: 'MEMORY LIMIT EXCEEDED', icon: '💾', color: 'warning', bgColor: '#fff3cd', textColor: '#856404' };
      case 'RE':
        return { label: 'RUNTIME ERROR', icon: '💥', color: 'error', bgColor: '#f8d7da', textColor: '#721c24' };
      case 'CE':
        return { label: 'COMPILATION ERROR', icon: '🔨', color: 'error', bgColor: '#f8d7da', textColor: '#721c24' };
      default:
        return { label: status, icon: '❓', color: 'unknown', bgColor: '#e9ecef', textColor: '#495057' };
    }
  };

  const statusInfo = getStatusInfo(finalStatus);

  return (
    <div className="test-results">
      <div className="test-results-header">
        <h3>Kết quả chấm bài</h3>
      </div>

      {/* Hiển thị tất cả trên 1 dòng */}
      <div className="result-line">
        <div 
          className={`final-status status-${statusInfo.color}`} 
          style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.textColor
          }}
        >
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-label">{statusInfo.label}</span>
        </div>
        
        {totalTests > 0 && (
          <span className="test-count">
            {passedTests} / {totalTests} test cases passed
          </span>
        )}
      </div>

      {/* Hiển thị lỗi compile nếu có */}
      {compileError && (
        <div className="compilation-error">
          <h4>Lỗi biên dịch:</h4>
          <pre>{compileError}</pre>
        </div>
      )}
    </div>
  );
}

export default TestResults;


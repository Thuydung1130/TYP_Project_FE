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
        return { label: 'ACCEPTED', icon: '✅', color: 'success' };
      case 'WA':
        return { label: 'WRONG ANSWER', icon: '❌', color: 'error' };
      case 'TLE':
        return { label: 'TIME LIMIT EXCEEDED', icon: '⏱️', color: 'warning' };
      case 'MLE':
        return { label: 'MEMORY LIMIT EXCEEDED', icon: '💾', color: 'warning' };
      case 'RE':
        return { label: 'RUNTIME ERROR', icon: '💥', color: 'error' };
      case 'CE':
        return { label: 'COMPILATION ERROR', icon: '🔨', color: 'error' };
      default:
        return { label: status, icon: '❓', color: 'unknown' };
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
        <div className={`final-status status-${statusInfo.color}`}>
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-label">{statusInfo.label}</span>
        </div>
        
        {totalTests > 0 && (
          <div className="test-count-badge">
            <span className="test-count-number">{passedTests}</span>
            <span className="test-count-separator">/</span>
            <span className="test-count-total">{totalTests}</span>
            <span className="test-count-text">test cases</span>
          </div>
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


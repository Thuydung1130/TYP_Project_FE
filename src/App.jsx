import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>🧪 C++ Code Grader</h1>
          </Link>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<ProblemList />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProblems from './pages/AdminProblems';
import AdminTestcases from './pages/AdminTestcases';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="problems" element={<AdminProblems />} />
          <Route path="testcases" element={<AdminTestcases />} />
        </Route>
        
        {/* Client Routes */}
        <Route path="/" element={
          <div className="app">
            <header className="app-header">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>🧪 C++ Code Grader</h1>
              </Link>
            </header>
            <main className="app-content">
              <ProblemList />
            </main>
          </div>
        } />
        <Route path="/problems/:id" element={
          <div className="app">
            <header className="app-header">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>🧪 C++ Code Grader</h1>
              </Link>
            </header>
            <main className="app-content">
              <ProblemDetail />
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProblemList from './pages/client/ProblemList';
import ProblemDetail from './pages/client/ProblemDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProblems from './pages/admin/AdminProblems';
import AdminTestcases from './pages/admin/AdminTestcases';
import LoginPage from './pages/client/LoginPage';
import UserAvatar from './components/client/UserAvatar';
import './App.css';

function App() {
  return (
    <Router>

      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
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
              <UserAvatar />
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
              <UserAvatar />
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


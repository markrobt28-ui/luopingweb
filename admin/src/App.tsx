import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ToolManagement from './pages/ToolManagement';
import ToolCategoryManagement from './pages/ToolCategoryManagement';
import PostManagement from './pages/PostManagement';
import CommentManagement from './pages/CommentManagement';
import TagManagement from './pages/TagManagement';
import AboutManagement from './pages/AboutManagement';
import SettingsManagement from './pages/SettingsManagement';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="tools" element={<ToolManagement />} />
              <Route path="tool-categories" element={<ToolCategoryManagement />} />
              <Route path="posts" element={<PostManagement />} />
              <Route path="comments" element={<CommentManagement />} />
              <Route path="tags" element={<TagManagement />} />
              <Route path="about" element={<AboutManagement />} />
              <Route path="settings" element={<SettingsManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hook/useAuth';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UserDashboard from './pages/user-dashboard/UserDashboard';

function ProtectedRoute({ element, ...rest }) {
  const isAuthenticated = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/userDashboard"
          element={<ProtectedRoute element={<UserDashboard />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

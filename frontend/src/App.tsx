import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResourceForm from './pages/ResourceForm';
import ResourceList from './pages/ResourceList';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/:resource" element={<ProtectedRoute><ResourceList /></ProtectedRoute>} />
        <Route path="/:resource/nova" element={<ProtectedRoute><ResourceForm /></ProtectedRoute>} />
        <Route path="/:resource/:id/editar" element={<ProtectedRoute><ResourceForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

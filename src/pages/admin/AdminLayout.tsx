import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, LogOut, Home } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>PadelShop <span className="admin-badge">Admin</span></h2>
          <p className="admin-user">{user?.email}</p>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin/inventory" className="admin-nav-link active">
            <Package size={20} /> Inventario
          </Link>
          <Link to="/" className="admin-nav-link">
            <Home size={20} /> Ver Tienda
          </Link>
        </nav>
        
        <div className="admin-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

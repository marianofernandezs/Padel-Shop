import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <main className="auth-page container">
        <div className="auth-card">
          <h2>Registro Exitoso</h2>
          <p>Tu cuenta ha sido creada. Ahora puedes iniciar sesión para acceder al panel de administración.</p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '1.5rem', width: '100%' }}>
            Ir al Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Registro de Administrador</h2>
          <p>Crea una nueva cuenta para gestionar el inventario.</p>
        </div>
        
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : <><UserPlus size={20} /> Crear Cuenta</>}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
};

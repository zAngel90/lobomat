import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../config/api';
import { Icons } from '../../components/icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = isAdmin ? 
        `${apiConfig.dbURL}/api/admins/login` : 
        `${apiConfig.dbURL}/api/auth/login`;

      console.log('Intentando login en:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      console.log('Login exitoso:', data);

      login(data.token, isAdmin ? 'admin' : 'user');
      
      if (isAdmin) {
        console.log('Redirigiendo a /admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      alert(error.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-md w-full space-y-8 bg-[#1A1D1F]/95 p-8 rounded-xl border border-white/10">
        <div className="text-center">
          <Icons.Gamepad className="mx-auto h-12 w-12 text-[#00A3FF]" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-[#8A8F98]">
            ¿No tienes una cuenta?{' '}
            <button 
              type="button" 
              onClick={() => navigate('/register')} 
              className="text-[#00A3FF] hover:text-[#0082CC] transition-colors cursor-pointer p-2"
            >
              Regístrate
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm relative z-50"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer">
              <input
                id="admin-login"
                name="admin-login"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-5 w-5 cursor-pointer text-[#00A3FF] bg-[#1A1D1F] border-[#1E2028] rounded focus:ring-[#00A3FF]"
              />
              <label 
                htmlFor="admin-login" 
                className="ml-2 block text-sm text-[#8A8F98] cursor-pointer select-none"
              >
                Iniciar como Administrador
              </label>
            </div>
          </div>

          <AnimatedButton
            type="submit"
            className="w-full py-3 px-4 relative z-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Iniciar Sesión'}
          </AnimatedButton>
        </form>
      </div>
    </div>
  );
};

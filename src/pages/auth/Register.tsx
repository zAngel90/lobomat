import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../../components/icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { authService } from '../../services/authService';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-md w-full space-y-8 bg-[#1A1D1F]/95 p-8 rounded-xl border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Icons.Gamepad className="mx-auto h-12 w-12 text-[#00A3FF]" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Crear Cuenta
          </h2>
          <div className="mt-2 text-sm text-[#8A8F98] relative z-50">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className="text-[#00A3FF] hover:text-[#0082CC] transition-colors cursor-pointer p-2 inline-block"
            >
              Iniciar Sesión
            </Link>
          </div>
        </motion.div>

        <motion.form 
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm relative z-50"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm"
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
                className="appearance-none relative block w-full px-3 py-2 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border border-[#1E2028] bg-[#1A1D1F] text-white placeholder-[#8A8F98] focus:outline-none focus:ring-[#00A3FF] focus:border-[#00A3FF] focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <AnimatedButton
            type="submit"
            className="w-full py-3 px-4 relative z-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Registrarse'}
          </AnimatedButton>
        </motion.form>
      </div>
    </div>
  );
}; 
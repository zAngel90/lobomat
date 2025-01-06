interface LoginData {
  email: string;
  password: string;
  isAdmin: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const result = await response.json();
    localStorage.setItem('token', result.token);
    return result;
  },

  async register(data: RegisterData) {
    const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrarse');
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem('token');
  }
}; 
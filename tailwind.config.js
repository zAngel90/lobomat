/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3', // Color azul principal de BloxyFruit
          light: '#64B5F6',   // Versión más clara
          dark: '#1976D2',    // Versión más oscura
          hover: '#1E88E5'    // Color para hover
        },
        secondary: {
          DEFAULT: '#0D1117', // Color de fondo oscuro
          light: '#161B22',   // Color de fondo para cards
          dark: '#010409'     // Color de fondo más oscuro
        },
        accent: {
          DEFAULT: '#58A6FF', // Color de acento
          success: '#238636', // Verde para éxito
          warning: '#F85149', // Rojo para advertencias
          info: '#2196F3'     // Azul para información
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #2196F3, #64B5F6)'
      }
    },
  },
  plugins: [],
};

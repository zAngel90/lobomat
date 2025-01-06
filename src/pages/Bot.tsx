import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface BotStatus {
  isReady: boolean;
  isAuthenticated: boolean;
  displayName: string | null;
  lastError: string | null;
  hasFriendToken: boolean;
}

interface Bot {
  id: string;
  name: string;
  port: number;
  status: BotStatus;
}

export function BotPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [bots, setBots] = useState<Bot[]>([
    { id: 'bot1', name: 'Bot Principal', port: 3001, status: {
      isReady: false,
      isAuthenticated: false,
      displayName: null,
      lastError: null,
      hasFriendToken: false
    }},
    { id: 'bot2', name: 'Bot Secundario', port: 3003, status: {
      isReady: false,
      isAuthenticated: false,
      displayName: null,
      lastError: null,
      hasFriendToken: false
    }}
  ]);

  useEffect(() => {
    const checkBotsStatus = async () => {
      const updatedBots = await Promise.all(bots.map(async (bot) => {
        try {
          const status = await apiService.getBotStatus(bot.port);
          return { ...bot, status };
        } catch (error) {
          console.error(`Error checking bot ${bot.id}:`, error);
          return bot;
        }
      }));
      setBots(updatedBots);
    };

    checkBotsStatus();
    const interval = setInterval(checkBotsStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || selectedBots.length === 0) {
      alert('Por favor ingresa un nombre de usuario y selecciona al menos un bot');
      return;
    }

    setLoading(true);
    try {
      // Enviar solicitud a todos los bots seleccionados
      const results = await Promise.all(
        selectedBots.map(botId => {
          const bot = bots.find(b => b.id === botId);
          if (!bot) return null;
          return apiService.sendFriendRequest(username, bot.port);
        })
      );

      const successfulBots = results.filter(r => r?.success).length;
      alert(`Solicitud(es) enviada(s) correctamente desde ${successfulBots} bot(s)`);
      setUsername('');
      
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.error || error.message || 'Error desconocido');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera con estado de los bots */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Bots de Fortnite
              </h1>
              <p className="mt-2 text-gray-400">
                Sistema de gestión de solicitudes de amistad
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {bots.map(bot => (
                <div key={bot.id} className="flex items-center justify-end space-x-2">
                  <div className={`h-3 w-3 rounded-full ${bot.status.isReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                  <span className={`text-sm ${bot.status.isReady ? 'text-green-400' : 'text-yellow-400'}`}>
                    {bot.name}: {bot.status.isReady ? 'En línea' : 'Conectando...'}
                  </span>
                  {bot.status.displayName && (
                    <span className="text-sm text-blue-400">
                      ({bot.status.displayName})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de bots */}
            <div className="grid grid-cols-2 gap-4">
              {bots.map(bot => (
                <label key={bot.id} className="flex items-center space-x-3 p-4 rounded-xl bg-gray-900/50 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={selectedBots.includes(bot.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBots([...selectedBots, bot.id]);
                      } else {
                        setSelectedBots(selectedBots.filter(id => id !== bot.id));
                      }
                    }}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-700 bg-gray-900 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-white font-medium">{bot.name}</p>
                    <p className="text-sm text-gray-400">
                      {bot.status.isReady 
                        ? bot.status.displayName 
                        : bot.status.lastError || 'Conectando...'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Nombre de Usuario
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa el nombre de usuario de Fortnite"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || selectedBots.length === 0}
              className={`w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white 
                ${loading || !username.trim() || selectedBots.length === 0
                  ? 'bg-blue-500/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200'
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                'Enviar Solicitud'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

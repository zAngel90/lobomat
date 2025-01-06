import React, { useState } from 'react';
import { apiService } from '../services/api';

interface GiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  itemName: string;
}

export function GiftDialog({ isOpen, onClose, offerId, itemName }: GiftDialogProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friendToken, setFriendToken] = useState('');
  const [needsAuth, setNeedsAuth] = useState(false);

  const handleSendGift = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.sendGift(username, offerId, friendToken);

      if (response.needsAuth) {
        setNeedsAuth(true);
        setError(response.message);
        return;
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar el regalo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1D1F] rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Enviar Regalo</h2>
        <p className="text-gray-400 mb-4">
          Vas a regalar: {itemName}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">
              Username del destinatario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1E2028] text-white px-4 py-2 rounded-lg"
              placeholder="Ingresa el username"
            />
          </div>

          {needsAuth && (
            <div>
              <label className="block text-gray-400 mb-2">
                Token de amigo
              </label>
              <textarea
                value={friendToken}
                onChange={(e) => setFriendToken(e.target.value)}
                className="w-full bg-[#1E2028] text-white px-4 py-2 rounded-lg"
                placeholder="Pega aquí el token de amigo"
                rows={3}
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleSendGift}
              disabled={loading || !username || (needsAuth && !friendToken)}
              className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${
                loading || !username || (needsAuth && !friendToken)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-400'
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar Regalo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { apiConfig } from '../config/api';

interface FortniteItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  images: {
    icon: string;
    featured: string;
  };
}

interface ShopData {
  featured: FortniteItem[];
  daily: FortniteItem[];
}

export class ApiService {
  private async fetchFortniteApi(endpoint: string) {
    const response = await fetch(`${apiConfig.fortniteApiUrl}${endpoint}`, {
      headers: {
        'Authorization': apiConfig.fortniteApiKey
      }
    });

    if (!response.ok) {
      throw new Error('Error en la petición a Fortnite API');
    }

    return response.json();
  }

  private async fetchBotApi(endpoint: string, options: RequestInit = {}, baseUrl: string = apiConfig.botURL) {
    try {
      const response = await fetch(`${baseUrl}/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(error.error || 'Error en la petición al Bot API');
      }
      return response.json();
    } catch (error) {
      console.error('Bot API Error:', error);
      throw error;
    }
  }

  async getShop() {
    return this.fetchFortniteApi('/v2/shop?lang=en');
  }

  async getNews() {
    return this.fetchFortniteApi('/v2/news?lang=es');
  }

  async getMap() {
    return this.fetchFortniteApi('/v1/map?lang=es');
  }

  async getAES() {
    return this.fetchFortniteApi('/v2/aes');
  }

  async getStats(username: string) {
    return this.fetchFortniteApi(`/v2/stats?name=${username}`);
  }

  async getCosmetics() {
    return this.fetchFortniteApi('/v2/cosmetics/br?lang=es');
  }

  async getBundles() {
    return this.fetchFortniteApi('/v2/bundles?lang=es');
  }

  // Bot API methods
  async getBotStatus(port = 3001) {
    const botUrl = port === 3001 ? apiConfig.botURL : `http://localhost:${port}`;
    return this.fetchBotApi('/bot-status', {}, botUrl);
  }

  async sendFriendRequest(username: string, port = 3001) {
    const botUrl = port === 3001 ? apiConfig.botURL : `http://localhost:${port}`;
    const body: any = { username };

    const response = await this.fetchBotApi('/friend-request', {
      method: 'POST',
      body: JSON.stringify(body)
    }, botUrl);

    if (response.needsAuth) {
      return {
        needsAuth: true,
        message: response.message
      };
    }

    return response;
  }

  async sendFriendToken(token: string, requestId: string) {
    console.log('Enviando token:', token.substring(0, 20) + '...');
    return this.fetchBotApi('/friend-token', {
      method: 'POST',
      body: JSON.stringify({
        friendToken: token.trim(),
        requestId
      })
    });
  }

  async sendGift(username: string, offerId: string, token?: string) {
    const body: any = { username, offerId };
    if (token) {
      body.friendToken = token.trim().replace(/[\n\r\s]/g, '');
    }

    const response = await this.fetchBotApi('/send-gift', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (response.needsAuth) {
      return {
        needsAuth: true,
        message: response.message
      };
    }

    return response;
  }
}

export const apiService = new ApiService();
export interface ApiTelegramAuthResponse {
  accessToken: string;
  user: {
    id: number;
    telegramId: number;
    telegramUsername: string | null;
    name: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

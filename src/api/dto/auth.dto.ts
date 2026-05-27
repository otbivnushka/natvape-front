export interface ApiTelegramAuthResponse {
  accessToken: string;
  user: {
    id: number;
    telegramId: number;
    telegramUsername: string | null;
    telegramPhotoUrl: string | null;
    name: string;
    phone: string | null;
    avatar: string | null;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiLoginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

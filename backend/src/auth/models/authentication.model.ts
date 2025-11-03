export interface TokenPayloadModel {
  sub?: string;
  email?: string;
  id?: string;
  hotelId?: number;
}

export interface UserAuthModel {
  email: string;
  password: string;
  id: string;
  role: string;
  hotelId?: number;
}

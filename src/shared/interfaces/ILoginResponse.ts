import { User } from '@modules/users/entities/User';

interface ILoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export { ILoginResponse };

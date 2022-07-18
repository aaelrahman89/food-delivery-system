import { User } from '../models/User';

export interface SetPasswordRepo {
  setPassword(password: string, activationToken: string): Promise<User>;
}

import { User } from '../models/User';

export interface ResetPasswordRepo {
  sendResetPasswordLink(email: string): Promise<void>;
  resetPassword(password: string, activationToken: string): Promise<User>;
}

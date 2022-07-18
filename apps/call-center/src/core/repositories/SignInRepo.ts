import { User } from '../models/User';

export interface SignInRepo {
  signIn(form: { email: string; password: string }): Promise<User>;
}

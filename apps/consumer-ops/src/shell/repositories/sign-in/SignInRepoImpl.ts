import { SignInRepo } from '../../../core/repositories/SignInRepo';
import {
  UserSignInRequest,
  UserSignInResponse,
} from '@survv/api/definitions/users';
import { networkService } from '@survv/commons/shell/backend/networkService';

class SignInRepoImpl implements SignInRepo {
  private _networkService = networkService;

  async signIn(form: { email: string; password: string }): Promise<string> {
    const { token } = await this._networkService.request<
      UserSignInRequest,
      UserSignInResponse
    >({
      requestLine: 'post /api/v1/users/sign-in',
      body: {
        email: form.email,
        password: form.password,
      },
    });

    return token;
  }
}

export const signInRepoImpl = new SignInRepoImpl();

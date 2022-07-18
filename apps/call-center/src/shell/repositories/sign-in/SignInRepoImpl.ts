import {
  CallCenterUserSignInRequest,
  CallCenterUserSignInResponse,
} from '@survv/api/definitions/users';
import { SignInRepo } from '../../../core/repositories/SignInRepo';
import { User } from '../../../core/models/User';
import { networkService } from '@survv/commons/shell/backend/networkService';

export class SignInRepoImpl implements SignInRepo {
  private _networkService = networkService;

  async signIn(form: { email: string; password: string }): Promise<User> {
    const response = await this._networkService.request<
      CallCenterUserSignInRequest,
      CallCenterUserSignInResponse
    >({
      requestLine: 'post /consumer/api/v1/vendor-users/sign-in',
      body: {
        email: form.email,
        password: form.password,
      },
    });

    return new User({
      id: response.id,
      vendorId: response.vendorId,
      name: response.name,
      email: response.email,
      mobileNo: response.mobileNo,
      token: response.token,
    });
  }
}

import {
  CallCenterUserActivationRequest,
  CallCenterUserActivationResponse,
} from '@survv/api/definitions/users';
import { SetPasswordRepo } from '../../../core/repositories/SetPasswordRepo';
import { User } from '../../../core/models/User';
import { networkService } from '@survv/commons/shell/backend/networkService';

export class SetPasswordRepoImpl implements SetPasswordRepo {
  private _networkService = networkService;

  async setPassword(password: string, activationToken: string): Promise<User> {
    const response = await this._networkService.request<
      CallCenterUserActivationRequest,
      CallCenterUserActivationResponse
    >({
      requestLine: 'post /consumer/api/v1/vendor-users/activation',
      body: {
        activationToken,
        password,
      },
    });

    return new User({
      id: response.id,
      name: response.name,
      email: response.email,
      mobileNo: response.mobileNo,
      token: response.token,
      vendorId: response.vendorId,
    });
  }
}

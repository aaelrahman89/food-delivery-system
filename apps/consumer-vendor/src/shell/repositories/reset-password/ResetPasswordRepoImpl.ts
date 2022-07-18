import { ResetPasswordRepo } from '../../../core/repositories/ResetPasswordRepo';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendResetPasswordRequest,
  SendResetPasswordResponse,
} from '@survv/api/definitions/users';
import { User } from '../../../core/models/User';
import { networkService } from '@survv/commons/shell/backend/networkService';

export class ResetPasswordRepoImpl implements ResetPasswordRepo {
  private _networkService = networkService;

  async sendResetPasswordLink(email: string): Promise<void> {
    await this._networkService.request<
      SendResetPasswordRequest,
      SendResetPasswordResponse
    >({
      requestLine: 'post /consumer/api/v1/vendor-users/send-reset-password',
      body: { email },
    });
  }

  async resetPassword(
    password: string,
    resetPasswordCode: string
  ): Promise<User> {
    const response = await this._networkService.request<
      ResetPasswordRequest,
      ResetPasswordResponse
    >({
      requestLine: 'post /consumer/api/v1/vendor-users/reset-password',
      body: {
        resetPasswordCode,
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

import {
  IntercomConfigurationRequest,
  IntercomConfigurationResponse,
} from '@survv/api/definitions/intercom';
import { IntercomRepo } from '../../../core/intercom/repositories/IntercomRepo';
import {
  NetworkService,
  networkService,
} from '@survv/commons/shell/backend/networkService';

export class IntercomRepoImpl implements IntercomRepo {
  private readonly _network: NetworkService = networkService;

  async getAppId(): Promise<string> {
    const { appId } = await this._network.request<
      IntercomConfigurationRequest,
      IntercomConfigurationResponse
    >({
      requestLine: 'get /consumer/api/v1/intercom-configuration',
    });

    return appId;
  }
}

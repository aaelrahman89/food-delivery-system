import {
  ConfigurationsListRequest,
  ConfigurationsListResponse,
} from '../../../api/definitions/users';
import { ConfigurationsRepo } from '../../core/repositories/ConfigurationsRepo';
import { networkService } from '../backend/networkService';

export class ConfigurationRepoImpl implements ConfigurationsRepo {
  private readonly _networkService = networkService;

  async getConfigItem(items: string[]): Promise<Record<string, string>> {
    const { configurations } = await this._networkService.request<
      ConfigurationsListRequest,
      ConfigurationsListResponse
    >({
      requestLine: 'get /api/v1/configurations',
      query: {
        configurationKeys: {
          keys: items,
        },
      },
    });

    return configurations.reduce((accumulator, currentValue) => {
      return {
        ...accumulator,
        [currentValue.configurationKey]: currentValue.configurationValue,
      };
    }, {});
  }
}

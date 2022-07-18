import { Hub } from '../../../../core/models/Hub';
import { HubsListV2Response } from '@survv/api/definitions/hubs';

export function mapHubsListV2ResponseToHubs(
  response: HubsListV2Response
): Hub[] {
  return response.hubs.map(
    (hubResponse) =>
      new Hub({
        id: hubResponse.id,
        label: hubResponse.label,
      })
  );
}

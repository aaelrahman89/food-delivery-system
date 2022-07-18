import { Hub } from '../models/Hub';
import { QuerySpec } from '@survv/commons/core/models/Query';

export interface HubsRepo {
  listHubs(query?: QuerySpec): Promise<Hub[]>;
}

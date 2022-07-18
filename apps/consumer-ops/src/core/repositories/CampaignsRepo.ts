import { Campaign, CampaignForm } from '../models/Campaign';
import { EntityId } from '@survv/commons/core/types';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';

export interface CampaignsRepo {
  addCampaign(campaignForm: CampaignForm): Promise<void>;
  listCampaigns(query?: ListingQuery): Promise<ItemsList<Campaign>>;
  enableCampaign(campaignId: EntityId): Promise<void>;
  disableCampaign(campaignId: EntityId): Promise<void>;
}

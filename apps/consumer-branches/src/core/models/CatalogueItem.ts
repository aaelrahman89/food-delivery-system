import { CatalogueItemOption } from './CatalogueItemOption';
import { EntityId } from '@survv/commons/core/types';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { Money } from '@survv/commons/core/models/money';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class CatalogueItem implements CatalogueItemArgs {
  id = 0;
  displayName = new MultilingualString();
  description = new MultilingualString();
  price = new Money();
  options: CatalogueItemOption[] = [];
  catalogueId = 0;
  coverPhoto = '';

  constructor(args?: CatalogueItemArgs) {
    Object.assign(this, args);
  }
}

export class CatalogueItemsListItem implements CatalogueItemsListItemArgs {
  id = 0;
  displayName = new MultilingualString();
  coverPhoto = '';
  description = new MultilingualString();
  price = new Money();
  constructor(args?: CatalogueItemsListItemArgs) {
    Object.assign(this, args);
  }
}

interface CatalogueItemsListItemArgs {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  coverPhoto: ImageUrlString;
  price: Money;
}

interface CatalogueItemArgs {
  id: EntityId;
  displayName: MultilingualString;
  description: MultilingualString;
  price: Money;
  options: CatalogueItemOption[];
  catalogueId: EntityId;
  coverPhoto: ImageUrlString;
}

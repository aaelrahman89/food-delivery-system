import { Base64EncodedFile } from '@survv/commons/core/models/Files';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { ImageUrlString } from '@survv/commons/core/models/Images';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';

export class ErrandCategoryStatus extends EnumClass {
  protected readonly _prefix: string;
  static HIDDEN = new ErrandCategoryStatus('HIDDEN');
  static VISIBLE = new ErrandCategoryStatus('VISIBLE');

  constructor(value: string) {
    super(value);
    this._prefix = 'ERRAND_CATEGORY_STATUS';
  }
}

export class ErrandCategory {
  id = 0;
  displayName = new MultilingualString();
  avgPreparationTime = 0;
  icon = '';
  status = new ErrandCategoryStatus('');
  lastUpdateDate = new Datetime();
  createdBy = {
    id: 0,
    email: '',
  };

  constructor(options?: ErrandCategoryOptions) {
    Object.assign(this, options);
  }
}

interface ErrandCategoryOptions {
  id: EntityId;
  displayName: MultilingualString;
  avgPreparationTime: number;
  createdBy: {
    id: EntityId;
    email: string;
  };
  status: ErrandCategoryStatus;
  icon: Base64EncodedFile | ImageUrlString;
  lastUpdateDate: Datetime;
}

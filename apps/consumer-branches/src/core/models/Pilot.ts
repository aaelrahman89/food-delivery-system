import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { ImageUrlString } from '@survv/commons/core/models/Images';

export class PilotStatus extends EnumClass {
  _prefix: string;

  static LOADED = new PilotStatus('LOADED');
  static ASSIGNED = new PilotStatus('ASSIGNED');
  static WAITING = new PilotStatus('WAITING');
  static COLLECTING = new PilotStatus('COLLECTING');

  constructor(value: string) {
    super(value);
    this._prefix = 'PILOT_STATUS';
  }
}

export class Pilot implements PilotOptions {
  id = 0;
  name = '';
  mobileNo = '';
  status = new PilotStatus('');
  profileImage = '';

  constructor(options?: PilotOptions) {
    Object.assign(this, options);
  }
}

interface PilotOptions {
  id: EntityId;
  name: string;
  mobileNo: string;
  status: PilotStatus;
  profileImage: ImageUrlString;
}

import { Datetime } from '@survv/commons/core/utils/datetime';
import { EntityId } from '@survv/commons/core/types';
import { EnumClass } from '@survv/commons/core/models/EnumClass';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { Pilot } from './Pilot';

export class PilotRequestStatus extends EnumClass {
  _prefix: string;

  static PENDING = new PilotRequestStatus('PENDING');
  static REQUESTED = new PilotRequestStatus('REQUESTED');
  static OPENED = new PilotRequestStatus('OPENED');
  static CLOSED = new PilotRequestStatus('CLOSED');
  static ASSIGNED = new PilotRequestStatus('ASSIGNED');
  static CANCELLED = new PilotRequestStatus('CANCELLED');

  constructor(value: string) {
    super(value);
    this._prefix = 'PILOT_REQUEST_STATUS';
  }
}

export class PilotRequestTask implements PilotRequestTaskOptions {
  id = 0;
  zoneName = new MultilingualString();

  constructor(options?: PilotRequestTaskOptions) {
    Object.assign(this, options);
  }
}

export class PilotRequest implements PilotRequestOptions {
  id = 0;
  pilot = new Pilot();
  tasks: PilotRequestTask[] = [];
  hasAssignedPilot = false;
  status = new PilotRequestStatus('');
  lastStatusUpdateDate = new Datetime();
  creationDate = new Datetime();
  shouldShowElapsedTime = false;

  constructor(options?: PilotRequestOptions) {
    Object.assign(this, options);
  }
}

interface PilotRequestTaskOptions {
  id: EntityId;
  zoneName: MultilingualString;
}

interface PilotRequestOptions {
  id: EntityId;
  pilot: Pilot;
  tasks: PilotRequestTask[];
  hasAssignedPilot: boolean;
  status: PilotRequestStatus;
  lastStatusUpdateDate: Datetime;
  creationDate: Datetime;
  shouldShowElapsedTime: boolean;
}

import { EntityId } from '@survv/commons/core/types';
import { ErrandCharging } from '../models/ErrandCharging';
import { ErrandDetectedZone } from '../models/ErrandDetectedZone';
import { ErrandOrder } from '../models/ErrandOrder';
import { ErrandStructureForm } from '../models/ErrandOrderForms';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { RejectionReason } from '../models/RejectionReason';

export interface ErrandOrdersRepo {
  calculateCharging(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<ErrandCharging>;
  detectZone(point: GeojsonCoordinates): Promise<ErrandDetectedZone>;
  getOrder(orderId: EntityId): Promise<ErrandOrder>;
  getRejectionReasons(): Promise<RejectionReason[]>;
  getSupportedZones(zoneName: string): Promise<GeojsonCoordinates[][][]>;
  rejectOrder(orderId: EntityId, rejectionReasonId: EntityId): Promise<void>;
  structureOrder(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<void>;
  editOrder(
    orderId: EntityId,
    errandOrderForm: ErrandStructureForm
  ): Promise<void>;
}

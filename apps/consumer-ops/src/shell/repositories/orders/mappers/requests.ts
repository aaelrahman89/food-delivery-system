import { ErrandOrderStructureRequest } from '@survv/api/definitions/errands';
import { ErrandStructureForm } from '../../../../core/models/ErrandOrderForms';
import { GeojsonPoint } from '@survv/commons/core/models/GeoJSON';

export function mapErrandOrderStructureFormToErrandOrderStructureRequest(
  errandOrderForm: ErrandStructureForm
): ErrandOrderStructureRequest {
  return {
    zoneName: errandOrderForm.zoneName,
    pickups: errandOrderForm.pickups.map((pickup) => {
      return {
        id: pickup.pickupId,
        categoryId: pickup.categoryId,
        locationDescription: pickup.locationName,
        locationCoordinates: {
          type: 'Point',
          coordinates: pickup.coordinates,
        },
        includeImages: pickup.includePictures,
        includeVoiceNote: pickup.includeVoiceNote,
        items: pickup.items.map((item) => {
          return {
            name: item.name,
            brand: item.brand,
            quantity: item.quantity,
            notes: item.notes,
          };
        }),
      };
    }),
  };
}

export function mapErrandOrderStructureFormToErrandOrderEditRequest(
  errandOrderForm: ErrandStructureForm
): ErrandOrderStructureRequest {
  return {
    zoneName: errandOrderForm.zoneName,
    pickups: errandOrderForm.pickups.map((pickup) => {
      return {
        id: pickup.pickupId,
        categoryId: pickup.categoryId,
        locationDescription: pickup.locationName,
        locationCoordinates: {
          type: 'Point',
          coordinates: pickup.coordinates,
        },
        includeImages: pickup.includePictures,
        includeVoiceNote: pickup.includeVoiceNote,
        items: pickup.items.map((item) => {
          return {
            name: item.name,
            brand: item.brand,
            quantity: item.quantity,
            notes: item.notes,
          };
        }),
      };
    }),
  };
}

export function mapErrandOrderStructureFormToErrandOrderCalculateRequest(
  errandOrderForm: ErrandStructureForm
): {
  pickups: {
    id: number;
    locationCoordinates: GeojsonPoint;
    categoryId: number;
  }[];
} {
  return {
    pickups: errandOrderForm.pickups.map((pickup) => {
      return {
        id: pickup.pickupId,
        categoryId: pickup.categoryId,
        locationCoordinates: {
          type: 'Point',
          coordinates: pickup.coordinates,
        },
      };
    }),
  };
}

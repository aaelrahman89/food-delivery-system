import inside from 'point-in-polygon';
import { BasePM } from '@survv/commons/core/base/BasePM';
import { GeocodingFeatureItem } from '../../models/GeocodingFeature';
import {
  GeojsonCoordinates,
  GeojsonFeature,
} from '@survv/api/definitions/common';
import { MapboxRepo } from '../../repositories/map-box/MapboxRepo';
import { NotificationService } from '@survv/commons/shell/services/notificationService';
import { createNotification } from '../../notification';

export class SearchableMapboxModalPM extends BasePM {
  private readonly _notificationService: NotificationService;
  private readonly _mapboxRepo: MapboxRepo;
  oldSearchToken = '';
  selectedLocationName = '';
  items: GeocodingFeatureItem[] = [];
  startingPointCoordinates: GeojsonCoordinates = [];
  supportedZonesCoordinates: GeojsonCoordinates[][][] = [[[]]];
  selectedPoint: GeojsonFeature;
  supportedZones: GeojsonFeature[];

  constructor(options: SearchableMapboxModalPMOptions) {
    super();

    const {
      notificationService,
      mapboxRepo,
      startingPointCoordinates,
      supportedZonesCoordinates,
    } = options;
    this._notificationService = notificationService;
    this._mapboxRepo = mapboxRepo;

    this.startingPointCoordinates = startingPointCoordinates;
    if (supportedZonesCoordinates.length > 0) {
      this.supportedZonesCoordinates = supportedZonesCoordinates;
    }
    this.selectedPoint = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: this.startingPointCoordinates,
      },
      properties: {
        dataType: 'CUSTOMER_LOCATION',
      },
    };
    this.supportedZones =
      supportedZonesCoordinates.length > 0
        ? this.supportedZonesCoordinates.map((zoneCoordinates) => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: zoneCoordinates,
              },
              properties: {
                dataType: 'SUPPORTED_ZONES',
              },
            };
          })
        : [];
  }

  async search(searchToken: string): Promise<void> {
    if (
      searchToken &&
      searchToken.length > 4 &&
      searchToken !== this.oldSearchToken
    ) {
      this.oldSearchToken = searchToken;
      try {
        this.startLoading();
        this.items = await this._mapboxRepo.search(
          searchToken,
          this.startingPointCoordinates
        );
      } catch (err) {
        this._notificationService.notify(createNotification(err));
      } finally {
        this.stopLoading();
      }
    }
  }

  async reverseGeocoding(lng: number, lat: number): Promise<void> {
    try {
      this.startLoading();
      const feature = await this._mapboxRepo.reverseGeocoding(lng, lat);
      if (feature) {
        this.selectedLocationName = feature.placeName;
      }
    } catch (err) {
      this._notificationService.notify(createNotification(err));
    } finally {
      this.stopLoading();
    }
  }

  clickPoint(event: { lng: number; lat: number }): GeojsonFeature {
    const polygons = this.supportedZonesCoordinates;
    const foundInPolygons =
      polygons[0][0].length > 0
        ? polygons.find((polygon) => {
            return inside([event.lng, event.lat], polygon[0]);
          })
        : true;

    if (foundInPolygons) {
      this.selectedPoint = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.lng, event.lat],
        },
        properties: {
          dataType: 'CUSTOMER_LOCATION',
        },
      };
    }
    return this.selectedPoint;
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }

  setDefaultPoints(startingPointCoordinates: GeojsonCoordinates): void {
    this.startingPointCoordinates = startingPointCoordinates;
    this.selectedPoint = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: startingPointCoordinates,
      },
      properties: {
        dataType: 'CUSTOMER_LOCATION',
      },
    };
  }

  canContinue = (
    coordinates: GeojsonCoordinates,
    startingPointCoordinates: GeojsonCoordinates
  ): boolean => {
    const polygons = this.supportedZonesCoordinates;
    const foundInPolygons =
      polygons[0][0].length > 0
        ? polygons.find((polygon) => {
            return inside([coordinates[0], coordinates[1]], polygon[0]);
          })
        : true;
    return (
      coordinates.length > 0 &&
      coordinates[0] !== startingPointCoordinates[0] &&
      coordinates[1] !== startingPointCoordinates[1] &&
      !!foundInPolygons
    );
  };
}

interface SearchableMapboxModalPMOptions {
  notificationService: NotificationService;
  mapboxRepo: MapboxRepo;
  startingPointCoordinates: GeojsonCoordinates;
  supportedZonesCoordinates: GeojsonCoordinates[][][];
}

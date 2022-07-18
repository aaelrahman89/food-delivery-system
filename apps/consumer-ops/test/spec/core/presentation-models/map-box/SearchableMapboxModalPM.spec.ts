import axios from 'axios';
import { $sb } from '@survv/commons/test/utils/sandbox';
import {
  ConfigurationsListRequest,
  ConfigurationsListResponse,
} from '@survv/api/definitions/users';
import {
  GeocodingFeature,
  GeocodingFeatureItem,
} from '../../../../../src/core/models/GeocodingFeature';
import { GeojsonCoordinates } from '@survv/api/definitions/common';
import { GeojsonPoint } from '@survv/commons/core/models/GeoJSON';
import { MapboxRepoImpl } from '../../../../../src/shell/repositories/map-box/MapboxRepoImpl';
import { SearchableMapboxModalPM } from '../../../../../src/core/presentation-models/map-box/SearchableMapboxModalPM';
import { assert } from 'chai';
import { configurationItems } from '@survv/commons/core/configs/configurationItems';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('SearchableMapboxModalPM', function () {
  const startingPointCoordinates: GeojsonCoordinates = [
    31.425962448120117, 30.003780534938077,
  ];
  const supportedZonesCoordinates: GeojsonCoordinates[][][] = [
    [
      [
        [31.43583297729492, 30.056317022770106],
        [31.43553256988525, 30.05297394610351],
        [31.4417552947998, 30.052862508270838],
        [31.441712379455566, 30.05349398766455],
        [31.44227027893066, 30.055574126598156],
        [31.435704231262203, 30.05650274594218],
        [31.43583297729492, 30.056317022770106],
      ],
    ],
    [
      [
        [31.422314643859863, 30.03789155296332],
        [31.404247283935547, 30.037705794891476],
        [31.402873992919922, 30.029717868389277],
        [31.402101516723633, 30.024887647017948],
        [31.401672363281246, 30.020131506801363],
        [31.40231609344482, 30.018570848581312],
        [31.40270233154297, 30.01790198753939],
        [31.402659416198727, 30.016861528062808],
        [31.403088569641113, 30.016489932747124],
        [31.404032707214355, 30.016341294230976],
        [31.41122102737427, 30.01611833603907],
        [31.411199569702145, 30.023698633352996],
        [31.41127198934555, 30.024177027284242],
        [31.411902308464047, 30.02524992178465],
        [31.412996649742126, 30.026006978882265],
        [31.419911384582516, 30.029643559073858],
        [31.42111301422119, 30.03060957582877],
        [31.42192840576172, 30.031835660459322],
        [31.422314643859863, 30.032467273895197],
        [31.422389745712277, 30.035439518375576],
        [31.422314643859863, 30.03789155296332],
      ],
    ],
    [
      [
        [31.41740083694458, 30.056354167432385],
        [31.415662765502933, 30.05380972585134],
        [31.417980194091797, 30.05315967554596],
        [31.421241760253903, 30.052342463393572],
        [31.42343044281006, 30.051803842605974],
        [31.42643451690674, 30.052583913140506],
        [31.426734924316406, 30.05291822720285],
        [31.426670551300052, 30.053921162618092],
        [31.422765254974365, 30.053958308179123],
        [31.420834064483643, 30.054478344570693],
        [31.42014741897583, 30.054645498545135],
        [31.41740083694458, 30.056354167432385],
      ],
    ],
    [
      [
        [31.436734199523926, 30.06251998821582],
        [31.435790061950684, 30.05880568433318],
        [31.43583297729492, 30.05624273340371],
        [31.442227363586426, 30.055574126598156],
        [31.443686485290527, 30.060997140479362],
        [31.436734199523926, 30.06251998821582],
      ],
    ],
  ];
  const pm = new SearchableMapboxModalPM({
    notificationService,
    startingPointCoordinates,
    supportedZonesCoordinates,
    mapboxRepo: new MapboxRepoImpl(),
  });

  it('should start loading successfully', async function () {
    pm.startLoading();
    assert.isTrue(pm.loading);
  });

  it('should stop loading successfully', async function () {
    pm.stopLoading();
    assert.isFalse(pm.loading);
  });

  it("should validate clicking point and check if it's in the supported zones successfully", async function () {
    const selectedPointBeforeChange = [
      ...pm.selectedPoint.geometry.coordinates,
    ];
    const outOfBoundsLngLat = [31.425962448120117, 30.003780534938077];
    pm.clickPoint({ lng: outOfBoundsLngLat[0], lat: outOfBoundsLngLat[1] });
    assert.deepEqual(
      pm.selectedPoint.geometry.coordinates,
      selectedPointBeforeChange
    );

    const inBoundLngLat = [31.40841740484845, 30.027293759314574];
    pm.clickPoint({ lng: inBoundLngLat[0], lat: inBoundLngLat[1] });
    assert.deepEqual(pm.selectedPoint.geometry.coordinates, inBoundLngLat);
  });

  it('should check if user can continue successfully', async function () {
    const outOfBoundsLngLat = [31.425962448120117, 30.003780534938077];
    assert.isFalse(pm.canContinue(outOfBoundsLngLat, startingPointCoordinates));

    const inBoundLngLat = [31.40841740484845, 30.027293759314574];
    assert.isTrue(pm.canContinue(inBoundLngLat, startingPointCoordinates));
  });

  it('should handle map-box search API empty response successfully', async function () {
    const responseStub = {
      data: {
        features: [],
      },
    };
    const placeName = 'Burger 1';
    const proximityCoordinates = pm.startingPointCoordinates;
    const token = '';
    const types = 'poi,address';
    $sb
      .stub(axios, 'get')
      .withArgs(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json/?access_token=${token}&country=EG&porximity=${proximityCoordinates[0]},${proximityCoordinates[1]},types=${types}`
      )
      .resolves(responseStub);

    await pm.search('Burger 1');
    assert.isEmpty(pm.items);
  });

  it('should use map-box search API successfully', async function () {
    const responseStub = {
      data: {
        features: [
          {
            geometry: { coordinates: [34.385577, 27.978862], type: 'Point' },
            place_name:
              'Burger King, Sharm El Sheikh International Airport, Sharm El Sheikh, South Sinai 46, Egypt',
          },
          {
            geometry: { coordinates: [33.839699, 27.214686], type: 'Point' },
            place_name:
              'Burger King, Sheraton road, Hurghada, Red Sea 84, Egypt',
          },
          {
            geometry: { coordinates: [33.804334, 27.190623], type: 'Point' },
            place_name:
              'Burger King, Hurghada International Airport (HRG), Hurghada, Red Sea 84, Egypt',
          },
          {
            geometry: { coordinates: [31.397191, 30.110186], type: 'Point' },
            place_name: 'Burger King, Terminal 3, Al Shorouk, Cairo 11, Egypt',
          },
          {
            geometry: {
              coordinates: [31.3506075, 30.049767000000003],
              type: 'Point',
            },
            place_name:
              'Burger King - Makram Ebaid, Total Gas Station, Abd El Hameed Lotfy St Off Makram Ebeid St, 8th Zone, Nasr City, Nasr, Cairo 11, Egypt',
          },
        ],
      },
    };
    const placeName = 'Burger';
    const proximityCoordinates = pm.startingPointCoordinates;
    const types = 'poi,address';

    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: { keys: [configurationItems.MapboxToken] },
        },
      })
      .response({
        status: 200,
        body: {
          configurations: [
            {
              configurationKey: configurationItems.MapboxToken,
              configurationValue: 'fakeToken',
            },
          ],
        },
      });

    $sb
      .stub(axios, 'get')
      .withArgs(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json/?access_token=fakeToken&country=EG&porximity=${proximityCoordinates[0]},${proximityCoordinates[1]},types=${types}`
      )
      .resolves(responseStub);

    const itemsStub = responseStub.data.features.map(
      (feat) =>
        new GeocodingFeatureItem({
          geometry: feat.geometry as GeojsonPoint,
          text: feat.place_name,
        })
    );

    await pm.search('Burger');
    assert.deepEqual(pm.items, itemsStub);
  });

  it('should handle map-box search API errors successfully', async function () {
    const error = errorModel({
      code: 'any code',
      message: 'any message',
      args: {
        any: 'args',
      },
    });

    $sb.stub(MapboxRepoImpl.prototype, 'search').rejects(error);
    await pm.search('Burger king');
    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });

  it('should handle map-box reverse geocoding API empty response successfully', async function () {
    const selectedLocationNameBeforeChange = pm.selectedLocationName;
    const responseStub = {
      data: {
        features: [],
      },
    };

    const lng = 34.385577;
    const lat = 27.978862;
    const token = '';
    $sb
      .stub(axios, 'get')
      .withArgs(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json/?access_token=${token}&country=EG`
      )
      .resolves(responseStub);
    await pm.reverseGeocoding(34.385577, 27.978862);
    assert.equal(pm.selectedLocationName, selectedLocationNameBeforeChange);
  });

  it('should use map-box reverse geocoding API successfully', async function () {
    const responseStub = {
      data: {
        features: [
          {
            geometry: { coordinates: [34.385577, 27.978862], type: 'Point' },
            place_name:
              'Burger King, Sharm El Sheikh International Airport, Sharm El Sheikh, South Sinai 46, Egypt',
          },
          {
            geometry: { coordinates: [33.839699, 27.214686], type: 'Point' },
            place_name:
              'Burger King, Sheraton road, Hurghada, Red Sea 84, Egypt',
          },
          {
            geometry: { coordinates: [33.804334, 27.190623], type: 'Point' },
            place_name:
              'Burger King, Hurghada International Airport (HRG), Hurghada, Red Sea 84, Egypt',
          },
          {
            geometry: { coordinates: [31.397191, 30.110186], type: 'Point' },
            place_name: 'Burger King, Terminal 3, Al Shorouk, Cairo 11, Egypt',
          },
          {
            geometry: {
              coordinates: [31.3506075, 30.049767000000003],
              type: 'Point',
            },
            place_name:
              'Burger King - Makram Ebaid, Total Gas Station, Abd El Hameed Lotfy St Off Makram Ebeid St, 8th Zone, Nasr City, Nasr, Cairo 11, Egypt',
          },
        ],
      },
    };
    const itemStub = new GeocodingFeature({
      geometry: {
        coordinates: [],
        type: 'Point',
      } as GeojsonPoint,
      placeName:
        'Burger King, Sharm El Sheikh International Airport, Sharm El Sheikh, South Sinai 46, Egypt',
    });

    await wiremock
      .stub<ConfigurationsListRequest, ConfigurationsListResponse>()
      .request({
        requestLine: 'get /api/v1/configurations',
        query: {
          configurationKeys: { keys: [configurationItems.MapboxToken] },
        },
      })
      .response({
        status: 200,
        body: {
          configurations: [
            {
              configurationKey: configurationItems.MapboxToken,
              configurationValue: 'fakeToken',
            },
          ],
        },
      });

    const lng = 34.385577;
    const lat = 27.978862;

    $sb
      .stub(axios, 'get')
      .withArgs(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json/?access_token=fakeToken&country=EG`
      )
      .resolves(responseStub);
    await pm.reverseGeocoding(34.385577, 27.978862);
    assert.equal(pm.selectedLocationName, itemStub.placeName);
  });

  it('should handle map-box reverse geocoding API errors successfully', async function () {
    const error = errorModel({
      code: 'any code',
      message: 'any message',
      args: {
        any: 'args',
      },
    });

    $sb.stub(MapboxRepoImpl.prototype, 'reverseGeocoding').rejects(error);
    await pm.reverseGeocoding(31.3506075, 30.049767000000003);
    assert.deepEqual(
      notificationService.notification,
      createNotification(error)
    );
  });
});

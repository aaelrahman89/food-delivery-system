import { $sb } from '@survv/commons/test/utils/sandbox';
import { BranchForm } from '../../../../../src/core/models/BranchForm';
import { BranchRepoImpl } from '../../../../../src/shell/repositories/restaurants/branches/BranchRepoImpl';
import { BranchUpdatePM } from '../../../../../src/core/presentation-models/branches/BranchUpdatePM';
import { ContactPerson } from '../../../../../src/core/models/ContactPerson';
import { Datetime } from '@survv/commons/core/utils/datetime';
import { GeoRepoImpl } from '../../../../../src/shell/repositories/geo/GeoRepoImpl';
import { HashTagStatus } from '../../../../../src/core/models/HashTagStatus';
import { Notification } from '@survv/commons/core/notification/notification';
import { TagStatus } from '../../../../../src/core/models/TagStatus';
import { TagType } from '../../../../../src/core/models/TagType';
import { TagsSelectionPM } from '../../../../../src/core/presentation-models/online-ordering/TagsSelectionPM';
import { Time } from '@survv/commons/core/models/Time';
import { UnifiedTagsRepoImpl } from '../../../../../src/shell/repositories/online-ordering/UnifiedTagsRepoImpl';
import { VendorOnlineProfileRepoImpl } from '../../../../../src/shell/repositories/online-ordering/VendorOnlineProfileRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { albumsResponseStub } from '@survv/api/stubs/albums';
import {
  areasListResponseStub,
  areasListV2ResponseStub,
} from '@survv/api/stubs/areas';
import { assert } from 'chai';
import { cataloguesListResponseStub } from '@survv/api/stubs/catalogues';
import { citiesListV2ResponseStub } from '@survv/api/stubs/cities';
import { consumerVendorBranchDetailsResponseStub } from '@survv/api/stubs/branches';
import { consumerVendorProfileResponseStub } from '@survv/api/stubs/vendors';
import { countriesListResponseStub } from '@survv/api/stubs/countries';
import { createNotification } from '../../../../../src/core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { filterOperators, queryMapper } from '@survv/commons/core/models/Query';
import {
  mapAreaListingResponseToAreas,
  mapCityListingResponseToCities,
  mapCountryListingResponseToCountries,
} from '../../../../../src/shell/repositories/geo/mappers/responses';
import { mapBranchResponseToBranchDetails } from '../../../../../src/shell/repositories/restaurants/branches/mappers/responses';
import {
  mapBranchToBranchCreationRequest,
  mapBranchToBranchUpdateRequest,
} from '../../../../../src/shell/repositories/restaurants/branches/mappers/requests';
import { mapVendorProfileToOnlineProfile } from '../../../../../src/shell/repositories/online-ordering/mappers/responses';
import { notificationService } from '@survv/commons/shell/services/notificationService';
import { wiremock } from '@survv/commons/test/utils/wiremock';

describe('BranchUpdatePM', function () {
  it('Should handle hydration successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
  });

  it('Should handle vendor profile hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile')
      .rejects(new Error('anything'));
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle branch details hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .rejects(new Error('anything'));
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle countries hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .rejects(new Error('anything'));
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle cities hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb.stub(GeoRepoImpl.prototype, 'getCities').rejects(new Error('anything'));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should handle areas hydration errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb.stub(GeoRepoImpl.prototype, 'getAreas').rejects(new Error('anything'));

    await pm.init();

    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });

  it('Should hydrate vendor profile details successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const vendorOnlineProfile = mapVendorProfileToOnlineProfile(
      consumerVendorProfileResponseStub(),
      cataloguesListResponseStub(),
      albumsResponseStub()
    );

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/vendors/:vendorId',
        params: {
          vendorId,
        },
      })
      .response({ status: 200, body: consumerVendorProfileResponseStub() });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/albums',
        query: {
          referenceId: vendorId,
          referenceType: 'vendorOnlineProfileGallery',
        },
      })
      .response({ status: 200, body: albumsResponseStub() });

    const cataloguesQuery = {
      vgql: 'v1',
      filter: {
        elements: [
          {
            field: 'vendor.id',
            operator: filterOperators.EQUAL,
            value: vendorId,
          },
        ],
      },
    };
    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1/catalogues',
        query: { query: cataloguesQuery },
      })
      .response({
        status: 200,
        body: cataloguesListResponseStub(),
      });
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(pm.vendorOnlineProfile, vendorOnlineProfile);
  });

  it('Should hydrate branch details successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /consumer/api/v1/branches/:branchId',
        params: {
          branchId,
        },
      })
      .response({
        status: 200,
        body: consumerVendorBranchDetailsResponseStub(),
      });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.branchDetails,
      mapBranchResponseToBranchDetails(
        consumerVendorBranchDetailsResponseStub()
      )
    );
  });

  it('Should hydrate countries successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.2/countries',
      })
      .response({ status: 200, body: countriesListResponseStub() });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.countries,
      mapCountryListingResponseToCountries(countriesListResponseStub())
    );
    assert.deepEqual(
      pm.countriesSelection,
      mapCountryListingResponseToCountries(countriesListResponseStub()).map(
        (country) => ({
          value: country.id,
          label: `${country.name.en} - ${country.name.ar}`,
        })
      )
    );
  });

  it('Should hydrate cities successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const branchStub = consumerVendorBranchDetailsResponseStub();
    branchStub.address.countryId = 21234123937831514000;
    branchStub.address.cityId = 21234123937831514000;

    const beQuery = queryMapper({
      filter: {
        countryId: 21234123937831514000,
      },
      filterMap: {
        id: {
          fieldName: '_id',
          operator: filterOperators.EQUAL,
        },
        countryId: {
          fieldName: 'countryId',
          operator: filterOperators.EQUAL,
        },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/cities',
        query: { query: beQuery },
      })
      .response({ status: 200, body: citiesListV2ResponseStub() });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(mapBranchResponseToBranchDetails(branchStub));
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.cities,
      mapCityListingResponseToCities(citiesListV2ResponseStub())
    );
    assert.deepEqual(
      pm.citiesSelection,
      mapCityListingResponseToCities(citiesListV2ResponseStub()).map(
        (city) => ({
          value: city.id,
          label: `${city.name.en} - ${city.name.ar}`,
        })
      )
    );
  });

  it('Should hydrate areas successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    const branchStub = consumerVendorBranchDetailsResponseStub();
    branchStub.address.countryId = 21234123937831514000;
    branchStub.address.cityId = 21234123937831514000;

    const beQuery = queryMapper({
      filter: {
        cityId: 21234123937831514000,
      },
      filterMap: {
        id: {
          fieldName: '_id',
          operator: filterOperators.EQUAL,
        },
        cityId: {
          fieldName: 'cityId',
          operator: filterOperators.EQUAL,
        },
      },
    });

    await wiremock
      .stub()
      .request({
        requestLine: 'get /api/v1.1/areas',
        query: { query: beQuery },
      })
      .response({ status: 200, body: areasListV2ResponseStub() });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(mapBranchResponseToBranchDetails(branchStub));
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.deepEqual(
      pm.areas,
      mapAreaListingResponseToAreas(areasListResponseStub())
    );
    assert.deepEqual(
      pm.areasSelection,
      mapAreaListingResponseToAreas(areasListResponseStub()).map((area) => ({
        value: area.id,
        label: `${area.name.en} - ${area.name.ar}`,
      }))
    );
  });

  it('Should handle tags selections actions successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });
    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));
    $sb.stub(UnifiedTagsRepoImpl.prototype, 'listVisibleTagsByType').resolves({
      totalItemsCount: 1,
      items: [
        {
          id: 1163177572172112,
          name: {
            en: 'Appetizers',
            ar: 'مقبلات',
          },
          vendorType: VendorType.FOOD,
          type: TagType.HASH_TAG,
          status: HashTagStatus.VISIBLE,
          creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
          icon: '/consumer-assets/images/hash-tags.png',
        },
      ],
    });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.shouldOpenSelectionsList);
    assert.deepEqual(pm.form.tags, [
      {
        id: 1163177572172111,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: TagStatus.VISIBLE,
        icon: '',
        type: TagType.DIETARY,
      },
      {
        id: 1163177572172112,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.HASH_TAG,
      },
    ]);

    await pm.openSelectionsList();
    assert.isTrue(pm.shouldOpenSelectionsList);
    assert.deepEqual(pm.tagsSelectionsList, [
      {
        name: 'TAG_TYPE_HASH_TAG',
        items: [
          {
            id: 1163177572172112,
            label: { en: 'Appetizers', ar: 'مقبلات' },
            icon: '/consumer-assets/images/hash-tags.png',
            value: {
              id: 1163177572172112,
              vendorType: VendorType.FOOD,
              name: { en: 'Appetizers', ar: 'مقبلات' },
              creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
              status: HashTagStatus.VISIBLE,
              icon: '/consumer-assets/images/hash-tags.png',
              type: TagType.HASH_TAG,
            },
          },
        ],
      },
    ]);

    await pm.closeTagsSelection();
    assert.isFalse(pm.shouldOpenSelectionsList);
    assert.deepEqual(pm.tagsSelectionsList, []);

    await pm.addSelections([
      {
        id: 1163177572172113,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.HASH_TAG,
      },
    ]);
    assert.isFalse(pm.shouldOpenSelectionsList);
    assert.deepEqual(pm.form.tags, [
      {
        id: 1163177572172113,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.HASH_TAG,
      },
    ]);

    await pm.removeTagSelection(0);
    await pm.removeTagSelection(0);
    await pm.removeTagSelection(0);
    assert.deepEqual(pm.form.tags, []);
  });

  it('Should handle contact form actions successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.shouldOpenContactPersonForm);
    assert.equal(pm.contactPersonForm.name, '');
    assert.equal(pm.contactPersonForm.email, '');
    assert.equal(pm.contactPersonForm.title, '');
    assert.equal(pm.contactPersonForm.mobileNumber, '');

    pm.contactPersonForm.name = '1';
    pm.contactPersonForm.email = '1';
    pm.contactPersonForm.title = '1';
    pm.contactPersonForm.mobileNumber = '1';
    assert.equal(pm.contactPersonForm.name, '1');
    assert.equal(pm.contactPersonForm.email, '1');
    assert.equal(pm.contactPersonForm.title, '1');
    assert.equal(pm.contactPersonForm.mobileNumber, '1');
    assert.isTrue(pm.contactPersonForm.submittable);

    pm.openContactPersonForm();
    assert.isTrue(pm.shouldOpenContactPersonForm);
    assert.equal(pm.contactPersonForm.name, '');
    assert.equal(pm.contactPersonForm.email, '');
    assert.equal(pm.contactPersonForm.title, '');
    assert.equal(pm.contactPersonForm.mobileNumber, '');
    assert.isFalse(pm.contactPersonForm.submittable);

    pm.contactPersonForm.name = '1';
    pm.contactPersonForm.email = '1';
    pm.contactPersonForm.title = '1';
    pm.contactPersonForm.mobileNumber = '1';

    pm.closeContactPersonForm();
    assert.isFalse(pm.shouldOpenContactPersonForm);
    assert.equal(pm.contactPersonForm.name, '');
    assert.equal(pm.contactPersonForm.email, '');
    assert.equal(pm.contactPersonForm.title, '');
    assert.equal(pm.contactPersonForm.mobileNumber, '');

    pm.contactPersonForm.name = '1';
    pm.contactPersonForm.email = '1';
    pm.contactPersonForm.title = '1';
    pm.contactPersonForm.mobileNumber = '1';
    pm.submitContactPersonForm();
    assert.isFalse(pm.shouldOpenContactPersonForm);
    assert.deepEqual(pm.form.contactPersons, [
      new ContactPerson({
        fullName: 'haytham',
        mobileNo: '00',
        email: '',
        title: '',
        creationDate: new Datetime('2021-02-21T13:01:35.727Z'),
      }),
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ]);

    pm.removeContactPerson(0);
    pm.removeContactPerson(0);
    assert.deepEqual(pm.form.contactPersons, []);
  });

  it('Should handle map actions successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.shouldShowMapModal);
    assert.deepEqual(
      pm.mapConfig.point,
      [31.231727600097656, 30.036814151299254]
    );

    pm.openMapModal();
    assert.isTrue(pm.shouldShowMapModal);
    assert.deepEqual(
      pm.mapConfig.point,
      [29.967197477817535, 31.244785251998636]
    );

    pm.closeMapModal();
    assert.isFalse(pm.shouldShowMapModal);

    pm.openMapModal();
    assert.isTrue(pm.shouldShowMapModal);

    pm.submitMapModal([31, 30]);
    assert.deepEqual(pm.form.address.coordinates, [31, 30]);
    assert.isFalse(pm.shouldShowMapModal);
  });

  it('Should handle form validations successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.form.submittable);

    pm.form.label = 'test';
    pm.form.displayName.en = 'test';
    pm.form.displayName.ar = 'test';
    pm.form.opensAt = new Time('12:00:00');
    pm.form.closesAt = new Time('13:00:00');
    pm.form.minimumOrderValue = 1;
    pm.form.averageBasketSize = 1;
    pm.form.address.countryId = 1;
    pm.form.address.cityId = 1;
    pm.form.address.areaId = 1;
    pm.form.address.coordinates = [31, 30];
    pm.form.contactPersons = [
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ];
    pm.form.posIntegrated = true;
    pm.form.posIntegrationType = 'LINETEN';

    assert.isTrue(pm.form.submittable);
  });

  it('Should handle form submitting successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });
    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const branchForm = BranchForm.from(
      mapBranchResponseToBranchDetails(
        consumerVendorBranchDetailsResponseStub()
      )
    );
    branchForm.label = 'test';
    branchForm.displayName.en = 'test';
    branchForm.displayName.ar = 'test';
    branchForm.opensAt = new Time('12:00:00');
    branchForm.closesAt = new Time('13:00:00');
    branchForm.minimumOrderValue = 1;
    branchForm.averageBasketSize = 1;
    branchForm.deliveryFees = 1;
    branchForm.address.countryId = 1;
    branchForm.address.cityId = 1;
    branchForm.address.areaId = 1;
    branchForm.address.coordinates = [31, 30];
    branchForm.contactPersons = [
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ];
    branchForm.tags = [
      {
        id: 1163177572172112,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.HASH_TAG,
      },
      {
        id: 1163177572172111,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.DIETARY,
      },
    ];
    branchForm.posIntegrated = true;
    branchForm.posIntegrationType = 'LINETEN';

    assert.deepEqual(mapBranchToBranchCreationRequest(branchForm).tagIds, [
      1163177572172111,
    ]);
    assert.deepEqual(mapBranchToBranchCreationRequest(branchForm).hashTagIds, [
      1163177572172112,
    ]);
    await wiremock
      .stub()
      .request({
        requestLine: 'put /consumer/api/v1/branches/:branchId',
        params: {
          branchId,
        },
        body: mapBranchToBranchUpdateRequest(
          vendorId,
          branchForm,
          mapBranchResponseToBranchDetails(
            consumerVendorBranchDetailsResponseStub()
          )
        ),
      })
      .response({
        status: 200,
        body: {
          id: 1,
          creationDate: '2020-05-18T01:38:26.167Z',
        },
      });

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.form.submittable);

    pm.form.label = 'test';
    pm.form.displayName.en = 'test';
    pm.form.displayName.ar = 'test';
    pm.form.opensAt = new Time('12:00:00');
    pm.form.closesAt = new Time('13:00:00');
    pm.form.minimumOrderValue = 1;
    pm.form.averageBasketSize = 1;
    pm.form.deliveryFees = 1;
    pm.form.address.countryId = 1;
    pm.form.address.cityId = 1;
    pm.form.address.areaId = 1;
    pm.form.address.coordinates = [31, 30];
    pm.form.contactPersons = [
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ];
    pm.form.tags = [
      {
        id: 1163177572172112,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.HASH_TAG,
      },
      {
        id: 1163177572172111,
        vendorType: VendorType.FOOD,
        name: { en: 'Appetizers', ar: 'مقبلات' },
        creationDate: new Datetime('2020-05-18T01:38:26.167Z'),
        status: HashTagStatus.VISIBLE,
        icon: '/consumer-assets/images/hash-tags.png',
        type: TagType.DIETARY,
      },
    ];
    pm.form.posIntegrated = true;
    pm.form.posIntegrationType = 'LINETEN';
    assert.isTrue(pm.form.submittable);

    await pm.submit();
    assert.deepEqual(
      notificationService.notification,
      Notification.successfulOperation()
    );
  });

  it('Should handle form submitting errors successfully', async function () {
    const vendorId = 123456;
    const branchId = 1308972535098256;
    const pm = new BranchUpdatePM({
      vendorId,
      branchId,
      branchRepo: new BranchRepoImpl(),
      geoRepo: new GeoRepoImpl(),
      vendorOnlineProfileRepo: new VendorOnlineProfileRepoImpl(),
      tagsSelectionPM: new TagsSelectionPM({
        vendorType: new VendorType('food'.toUpperCase()),
        notificationService,
        unifiedTagsRepo: new UnifiedTagsRepoImpl(),
      }),
      notificationService,
    });

    $sb.stub(VendorOnlineProfileRepoImpl.prototype, 'getProfile').resolves();
    $sb
      .stub(BranchRepoImpl.prototype, 'getBranchDetails')
      .resolves(
        mapBranchResponseToBranchDetails(
          consumerVendorBranchDetailsResponseStub()
        )
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCountries')
      .resolves(
        mapCountryListingResponseToCountries(countriesListResponseStub())
      );
    $sb
      .stub(GeoRepoImpl.prototype, 'getCities')
      .resolves(mapCityListingResponseToCities(citiesListV2ResponseStub()));
    $sb
      .stub(GeoRepoImpl.prototype, 'getAreas')
      .resolves(mapAreaListingResponseToAreas(areasListResponseStub()));

    const branchForm = new BranchForm();
    branchForm.label = 'test';
    branchForm.displayName.en = 'test';
    branchForm.displayName.ar = 'test';
    branchForm.opensAt = new Time('12:00:00');
    branchForm.closesAt = new Time('13:00:00');
    branchForm.minimumOrderValue = 1;
    branchForm.averageBasketSize = 1;
    branchForm.address.countryId = 1;
    branchForm.address.cityId = 1;
    branchForm.address.areaId = 1;
    branchForm.address.coordinates = [31, 30];
    branchForm.contactPersons = [
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ];
    branchForm.posIntegrated = true;
    branchForm.posIntegrationType = 'LINETEN';

    const errModel = errorModel({ code: 'any', message: 'example error' });

    $sb
      .stub(BranchRepoImpl.prototype, 'updateBranch')
      .rejects(new Error('anything'));

    await pm.init();

    assert.isUndefined(notificationService.notification);
    assert.isFalse(pm.form.submittable);

    pm.form.label = 'test';
    pm.form.displayName.en = 'test';
    pm.form.displayName.ar = 'test';
    pm.form.opensAt = new Time('12:00:00');
    pm.form.closesAt = new Time('13:00:00');
    pm.form.minimumOrderValue = 1;
    pm.form.averageBasketSize = 1;
    pm.form.address.countryId = 1;
    pm.form.address.cityId = 1;
    pm.form.address.areaId = 1;
    pm.form.address.coordinates = [31, 30];
    pm.form.contactPersons = [
      new ContactPerson({
        fullName: '1',
        email: '1',
        mobileNo: '1',
        title: '1',
        creationDate: new Datetime(0),
      }),
    ];
    pm.form.posIntegrated = true;
    pm.form.posIntegrationType = 'LINETEN';

    assert.isTrue(pm.form.submittable);

    await pm.submit();
    assert.deepEqual(
      notificationService.notification,
      createNotification(errModel)
    );
  });
});

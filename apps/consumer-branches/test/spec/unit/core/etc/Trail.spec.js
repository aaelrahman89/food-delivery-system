import Distance from '../../../../../src/core/deprecated/etc/Distance';
import Duration from '../../../../../src/core/deprecated/etc/Duration';
import Trail from '../../../../../src/core/deprecated/etc/Trail';
import { assert } from 'chai';
import { formatDateTime } from '../../../../../src/shell/services-deprecated/formatters/formatters';

describe('Trail Unit', function () {
  it('should have an assignment property if assignmentLocation was valid and an assignmentDate existed', function () {
    const testCases = [
      new Trail(),
      new Trail({
        assignmentLocation: {
          type: 'Point',
          coordinates: [],
        },
        assignmentDate: '2018-09-01T18:04:53.178Z',
      }),
      new Trail({
        assignmentLocation: {
          type: 'Point',
          coordinates: [0, 0],
        },
        assignmentDate: '2018-09-01T18:04:53.178Z',
      }),
      new Trail({
        assignmentLocation: {
          type: 'Point',
          coordinates: [1, 0],
        },
        assignmentDate: '2018-09-01T18:04:53.178Z',
      }),
    ];

    assert.isUndefined(
      testCases[0].tripAssignment,
      'testCases[0].tripAssignment should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[1].tripAssignment,
      'testCases[1].tripAssignment should be undefined on [0,0]'
    );
    assert.isUndefined(
      testCases[2].tripAssignment,
      'testCases[2].tripAssignment should be undefined if no assignmentDate'
    );
    assert.deepEqual(testCases[3].tripAssignment, {
      location: {
        type: 'Point',
        coordinates: [1, 0],
      },
      date: '2018-09-01T18:04:53.178Z',
    });
  });

  it('should have a branch property if its location was valid', function () {
    const testCases = [
      new Trail({
        branch: {
          location: {
            type: 'Point',
            coordinates: [],
          },
        },
      }),
      new Trail({
        branch: {
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      }),
      new Trail({
        branch: {
          id: 123,
          label: '1234',
          location: {
            type: 'Point',
            coordinates: [-1, 2],
          },
        },
      }),
    ];

    assert.isUndefined(
      testCases[0].branch,
      'testCases[0].branch should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[1].branch,
      'testCases[1].branch should be undefined on [0,0]'
    );
    assert.deepEqual(testCases[2].branch, {
      id: 123,
      label: '1234',
      location: {
        type: 'Point',
        coordinates: [-1, 2],
      },
    });
  });

  it('should have a branchHub property if its location was valid', function () {
    const testCases = [
      new Trail({
        branchHub: {
          location: {
            type: 'Point',
            coordinates: [],
          },
        },
      }),
      new Trail({
        branchHub: {
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      }),
      new Trail({
        branchHub: {
          id: 123,
          label: '1234',
          location: {
            type: 'Point',
            coordinates: [0, 30],
          },
        },
      }),
    ];
    assert.isUndefined(
      testCases[0].branchHub,
      'testCases[0].branchHub should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[1].branchHub,
      'testCases[1].branchHub should be undefined on [0,0]'
    );
    assert.deepEqual(testCases[2].branchHub, {
      id: 123,
      label: '1234',
      location: {
        type: 'Point',
        coordinates: [0, 30],
      },
    });
  });

  it('should have a pilotHub property if its location was valid', function () {
    const testCases = [
      new Trail({
        pilotHub: {
          location: {
            type: 'Point',
            coordinates: [],
          },
        },
      }),
      new Trail({
        pilotHub: {
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      }),
      new Trail({
        pilotHub: {
          id: 123,
          label: '1234',
          location: {
            type: 'Point',
            coordinates: [0, 30],
          },
        },
      }),
    ];

    assert.isUndefined(
      testCases[0].pilotHub,
      'testCases[0].pilotHub should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[1].pilotHub,
      'testCases[1].pilotHub should be undefined on [0,0]'
    );
    assert.deepEqual(testCases[2].pilotHub, {
      id: 123,
      label: '1234',
      location: {
        type: 'Point',
        coordinates: [0, 30],
      },
    });
  });

  it('should have a taskTrail property if taskTrail was valid', function () {
    const testCases = [
      new Trail(),
      new Trail({
        taskTrail: {
          type: 'LineString',
          coordinates: [],
        },
      }),
      new Trail({
        taskTrail: {
          type: 'Point',
          coordinates: [0, 0],
        },
      }),
      new Trail({
        taskTrail: {
          type: 'LineString',
          coordinates: [30, 30],
        },
      }),
      new Trail({
        taskTrail: {
          type: 'LineString',
          coordinates: [[], []],
        },
      }),
      new Trail({
        taskTrail: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 9],
          ],
        },
      }),
    ];

    assert.isUndefined(
      testCases[0].taskTrail,
      'testCases[2].taskTrail should be undefined on point'
    );
    assert.isUndefined(
      testCases[1].taskTrail,
      'testCases[1].taskTrail should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[2].taskTrail,
      'testCases[2].taskTrail should be undefined on [0, 0]'
    );
    assert.isUndefined(
      testCases[3].taskTrail,
      'testCases[2].taskTrail should be undefined on [30, 30]'
    );
    assert.isUndefined(
      testCases[4].taskTrail,
      'testCases[4].taskTrail should be undefined on [[],[]]'
    );
    assert.deepEqual(testCases[5].taskTrail, {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 9],
      ],
    });
  });

  it('should have a tripTrail property if tripTrail was valid', function () {
    const testCases = [
      new Trail(),
      new Trail({
        tripTrail: {
          type: 'LineString',
          coordinates: [],
        },
      }),
      new Trail({
        tripTrail: {
          type: 'Point',
          coordinates: [0, 0],
        },
      }),
      new Trail({
        tripTrail: {
          type: 'LineString',
          coordinates: [30, 30],
        },
      }),
      new Trail({
        tripTrail: {
          type: 'LineString',
          coordinates: [[], []],
        },
      }),
      new Trail({
        tripTrail: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 9],
          ],
        },
      }),
    ];

    assert.isUndefined(
      testCases[0].tripTrail,
      'testCases[2].tripTrail should be undefined on point'
    );
    assert.isUndefined(
      testCases[1].tripTrail,
      'testCases[1].tripTrail should be undefined on empty coordinates'
    );
    assert.isUndefined(
      testCases[2].tripTrail,
      'testCases[2].tripTrail should be undefined on [0, 0]'
    );
    assert.isUndefined(
      testCases[3].tripTrail,
      'testCases[2].tripTrail should be undefined on [30, 30]'
    );
    assert.isUndefined(
      testCases[4].tripTrail,
      'testCases[4].tripTrail should be undefined on [[],[]]'
    );
    assert.deepEqual(testCases[5].tripTrail, {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 9],
      ],
    });
  });

  it('should have an array of tripTasks with valid locations', function () {
    const testCases = [
      new Trail({
        tripTasks: [],
      }),
      new Trail({
        tripTasks: [
          {
            id: 123,
            pinnedDestinationPoint: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
          {
            id: 123,
            pinnedDestinationPoint: {
              type: 'Point',
              coordinates: [],
            },
          },
          {
            id: 123,
            pinnedDestinationPoint: {
              type: 'Point',
              coordinates: [-1, -2],
            },
            distanceInMeters: 1234,
            distanceFromLastTaskInMeters: 123,
            durationInSeconds: 120,
            durationSinceLastTask: 30,
          },
          {
            id: 568,
            pinnedDestinationPoint: {
              type: 'Point',
              coordinates: [2, 4],
            },
          },
        ],
      }),
    ];

    assert.isUndefined(
      testCases[0].tripTasks,
      'testCases[0].tripTasks should be undefined on empty array'
    );
    assert.deepEqual(testCases[1].tripTasks, [
      {
        id: 123,
        pinnedDestinationPoint: {
          type: 'Point',
          coordinates: [-1, -2],
        },
        distanceInMeters: 1234,
        distanceFromLastTaskInMeters: 123,
        durationInSeconds: 120,
        durationSinceLastTask: 30,
        totalDistance: new Distance({ value: 1234 }),
        distanceFromPreviousTask: new Distance({ value: 123 }),
        totalDuration: new Duration({ value: 120 }),
        durationSincePreviousTask: new Duration({ value: 30 }),
      },
      {
        id: 568,
        pinnedDestinationPoint: {
          type: 'Point',
          coordinates: [2, 4],
        },
        totalDistance: new Distance(),
        distanceFromPreviousTask: new Distance(),
        totalDuration: new Duration(),
        durationSincePreviousTask: new Duration(),
      },
    ]);
  });

  it('should have zone property with rate if zone polygon was valid', function () {
    const testCases = [
      new Trail({
        rate: {
          name: {
            en: 'en',
            ar: 'ar',
          },
        },
        zone: {
          name: {
            en: 'en',
            ar: 'ar',
          },
          polygon: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [31.01, 30.2],
              ],
            ],
          },
        },
      }),
      new Trail({
        rate: {
          name: {
            en: 'en',
            ar: 'ar',
          },
        },
        zone: {
          name: {
            en: 'en',
            ar: 'ar',
          },
          polygon: {
            type: 'Polygon',
            coordinates: [
              [
                [31.33620500564575, 30.0691125343747],
                [31.3374924659729, 30.06190713767529],
                [31.3450026512146, 30.063114263904346],
                [31.343908309936523, 30.070635257254107],
                [31.33620500564575, 30.0691125343747],
              ],
            ],
          },
        },
      }),
    ];

    assert.isUndefined(
      testCases[0].zone,
      'testCases[0].branch should be undefined on [0,0]'
    );

    assert.deepEqual(testCases[1].zone, {
      name: {
        en: 'en',
        ar: 'ar',
      },
      rate: {
        name: {
          en: 'en',
          ar: 'ar',
        },
      },
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [31.33620500564575, 30.0691125343747],
            [31.3374924659729, 30.06190713767529],
            [31.3450026512146, 30.063114263904346],
            [31.343908309936523, 30.070635257254107],
            [31.33620500564575, 30.0691125343747],
          ],
        ],
      },
    });
  });

  context('extracting Geojson data', function () {
    let tripTrail;
    let taskTrail;
    let tripTasks;
    let branch;
    let branchHub;
    let pilotHub;
    let assignmentLocation;
    let assignmentDate;
    let tripTypeExpectedGeojson;
    let zone;
    let rate;
    beforeEach('reset data', function () {
      tripTrail = {
        type: 'LineString',
        coordinates: [
          [31.262775, 29.955953],
          [31.262794, 29.955841],
          [31.262776, 29.955767],
          [31.263798, 29.955514],
          [31.263975, 29.955242],
          [31.264149, 29.954988],
          [31.264696, 29.954214],
        ],
      };

      taskTrail = {
        type: 'LineString',
        coordinates: [
          [1, 1.6],
          [1, 1.5],
          [1, 1.4],
          [1, 1.3],
          [1, 1.2],
        ],
      };

      tripTasks = [
        {
          id: 123,
          sequence: 4,
          distanceInMeters: 3350,
          distanceFromLastTaskInMeters: 3350,
          durationInSeconds: 90,
          durationSinceLastTask: 90,
          totalDistance: new Distance({ value: 3350 }),
          distanceFromPreviousTask: new Distance({ value: 3350 }),
          totalDuration: new Duration({ value: 90 }),
          durationSincePreviousTask: new Duration({ value: 90 }),
          pinnedDestinationPoint: {
            type: 'Point',
            coordinates: [31.262612, 29.956922],
          },
          reachedDestinationDate: '2018-09-01T18:04:53.178Z',
        },
        {
          id: 456,
          sequence: 2,
          distanceInMeters: 3350,
          distanceFromLastTaskInMeters: 3350,
          durationInSeconds: 90,
          durationSinceLastTask: 90,
          totalDistance: new Distance({ value: 3350 }),
          distanceFromPreviousTask: new Distance({ value: 3350 }),
          totalDuration: new Duration({ value: 90 }),
          durationSincePreviousTask: new Duration({ value: 90 }),
          pinnedDestinationPoint: {
            type: 'Point',
            coordinates: [31.262614, 29.956924],
          },
          reachedDestinationDate: '2018-09-01T18:04:53.178Z',
        },
      ];

      branch = {
        id: 9921381276774878,
        label: 'Bakaka Dessa',
        location: {
          type: 'Point',
          coordinates: [31.262775, 29.955953],
        },
      };
      pilotHub = {
        id: 9921381276774878,
        label: 'Bakaka Dessa',
        location: {
          type: 'Point',
          coordinates: [31.262612, 29.956922],
        },
      };
      branchHub = {
        id: 9921381276774878,
        label: 'Bakaka Dessa',
        location: {
          type: 'Point',
          coordinates: [31.264149, 29.954988],
        },
      };
      assignmentDate = '2019-04-16T10:12:33.055Z';
      assignmentLocation = {
        type: 'Point',
        coordinates: [31.262776, 29.955767],
      };
      rate = {
        rateId: 9921381276774878,
        name: {
          en: 'R1',
          ar: 'R1',
        },
      };

      zone = {
        name: {
          en: 'Main Menu',
          ar: 'القائمة الرئيسية',
        },
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [31.33620500564575, 30.0691125343747],
              [31.3374924659729, 30.06190713767529],
              [31.3450026512146, 30.063114263904346],
              [31.343908309936523, 30.070635257254107],
              [31.33620500564575, 30.0691125343747],
            ],
          ],
        },
      };

      tripTypeExpectedGeojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: tripTrail,
            properties: {
              dataType: 'TRIP_TRAIL',
            },
          },
          {
            type: 'Feature',
            geometry: taskTrail,
            properties: {
              dataType: 'TASK_TRAIL',
            },
          },
          {
            type: 'Feature',
            geometry: tripTasks[0].pinnedDestinationPoint,
            properties: {
              dataType: 'DELIVERY_POINT',
              sequence: tripTasks[0].sequence,
              template:
                `<div><h4 style="display: inline">Reaching Date:</h4> ${formatDateTime(
                  tripTasks[0].reachedDestinationDate
                )}</div>` +
                `<div><h4 style="display: inline">Total Distance:</h4> ${
                  tripTasks[0].totalDistance.toKm().value
                } km</div>` +
                `<div><h4 style="display: inline">Distance From Previous Order:</h4> ${
                  tripTasks[0].distanceFromPreviousTask.toKm().value
                } km</div>` +
                `<div><h4 style="display: inline">Total Duration:</h4> ${tripTasks[0].totalDuration.humanize()}</div>` +
                `<div><h4 style="display: inline">Duration Since Previous Order:</h4> ${tripTasks[0].durationSincePreviousTask.humanize()}</div>`,
            },
          },
          {
            type: 'Feature',
            geometry: tripTasks[1].pinnedDestinationPoint,
            properties: {
              dataType: 'DELIVERY_POINT',
              sequence: tripTasks[1].sequence,
              template:
                `<div><h4 style="display: inline">Reaching Date:</h4> ${formatDateTime(
                  tripTasks[1].reachedDestinationDate
                )}</div>` +
                `<div><h4 style="display: inline">Total Distance:</h4> ${
                  tripTasks[1].totalDistance.toKm().value
                } km</div>` +
                `<div><h4 style="display: inline">Distance From Previous Order:</h4> ${
                  tripTasks[1].distanceFromPreviousTask.toKm().value
                } km</div>` +
                `<div><h4 style="display: inline">Total Duration:</h4> ${tripTasks[1].totalDuration.humanize()}</div>` +
                `<div><h4 style="display: inline">Duration Since Previous Order:</h4> ${tripTasks[1].durationSincePreviousTask.humanize()}</div>`,
            },
          },
          {
            type: 'Feature',
            geometry: branch.location,
            properties: {
              dataType: 'BRANCH_LOCATION',
              template: `<h3>${branch.label}</h3>`,
            },
          },
          {
            type: 'Feature',
            geometry: branchHub.location,
            properties: {
              dataType: 'BRANCH_HUB',
              template: `<h3>Branch Hub</h3><div>${branchHub.label}</div>`,
            },
          },
          {
            type: 'Feature',
            geometry: pilotHub.location,
            properties: {
              dataType: 'PILOT_HUB',
              template: `<h3>Pilot Hub</h3><div>${pilotHub.label}</div>`,
            },
          },
          {
            type: 'Feature',
            geometry: assignmentLocation,
            properties: {
              dataType: 'ASSIGNMENT_LOCATION',
              template: `<h3>Assignment Location</h3><div>${formatDateTime(
                assignmentDate
              )}</div>`,
            },
          },
          {
            type: 'Feature',
            geometry: zone.polygon,
            properties: {
              dataType: 'TASK_ZONE',
              en: zone.name.en,
              ar: zone.name.ar,
              rateText: `${rate.name.en} - ${rate.name.ar}`,
              rate: rate.name.en.toUpperCase(),
            },
          },
        ],
      };
    });

    it('should return a feature collection of all existing data', function () {
      const trail = new Trail({
        id: 9921381276774878,
        taskTrail,
        tripTrail,
        tripTasks,
        branch,
        branchHub,
        pilotHub,
        assignmentDate,
        assignmentLocation,
        zone,
        rate,
      });

      assert.deepEqual(trail.toGeojson(), tripTypeExpectedGeojson);
    });

    it('should return a feature collection without undefined data', function () {
      const trail = new Trail({
        id: 9921381276774878,
        tripTrail,
        branchHub,
      });

      const partialGeojson = {
        type: 'FeatureCollection',
        features: [
          ...tripTypeExpectedGeojson.features.filter(
            (feature) =>
              feature.properties.dataType == 'TRIP_TRAIL' ||
              feature.properties.dataType == 'BRANCH_HUB'
          ),
        ],
      };

      assert.deepEqual(trail.toGeojson(), partialGeojson);
    });

    it('should return empty feature collection if the all data was undefined', function () {
      const trail = new Trail({
        id: 1234,
      });

      assert.deepEqual(trail.toGeojson(), {
        type: 'FeatureCollection',
        features: [],
      });
    });

    it('should add inactive = true to tripTrail and tripTasks not matching its id when entityType is TASK', function () {
      const trail = new Trail({
        entityType: Trail.entityType.TASK,
        id: 123,
        taskTrail,
        tripTrail,
        tripTasks,
        branch,
        branchHub,
        pilotHub,
        assignmentDate,
        assignmentLocation,
        zone,
        rate,
      });

      const taskTypeExpectedGeojson = {
        type: 'FeatureCollection',
        features: tripTypeExpectedGeojson.features.map((feature) => {
          const mappedFeature = feature;
          if (feature.properties.dataType == 'TRIP_TRAIL') {
            mappedFeature.properties.inactive = true;
          }
          if (
            feature.properties.dataType == 'DELIVERY_POINT' &&
            trail.id !=
              tripTasks.find(
                (task) => task.sequence == feature.properties.sequence
              ).id
          ) {
            mappedFeature.properties.inactive = true;
          }
          return mappedFeature;
        }),
      };

      assert.deepEqual(trail.toGeojson(), taskTypeExpectedGeojson);
    });
  });
});

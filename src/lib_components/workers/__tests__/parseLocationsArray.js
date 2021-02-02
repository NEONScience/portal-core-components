import parseLocationsArray from '../parseLocationsArray';

const restInput = [
  {
    locationName: 'TOWER100081',
    locationDescription: 'Ordway-Swisher Tower',
    locationType: 'TOWER',
    domainCode: 'D03',
    siteCode: 'OSBS',
    locationDecimalLatitude: 29.689289,
    locationDecimalLongitude: -81.993431,
    locationElevation: 46.0339,
    locationUtmEasting: 403886.33936,
    locationUtmNorthing: 3284769.59499,
    locationUtmHemisphere: 'N',
    locationUtmZone: 17,
    alphaOrientation: 0,
    betaOrientation: 0,
    gammaOrientation: 0,
    xOffset: 0,
    yOffset: 0,
    zOffset: 0,
    offsetLocation: null,
    locationProperties: [
      {
        locationPropertyName: 'Value for Coordinate source',
        locationPropertyValue: 'Geomorphology Midpoint',
      },
      {
        locationPropertyName: 'Value for Coordinate uncertainty',
        locationPropertyValue: 10.0,
      },
      {
        locationPropertyName: 'Value for "DURATION"',
        locationPropertyValue: 'Core',
      },
      {
        locationPropertyName: 'Value for Elevation uncertainty',
        locationPropertyValue: 10.0,
      },
      {
        locationPropertyName: 'Value for Geodetic-(datum)',
        locationPropertyValue: 'WGS84',
      },
      {
        locationPropertyName: 'Value for Geodetic datum',
        locationPropertyValue: 'WGS84',
      },
      {
        locationPropertyName: 'Value for HABITAT',
        locationPropertyValue: 'Aquatic Wadeable Stream',
      },
      {
        locationPropertyName: 'Value for Has Location-Started Receiving Data?',
        locationPropertyValue: 'N',
      },
      {
        locationPropertyName: 'Value for IS_ACTIVE',
        locationPropertyValue: 'Yes',
      },
      {
        locationPropertyName: 'Value for Site Timezone',
        locationPropertyValue: 'US/Mountain',
      },
      {
        locationPropertyName: 'Value for Country',
        locationPropertyValue: 'USA',
      },
      {
        locationPropertyName: 'Value for County',
        locationPropertyValue: 'Putnam',
      },
      {
        locationPropertyName: 'Value for Required Asset Management Location Code',
        locationPropertyValue: 'TOWER100081',
      },
      {
        locationPropertyName: 'Value for Required Asset Management Location ID',
        locationPropertyValue: 802,
      },
      {
        locationPropertyName: 'Value for State province',
        locationPropertyValue: 'FL',
      },
      {
        locationPropertyName: 'Value for UTM Zone',
        locationPropertyValue: '17N',
      },
    ],
    locationParent: 'OSBS',
    locationParentUrl: 'https://int-data.neonscience.org/api/v0/locations/OSBS',
    locationChildren: [
      'LEVEL100125',
      'LEVEL100127',
      'LEVEL100129',
      'LEVEL100123',
      'LEVEL100128',
      'LEVEL100124',
      'LEVEL100126',
    ],
    locationChildrenUrls: [
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100125',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100127',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100129',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100123',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100128',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100124',
      'https://int-data.neonscience.org/api/v0/locations/LEVEL100126',
    ],
  },
];

const expectedRestOutput = {
  TOWER100081: {
    name: 'TOWER100081',
    type: 'TOWER',
    description: 'Ordway-Swisher Tower',
    siteCode: 'OSBS',
    parent: 'OSBS',
    children: [
      'LEVEL100125',
      'LEVEL100127',
      'LEVEL100129',
      'LEVEL100123',
      'LEVEL100128',
      'LEVEL100124',
      'LEVEL100126',
    ],
    latitude: 29.689289,
    longitude: -81.993431,
    elevation: 46.0339,
  },
};

const graphqlInput = [
  {
    locationName: 'ABBY_007.basePlot.all',
    locationDescription: 'Plot "ABBY_007" at site "ABBY"',
    locationParent: 'ABBY',
    locationType: 'OS Plot - all',
    domainCode: 'D16',
    siteCode: 'ABBY',
    locationDecimalLatitude: 45.768936,
    locationDecimalLongitude: -122.361007,
    locationElevation: 444.48,
    locationPolygon: null,
    locationProperties: [
      {
        locationPropertyName: 'Value for Coordinate source',
        locationPropertyValue: 'Geo 7X (H-Star)',
      },
      {
        locationPropertyName: 'Value for Coordinate uncertainty',
        locationPropertyValue: 0.23,
      },
      {
        locationPropertyName: 'Value for Country',
        locationPropertyValue: 'unitedStates',
      },
      {
        locationPropertyName: 'Value for County',
        locationPropertyValue: 'Clark',
      },
      {
        locationPropertyName: 'Value for Elevation uncertainty',
        locationPropertyValue: 0.26,
      },
      {
        locationPropertyName: 'Value for Filtered positions',
        locationPropertyValue: 747,
      },
      {
        locationPropertyName: 'Value for Geodetic datum',
        locationPropertyValue: 'WGS84',
      },
      {
        locationPropertyName: 'Value for Horizontal dilution of precision',
        locationPropertyValue: 5.7,
      },
      {
        locationPropertyName: 'Value for Maximum elevation',
        locationPropertyValue: 454.29,
      },
      {
        locationPropertyName: 'Value for Minimum elevation',
        locationPropertyValue: 437.62,
      },
      {
        locationPropertyName: 'Value for National Land Cover Database (2001)',
        locationPropertyValue: 'evergreenForest',
      },
      {
        locationPropertyName: 'Value for Plot dimensions',
        locationPropertyValue: '40m x 40m',
      },
      {
        locationPropertyName: 'Value for Plot ID',
        locationPropertyValue: 'ABBY_007',
      },
      {
        locationPropertyName: 'Value for Plot size',
        locationPropertyValue: 1600,
      },
      {
        locationPropertyName: 'Value for Plot subtype',
        locationPropertyValue: 'basePlot',
      },
      {
        locationPropertyName: 'Value for Plot type',
        locationPropertyValue: 'distributed',
      },
      {
        locationPropertyName: 'Value for Positional dilution of precision',
        locationPropertyValue: 6.7,
      },
      {
        locationPropertyName: 'Value for Reference Point Position',
        locationPropertyValue: '41',
      },
      {
        locationPropertyName: 'Value for Slope aspect',
        locationPropertyValue: 225,
      },
      {
        locationPropertyName: 'Value for Slope gradient',
        locationPropertyValue: 9.65,
      },
      {
        locationPropertyName: 'Value for Soil type order',
        locationPropertyValue: 'Inceptisols',
      },
      {
        locationPropertyName: 'Value for State province',
        locationPropertyValue: 'WA',
      },
      {
        locationPropertyName: 'Value for UTM Zone',
        locationPropertyValue: '10N',
      },
    ],
  },
];

const expectedGraphqlOutput = {
  'ABBY_007.basePlot.all': {
    name: 'ABBY_007.basePlot.all',
    type: 'OS Plot - all',
    description: 'Plot "ABBY_007" at site "ABBY"',
    siteCode: 'ABBY',
    parent: 'ABBY',
    maximumElevation: 454.29,
    minimumElevation: 437.62,
    nlcdClass: 'evergreenForest',
    plotDimensions: '40m x 40m',
    plotId: 'ABBY_007',
    plotSize: 1600,
    plotSubtype: 'basePlot',
    plotType: 'distributed',
    slopeAspect: 225,
    slopeGradient: 9.65,
    latitude: 45.768936,
    longitude: -122.361007,
    elevation: 444.48,
  },
};

describe('parseLocationsArray worker', () => {
  test('generates an empty object from no input', (done) => {
    parseLocationsArray().then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual({});
        done();
      } catch (error) { done(error); }
    });
  });
  test('generates an empty object from an empty array input', (done) => {
    parseLocationsArray([]).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual({});
        done();
      } catch (error) { done(error); }
    });
  });
  test('ignores invalid input objects', (done) => {
    const input = [
      { locationDescription: 'foo' },
      { '': 'foo' },
      {},
    ];
    parseLocationsArray(input).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual({});
        done();
      } catch (error) { done(error); }
    });
  });
  test('generates expected output from REST data', (done) => {
    parseLocationsArray(restInput).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual(expectedRestOutput);
        done();
      } catch (error) { done(error); }
    });
  });
  test('generates expected output from GraphQL data', (done) => {
    parseLocationsArray(graphqlInput).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual(expectedGraphqlOutput);
        done();
      } catch (error) { done(error); }
    });
  });
  test('generates expected output when locationType is SOIL_PLOT', (done) => {
    const input = [
      { locationName: 'Foo', locationType: 'SOIL_PLOT', locationProperties: [{}, {}] },
    ];
    const expectedOutput = {
      Foo: {
        name: 'Foo',
        plotType: 'tower',
        type: 'SOIL_PLOT',
        description: null,
        parent: null,
        siteCode: null,
      },
    };
    parseLocationsArray(input).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual(expectedOutput);
        done();
      } catch (error) { done(error); }
    });
  });
  test('generates expected output when locationPolygon is present', (done) => {
    const input = [{
      locationName: 'Foo',
      locationPolygon: {
        coordinates: [
          { latitude: 38.248202, longitude: -109.388458, elevation: 1798.21 },
          { latitude: 38.248216, longitude: -109.388404, elevation: 1798.37 },
          { latitude: 38.248259, longitude: -109.388422, elevation: 1798.32 },
          { latitude: 38.248244, longitude: -109.388476, elevation: 1798.2 },
          { latitude: 38.248202, longitude: -109.388458, elevation: 1798.21 },
        ],
      },
    }];
    const expectedOutput = {
      Foo: {
        description: null,
        elevation: 1798.26,
        geometry: {
          coordinates: [
            [38.248202, -109.388458],
            [38.248216, -109.388404],
            [38.248259, -109.388422],
            [38.248244, -109.388476],
            [38.248202, -109.388458],
          ],
        },
        latitude: 38.2482246,
        longitude: -109.3884436,
        name: 'Foo',
        parent: null,
        siteCode: null,
        type: null,
      },
    };
    parseLocationsArray(input).then((actualOutput) => {
      try {
        expect(actualOutput).toStrictEqual(expectedOutput);
        done();
      } catch (error) { done(error); }
    });
  });
});

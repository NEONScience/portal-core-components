import React from 'react';
import renderer from 'react-test-renderer';

import ExternalHost from '../ExternalHost';
import sitesJSON from '../../../../sampleData/sites.json';

const { getByHostId, getByProductCode } = ExternalHost;

describe('ExternalHost', () => {
  test('getByProductCode and getByHostId return same host for congruent inputs', () => {
    expect(getByProductCode('DP1.00001.001')).toStrictEqual(getByHostId('AMERIFLUX'));
    expect(getByProductCode('DP1.00042.001')).toStrictEqual(getByHostId('PHENOCAM'));
    expect(getByProductCode('DP1.10038.001')).toStrictEqual(getByHostId('BOLD'));
    expect(getByProductCode('NOT VALID')).toStrictEqual(getByHostId('NOT VALID'));
  });

  /**
     AERONET
  */
  describe('AERONET', () => {
    test('getSiteLink with no args', () => {
      const tree = renderer
        .create(getByHostId('AERONET').getSiteLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').getSiteLink(sitesJSON, 'ABBY'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').getSiteLink(sitesJSON, 'ABBY', 'DP1.00043.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').renderLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').renderLink('DP1.00043.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').renderShortLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AERONET').renderShortLink('DP1.00043.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     AMERIFLUX
  */
  describe('AMERIFLUX', () => {
    test('getSiteLink with no args', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').getSiteLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').getSiteLink(sitesJSON, 'ABBY'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').getSiteLink(sitesJSON, 'ABBY', 'DP1.00001.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').renderLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').renderLink('DP1.00001.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').renderShortLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('AMERIFLUX').renderShortLink('DP1.00001.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     PHENOCAM
  */
  describe('PHENOCAM', () => {
    test('getSiteLink with no args', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').getSiteLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').getSiteLink(sitesJSON, 'ABBY'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').getSiteLink(sitesJSON, 'ABBY', 'DP1.00033.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').renderLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').renderLink('DP1.00033.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').renderShortLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('PHENOCAM').renderShortLink('DP1.00033.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     BOLD
  */
  describe('BOLD', () => {
    test('getProductLinks with no arg', () => {
      const tree = renderer
        .create(getByHostId('BOLD').getProductLinks())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('getProductLinks with a valid productCode', () => {
      const tree = renderer
        .create((
          <div>
            {getByHostId('BOLD').getProductLinks('DP1.10020.001').map((link) => (
              <div key={link.key}>{link.node}</div>
            ))}
          </div>
        ))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('BOLD').renderLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('BOLD').renderLink('DP1.10020.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('BOLD').renderShortLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('BOLD').renderShortLink('DP1.10020.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     NPN
  */
  describe('NPN', () => {
    test('renderLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('NPN').renderLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('NPN').renderLink('DP1.10055.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = renderer
        .create(getByHostId('NPN').renderShortLink())
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = renderer
        .create(getByHostId('NPN').renderShortLink('DP1.10055.001'))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';

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
      const tree = render(getByHostId('AERONET').getSiteLink());
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = render(getByHostId('AERONET').getSiteLink(sitesJSON, 'ABBY'));
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = render(getByHostId('AERONET').getSiteLink(sitesJSON, 'ABBY', 'DP1.00043.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = render(getByHostId('AERONET').renderLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = render(getByHostId('AERONET').renderLink('DP1.00043.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = render(getByHostId('AERONET').renderShortLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = render(getByHostId('AERONET').renderShortLink('DP1.00043.001'));
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     AMERIFLUX
  */
  describe('AMERIFLUX', () => {
    test('getSiteLink with no args', () => {
      const tree = render(getByHostId('AMERIFLUX').getSiteLink());
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').getSiteLink(sitesJSON, 'ABBY'));
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').getSiteLink(sitesJSON, 'ABBY', 'DP1.00001.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').renderLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').renderLink('DP1.00001.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').renderShortLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = render(getByHostId('AMERIFLUX').renderShortLink('DP1.00001.001'));
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     PHENOCAM
  */
  describe('PHENOCAM', () => {
    test('getSiteLink with no args', () => {
      const tree = render(getByHostId('PHENOCAM').getSiteLink());
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink without productCode', () => {
      const tree = render(getByHostId('PHENOCAM').getSiteLink(sitesJSON, 'ABBY'));
      expect(tree).toMatchSnapshot();
    });
    test('getSiteLink with productCode', () => {
      const tree = render(getByHostId('PHENOCAM').getSiteLink(sitesJSON, 'ABBY', 'DP1.00033.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = render(getByHostId('PHENOCAM').renderLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = render(getByHostId('PHENOCAM').renderLink('DP1.00033.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = render(getByHostId('PHENOCAM').renderShortLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = render(getByHostId('PHENOCAM').renderShortLink('DP1.00033.001'));
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     BOLD
  */
  describe('BOLD', () => {
    test('getProductLinks with no arg', () => {
      const tree = render(getByHostId('BOLD').getProductLinks());
      expect(tree).toMatchSnapshot();
    });
    test('getProductLinks with a valid productCode', () => {
      const tree = render((
        <div>
          {getByHostId('BOLD').getProductLinks('DP1.10020.001').map((link) => (
            <div key={link.key}>{link.node}</div>
          ))}
        </div>
      ));
      expect(tree).toMatchSnapshot();
    });
    test('renderLink without productCode', () => {
      const tree = render(getByHostId('BOLD').renderLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = render(getByHostId('BOLD').renderLink('DP1.10020.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = render(getByHostId('BOLD').renderShortLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = render(getByHostId('BOLD').renderShortLink('DP1.10020.001'));
      expect(tree).toMatchSnapshot();
    });
  });

  /**
     NPN
  */
  describe('NPN', () => {
    test('renderLink without productCode', () => {
      const tree = render(getByHostId('NPN').renderLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderLink with productCode', () => {
      const tree = render(getByHostId('NPN').renderLink('DP1.10055.001'));
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink without productCode', () => {
      const tree = render(getByHostId('NPN').renderShortLink());
      expect(tree).toMatchSnapshot();
    });
    test('renderShortLink with productCode', () => {
      const tree = render(getByHostId('NPN').renderShortLink('DP1.10055.001'));
      expect(tree).toMatchSnapshot();
    });
  });
});

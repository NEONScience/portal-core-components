import React from 'react';

import { getTestableItems } from '../SiteMapTable';

const {
  ucWord,
  parseSearchTerms,
  searchOnAttribs,
} = getTestableItems();

describe('SiteMap - SiteMapTable', () => {
  describe('ucWord()', () => {
    test('capitalizes as expected', () => {
      const cases = [
        ['FOO', 'Foo'],
        ['bar', 'Bar'],
        ['Qux', 'Qux'],
      ];
      cases.forEach((c) => {
        expect(ucWord(c[0])).toBe(c[1]);
      });
    });
  });

  describe('parseSearchTerms()', () => {
    test('breaks up search strings into terms as expected', () => {
      const cases = [
        ['"foo Bar" baz', ['foo bar', 'baz']],
        ['lo-19 "IpsuM do"LOR', ['lo19', 'ipsum', 'lor']],
        ['sit "Amet', ['sit', 'amet']],
      ];
      cases.forEach((c) => {
        expect(parseSearchTerms(c[0])).toStrictEqual(c[1]);
      });
    });
  });

  describe('searchOnAttribs()', () => {
    test('applies search as expected', () => {
      const cases = [
        ['foo', ['bar Foo qux', 'qux'], true],
        ['foo', ['bar f oo qux', 'qux'], false],
        ['', ['bar Foo qux', 'qux'], true],
        ['qux', [null], false],
      ];
      cases.forEach((c) => {
        expect(searchOnAttribs(c[0], c[1])).toBe(c[2]);
      });
    });
  });
});

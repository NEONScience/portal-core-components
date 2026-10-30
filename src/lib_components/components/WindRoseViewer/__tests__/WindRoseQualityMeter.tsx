import React from 'react';

import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';

import MockTheme from '../../../../__mocks__/MockTheme';
import WindRoseQualityMeter from '../WindRoseQualityMeter';
import { WindRoseQualityFilter } from '../windRoseUtil';

const renderMeter = (validated: number, all: number, qualityFilter: WindRoseQualityFilter) => (
  render(
    <MockTheme>
      <WindRoseQualityMeter validated={validated} all={all} qualityFilter={qualityFilter} />
    </MockTheme>,
  )
);

// Share of the ring the Quality Flag validated arc fills
const getFilledShare = (container: HTMLElement): number => {
  const arc = container.querySelectorAll('circle')[1];
  const circumference = 2 * Math.PI * Number(arc.getAttribute('r'));
  return 1 - (Number.parseFloat(arc.style.strokeDashoffset) / circumference);
};

describe('WindRoseViewer - WindRoseQualityMeter', () => {
  test('shows the Quality Flag validated share of every observation when viewing all', () => {
    const { container, getByText } = renderMeter(175, 720, WindRoseQualityFilter.ALL);
    expect(getByText('24.3%')).toBeTruthy();
    expect(getByText('175 of 720')).toBeTruthy();
    expect(getFilledShare(container)).toBeCloseTo(175 / 720);
    expect(container.querySelector('path')).toBeNull();
  });

  test('shows a full ring with a check mark when viewing Quality Flag validated observations', () => {
    const { container, getByText } = renderMeter(175, 720, WindRoseQualityFilter.VALIDATED);
    expect(getByText('100%')).toBeTruthy();
    expect(getByText('175 of 175')).toBeTruthy();
    expect(getFilledShare(container)).toBeCloseTo(1);
    expect(container.querySelector('path')).not.toBeNull();
  });

  test('shows an empty ring when no observation is Quality Flag validated', () => {
    const { container, getByText } = renderMeter(0, 720, WindRoseQualityFilter.ALL);
    expect(getByText('0%')).toBeTruthy();
    expect(getByText('0 of 720')).toBeTruthy();
    expect(getFilledShare(container)).toBeCloseTo(0);
    expect(container.querySelector('path')).toBeNull();
  });
});

import {filterByIds, Identifiable} from './utils';


describe('filterByIds', () => {

  it('should return a function which filters charts by the supplied ids', () => {

    const mockCharts: Identifiable[] = [
      { id: '1'},
      { id: '2'},
      { id: '3'},
      { id: '4'},
    ];

    const testCases = [
      { ids: ['1', '3'], expected: [mockCharts[0], mockCharts[2]] },
      { ids: ['2'], expected: [mockCharts[1]] },
      { ids: '4', expected: [mockCharts[3]] },
      { ids: ['5'], expected: [] },
      { ids: [], expected: mockCharts },
    ];

    testCases.forEach(({ ids, expected }) => {
      const filterFn = filterByIds(ids);
      const result = mockCharts.filter(filterFn);

      expect(result).toEqual(expected);
    });
  });
});

import moment from 'moment';
import { generatePreviousPeriod } from 'src/utils/datetime';

const TEST_FORMAT = 'YYYY-MM-DD HH:mm';

describe('generatePreviousPeriod', () => {
  describe('whole years', () => {
    test('correctly generates previous year', () => {
      const currentYear = moment().year();
      let dateStart = moment([currentYear]).startOf('year');
      let dateEnd = moment([currentYear]).endOf('year');
      let result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-01-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-31 23:59');

      dateStart = moment('2023-01-01', 'YYYY-MM-DD');
      dateEnd = moment('2023-12-31', 'YYYY-MM-DD');
      result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe('2022-01-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2022-12-31 23:59');
    });

    test('correctly generates previous 2 years', () => {
      const currentYear = moment().year();
      const dateStart = moment([currentYear - 1]).startOf('year');
      const dateEnd = moment([currentYear]).endOf('year');
      const result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2021-01-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2022-12-31 23:59');
    });

    test('correctly generates previous 3 years', () => {
      const currentYear = moment().year();
      const dateStart = moment([currentYear - 2]).startOf('year');
      const dateEnd = moment([currentYear]).endOf('year');
      const result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2019-01-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2021-12-31 23:59');
    });
  });

  describe('whole years with after now', () => {
    test('correctly generates previous year', () => {
      const now = moment();
      const currentYear = now.year();
      const dateStart = moment([currentYear]).startOf('year');
      const dateEnd = moment([currentYear]).endOf('year');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(now.clone().subtract(1, 'years').startOf('year').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(now.clone().subtract(1, 'years').endOf('day').format(TEST_FORMAT));
    });

    test('correctly generates previous 2 years', () => {
      const now = moment();
      const currentYear = now.year();
      const dateStart = moment([currentYear - 1]).startOf('year');
      const dateEnd = moment([currentYear]).endOf('year');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(now.clone().subtract(3, 'years').startOf('year').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(now.clone().subtract(2, 'years').endOf('day').format(TEST_FORMAT));
    });

    test('correctly generates previous 3 years', () => {
      const now = moment();
      const currentYear = now.year();
      const dateStart = moment([currentYear - 2]).startOf('year');
      const dateEnd = moment([currentYear]).endOf('year');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(now.clone().subtract(5, 'years').startOf('year').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(now.clone().subtract(3, 'years').endOf('day').format(TEST_FORMAT));
    });
  });

  describe('whole months', () => {
    test('correctly generates previous month', () => {
      let dateStart = moment('2024-01-01', 'YYYY-MM-DD');
      let dateEnd = moment('2024-01-31', 'YYYY-MM-DD');
      let result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-12-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-31 23:59');

      dateStart = moment('2020-02-01', 'YYYY-MM-DD');
      dateEnd = moment('2020-02-29', 'YYYY-MM-DD');
      result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe('2020-01-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2020-01-31 23:59');
    });

    test('correctly generates previous 2 months', () => {
      let dateStart = moment('2024-01-01', 'YYYY-MM-DD');
      let dateEnd = moment('2024-02-29', 'YYYY-MM-DD');
      let result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-11-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-31 23:59');

      dateStart = moment('2019-03-01', 'YYYY-MM-DD');
      dateEnd = moment('2019-05-31', 'YYYY-MM-DD');
      result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2018-12-01 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2019-02-28 23:59');
    });
  });

  describe('whole months with after now', () => {
    const currentMonth = moment().month() + 1;

    test('correctly generates previous month', () => {
      // month function return 0..11, hence following plus/minus 1
      const dateStart = moment().month(currentMonth - 1).startOf('month');
      const dateEnd = moment().month(currentMonth - 1).endOf('month');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(moment().subtract(1, 'months').startOf('month').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(moment().subtract(1, 'months').endOf('day').format(TEST_FORMAT));
    });

    test('correctly generates previous 2 months', () => {
      const dateStart = moment().month(currentMonth - 2).startOf('month');
      const dateEnd = moment().month(currentMonth - 1).endOf('month');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(moment().subtract(3, 'months').startOf('month').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(moment().subtract(2, 'months').endOf('day').format(TEST_FORMAT));
    });

    test('correctly generates previous 2 months', () => {
      const dateStart = moment().month(currentMonth - 3).startOf('month');
      const dateEnd = moment().month(currentMonth - 1).endOf('month');
      const result = generatePreviousPeriod(dateStart, dateEnd);

      expect(result.from.format(TEST_FORMAT)).toBe(moment().subtract(5, 'months').startOf('month').format(TEST_FORMAT));
      expect(result.to.format(TEST_FORMAT)).toBe(moment().subtract(3, 'months').endOf('day').format(TEST_FORMAT));
    });
  });

  describe('whole weeks', () => {
    test('correctly generates previous week', () => {
      let dateStart = moment('2024-01-01', 'YYYY-MM-DD');
      let dateEnd = moment('2024-01-07', 'YYYY-MM-DD');
      let result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-12-25 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-31 23:59');

      dateStart = moment('2024-04-15', 'YYYY-MM-DD');
      dateEnd = moment('2024-04-21', 'YYYY-MM-DD');
      result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2024-04-08 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2024-04-14 23:59');
    });

    test('correctly generate previous 2 weeks', () => {
      const dateStart = moment('2024-01-01', 'YYYY-MM-DD');
      const dateEnd = moment('2024-01-14', 'YYYY-MM-DD');
      const result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-12-18 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-31 23:59');
    });

    test('correctly generate previous 3 weeks', () => {
      const dateStart = moment('2023-12-25', 'YYYY-MM-DD');
      const dateEnd = moment('2024-01-14', 'YYYY-MM-DD');
      const result = generatePreviousPeriod(dateStart, dateEnd, true);

      expect(result.from.format(TEST_FORMAT)).toBe('2023-12-04 00:00');
      expect(result.to.format(TEST_FORMAT)).toBe('2023-12-24 23:59');
    });
  });
});

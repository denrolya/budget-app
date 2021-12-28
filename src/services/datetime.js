import times from 'lodash/times';
import moment from 'moment-timezone';

export const generateYearRanges = (startYear, endYear = moment().year()) =>
  Object.assign(
    {},
    ...times(endYear - startYear + 1, (i) => ({
      [startYear + i]: [
        moment()
          .year(startYear + i)
          .startOf('year'),
        moment()
          .year(startYear + i)
          .endOf('year'),
      ],
    })),
  );

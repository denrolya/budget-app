import moment from 'moment-timezone';

export const randomFloat = (min = 0, max = 5000) => Math.random() * (max - min + 1) + min;

export const randomInt = (min = 0, max = 5000) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomColor = () => `rgba(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomFloat(0, 1)})`;

export const randomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomTransactionCategoriesTimelineData = () => ({
  'Food & Drinks': [
    {
      date: 1609459200,
      value: randomFloat(),
    },
    {
      date: 1612137600,
      value: randomFloat(),
    },
    {
      date: 1614556800,
      value: randomFloat(),
    },
    {
      date: 1617235200,
      value: randomFloat(),
    },
    {
      date: 1619827200,
      value: randomFloat(),
    },
    {
      date: 1622505600,
      value: randomFloat(),
    },
    {
      date: 1625097600,
      value: randomFloat(),
    },
    {
      date: 1627776000,
      value: randomFloat(),
    },
    {
      date: 1630454400,
      value: randomFloat(),
    },
    {
      date: 1633046400,
      value: randomFloat(),
    },
    {
      date: 1635724800,
      value: randomFloat(),
    },
    {
      date: 1638316800,
      value: randomFloat(),
    },
  ],
  Housing: [
    {
      date: 1609459200,
      value: randomFloat(),
    },
    {
      date: 1612137600,
      value: randomFloat(),
    },
    {
      date: 1614556800,
      value: randomFloat(),
    },
    {
      date: 1617235200,
      value: randomFloat(),
    },
    {
      date: 1619827200,
      value: randomFloat(),
    },
    {
      date: 1622505600,
      value: randomFloat(),
    },
    {
      date: 1625097600,
      value: randomFloat(),
    },
    {
      date: 1627776000,
      value: randomFloat(),
    },
    {
      date: 1630454400,
      value: randomFloat(),
    },
    {
      date: 1633046400,
      value: randomFloat(),
    },
    {
      date: 1635724800,
      value: randomFloat(),
    },
    {
      date: 1638316800,
      value: randomFloat(),
    },
  ],
});

export const randomMoneyFlowData = () => {
  const result = [];
  const startOfYear = moment().startOf('year');
  const endOfYear = moment().endOf('year').startOf('day');

  while (endOfYear.diff(startOfYear, 'days') >= 0) {
    result.push({
      date: startOfYear.clone().unix(),
      expense: -randomFloat(),
      income: randomFloat(),
    });

    startOfYear.add(1, 'month');
  }

  return result;
};

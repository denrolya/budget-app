/* eslint no-bitwise: ["error", { "allow": ["<<", ">>", "&"] }] */

import moment from 'moment-timezone';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { ACCOUNT_TYPE_BANK_CARD, ACCOUNT_TYPE_BASIC } from 'src/constants/account';

const randomSeed = (seed = 123456789) => {
  let mW = seed;
  let mZ = 987654321;
  const mask = 0xffffffff;

  return () => {
    mZ = (36969 * (mZ & 65535) + (mZ >> 16)) & mask;
    mW = (18000 * (mW & 65535) + (mW >> 16)) & mask;
    let result = ((mZ << 16) + mW) & mask;
    result /= 4294967296;
    return result + 0.5;
  };
};

const femaleFirstNames = ['Mary', 'Linda', 'Barbara', 'Maria', 'Lisa', 'Nancy', 'Betty', 'Sandra', 'Sharon'];
const maleFirstNames = ['James', 'John', 'Robert', 'William', 'David', 'Richard', 'Thomas', 'Paul', 'Mark'];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Jones',
  'Brown',
  'Davis',
  'Johnson',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'Williams',
  'White',
  'Harris',
  'Davis',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Robinson',
  'Clark',
];
const usStates = [
  { name: 'Alabama', abbr: 'AL' },
  { name: 'Alaska', abbr: 'AK' },
  { name: 'American Samoa', abbr: 'AS' },
  { name: 'Arizona', abbr: 'AZ' },
  { name: 'Arkansas', abbr: 'AR' },
  { name: 'California', abbr: 'CA' },
  { name: 'Colorado', abbr: 'CO' },
  { name: 'Connecticut', abbr: 'CT' },
  { name: 'Delaware', abbr: 'DE' },
  { name: 'District Of Columbia', abbr: 'DC' },
  { name: 'Federated States Of Micronesia', abbr: 'FM' },
  { name: 'Florida', abbr: 'FL' },
  { name: 'Georgia', abbr: 'GA' },
  { name: 'Guam', abbr: 'GU' },
  { name: 'Hawaii', abbr: 'HI' },
  { name: 'Idaho', abbr: 'ID' },
  { name: 'Illinois', abbr: 'IL' },
  { name: 'Indiana', abbr: 'IN' },
  { name: 'Iowa', abbr: 'IA' },
  { name: 'Kansas', abbr: 'KS' },
  { name: 'Kentucky', abbr: 'KY' },
  { name: 'Louisiana', abbr: 'LA' },
  { name: 'Maine', abbr: 'ME' },
  { name: 'Marshall Islands', abbr: 'MH' },
  { name: 'Maryland', abbr: 'MD' },
  { name: 'Massachusetts', abbr: 'MA' },
  { name: 'Michigan', abbr: 'MI' },
  { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' },
  { name: 'Missouri', abbr: 'MO' },
  { name: 'Montana', abbr: 'MT' },
  { name: 'Nebraska', abbr: 'NE' },
  { name: 'Nevada', abbr: 'NV' },
  { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' },
  { name: 'New Mexico', abbr: 'NM' },
  { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' },
  { name: 'North Dakota', abbr: 'ND' },
  { name: 'Northern Mariana Islands', abbr: 'MP' },
  { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Oregon', abbr: 'OR' },
  { name: 'Palau', abbr: 'PW' },
  { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Puerto Rico', abbr: 'PR' },
  { name: 'Rhode Island', abbr: 'RI' },
  { name: 'South Carolina', abbr: 'SC' },
  { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' },
  { name: 'Texas', abbr: 'TX' },
  { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' },
  { name: 'Virgin Islands', abbr: 'VI' },
  { name: 'Virginia', abbr: 'VA' },
  { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' },
  { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Wyoming', abbr: 'WY' },
];
const cities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Las Vegas',
  'Austin',
  'Tokyo',
  'Rio de Janeiro',
  'London',
  'Paris',
];
const cars = [
  'Honda Civic',
  'Toyota Corolla',
  'Chevrolet Cruze',
  'Honda Accord',
  'Nissan Altima',
  'Kia Optima',
  'Audi A4',
  'BMW 750',
];
const positions = [
  'CEO',
  'IT Manager',
  'Ombudsman',
  'CMO',
  'Controller',
  'HR Manager',
  'Shipping Manager',
  'Sales Assistant',
  'HR Assistant',
];

const generateDate = ({
  random,
  year = 2017,
  month = (rand) => Math.floor(rand() * 12),
  day = (rand) => Math.floor(rand() * 30) + 1,
}) => {
  const getPart = (part) => (typeof part === 'function' ? part(random) : part);
  const date = new Date(Date.UTC(getPart(year), getPart(month), getPart(day)));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
    2,
    '0',
  )}`;
};

const generatePhone = () =>
  Math.random()
    .toString()
    .slice(2, 12)
    .replace(/(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');

export const defaultColumnValues = {
  gender: ['Male', 'Female'],
  name: [
    'gender',
    {
      Male: maleFirstNames,
      Female: femaleFirstNames,
    },
  ],
  city: cities,
  car: cars,
};

export const defaultNestedColumnValues = {
  user: [
    ...[...maleFirstNames, ...femaleFirstNames].map((name, i) => ({
      firstName: name,
      lastName: lastNames[i],
    })),
  ],
  position: positions,
  city: cities,
  car: cars.map((car) => ({ model: car })),
};

export const globalSalesValues = {
  region: ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
  sector: ['Energy', 'Health', 'Manufacturing', 'Insurance', 'Banking', 'Telecom'],
  channel: ['Resellers', 'Retail', 'VARs', 'Consultants', 'Direct', 'Telecom'],
  units: ({ random }) => Math.floor(random() * 4) + 1,
  customer: [
    'Renewable Supplies',
    'Energy Systems',
    'Environment Solar',
    'Beacon Systems',
    'Apollo Inc',
    'Gemini Stores',
    'McCord Builders',
    'Building M Inc',
    'Global Services',
    'Market Eco',
    'Johnson & Assoc',
    'Get Solar Inc',
    'Supply Warehouse',
    'Discovery Systems',
    'Mercury Solar',
  ],
  product: ['SolarMax', 'SolarOne', 'EnviroCare', 'EnviroCare Max'],
  amount: ({ random }) => Math.floor(random() * 1000000 + 1000) / 20,
  discount: ({ random }) => Math.round(random() * 0.5 * 1000) / 1000,
  saleDate: ({ random }) =>
    generateDate({
      random,
      year: 2016,
      month: () => Math.floor(random() * 3) + 1,
    }),
  shipped: [true, false],
};

export const employeeValues = {
  gender: ['Male', 'Female'],
  prefix: [
    'gender',
    {
      Male: ['Mr.', 'Dr.'],
      Female: ['Mrs.', 'Ms.', 'Dr.'],
    },
  ],
  firstName: [
    'gender',
    {
      Male: maleFirstNames,
      Female: femaleFirstNames,
    },
  ],
  lastName: lastNames,
  position: positions,
  state: usStates.map((state) => state.name),
  birthDate: ({ random }) =>
    generateDate({
      random,
      year: () => Math.floor(random() * 30) + 1960,
    }),
  phone: generatePhone,
};

export const employeeTaskValues = {
  priority: ['High', 'Low', 'Normal'],
  status: ['Completed', 'In Progress', 'Deferred', 'Need Assistance'],
  subject: [
    'Choose between PPO and HMO Health Plan',
    'Google AdWords Strategy',
    'New Brochures',
    'Update NDA Agreement',
    'Review Product Recall Report by Engineering Team',
    'Update Personnel Files',
    'Review Health Insurance Options Under the Affordable Care Act',
    'Non-Compete Agreements',
    'Give Final Approval for Refunds',
    'Deliver R&D Plans',
    'Decide on Mobile Devices to Use in the Field',
    'Try New Touch-Enabled Apps',
    'Approval on Converting to New HDMI Specification',
    'Approve Hiring',
    'Update Employee Files with New NDA',
    'Provide New Health Insurance Docs',
    'Prepare 3013 Marketing Plan',
    'Rollout of New Website and Marketing Brochures',
    'Review Sales Report and Approve Plans',
    'Review Site Up-Time Report',
    'Review HR Budget Company Wide',
    'Final Budget Review',
    'Sign Updated NDA',
    'Review Overtime Report',
    'Upgrade Server Hardware',
    'Upgrade Personal Computers',
    'Prepare Financial',
    'Update Revenue Projections',
    'Submit D&B Number to ISP for Credit Approval',
    'Update Sales Strategy Documents',
    'Refund Request Template',
  ],
  startDate: ({ random }) =>
    generateDate({
      random,
      year: 2016,
    }),
  dueDate: ({ random, record }) =>
    generateDate({
      random,
      year: 2016,
      month: () => Math.floor(random() * 2) + new Date(record.startDate).getMonth(),
    }),
};

export function generateRows({ columnValues = defaultColumnValues, length, random = randomSeed(329972281) }) {
  const data = [];
  const columns = Object.keys(columnValues);

  for (let i = 0; i < length; i += 1) {
    const record = {};

    columns.forEach((column) => {
      let values = columnValues[column];

      if (typeof values === 'function') {
        record[column] = values({ random, index: i, record });
        return;
      }

      while (values.length === 2 && typeof values[1] === 'object') {
        values = values[1][record[values[0]]];
      }

      const value = values[Math.floor(random() * values.length)];
      if (typeof value === 'object') {
        record[column] = { ...value };
      } else {
        record[column] = value;
      }
    });

    data.push(record);
  }

  return data;
}

export const transactionsList = {
  list: [
    {
      id: 4545,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 19.99,
      values: {
        EUR: 0.6037179968304653,
        HUF: 222.14439891402031,
        UAH: 19.99,
        USD: 0.7202657561185867,
      },
      note: '\u0425\u0430\u0440\u0438\u0431\u043e',
      executedAt: moment('2021-03-19T16:16:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Goodies', 'Food & Drinks'],
        id: 67,
        name: 'Goodies',
        icon: 'mdi mdi-cookie',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4563,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 105.0,
      values: {
        EUR: 3.1711050358778823,
        HUF: 1166.8415150561348,
        UAH: 105,
        USD: 3.783286863054107,
      },
      note: '\u0428\u0438\u043a\u043e\u0432\u043d\u043e',
      executedAt: moment('2021-03-19T16:13:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Burger', 'Fast Food', 'Eating Out', 'Food & Drinks'],
        id: 84,
        name: 'Burger',
        icon: 'mdi mdi-hamburger',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4564,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 300.0,
      values: {
        EUR: 9.060300102508236,
        HUF: 3333.8329001603856,
        UAH: 300,
        USD: 10.80939103729745,
      },
      note: '\u0417\u0430\u0434\u0430\u0442\u043e\u043a \u0437\u0430 \u0431\u0430\u043d\u044e',
      executedAt: moment('2021-03-19T15:16:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Activities', 'Life & Entertainment'],
        id: 103,
        name: 'Activities',
        icon: 'ion-ios-people',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4561,
      account: {
        id: 4,
        name: 'Cash (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '179,110,105',
        type: ACCOUNT_TYPE_BASIC,
      },
      amount: 300.0,
      values: {
        EUR: 9.060300102508236,
        HUF: 3333.8329001603856,
        UAH: 300,
        USD: 10.80939103729745,
      },
      note: '\u0421\u0435\u0432\u0430',
      executedAt: moment('2021-03-19T15:00:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Massage', 'Health & Fitness'],
        id: 131,
        name: 'Massage',
        icon: 'mdi mdi-gesture-double-tap',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4562,
      account: {
        id: 4,
        name: 'Cash (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '179,110,105',
        type: ACCOUNT_TYPE_BASIC,
      },
      amount: 100.0,
      values: {
        EUR: 3.020100034169412,
        HUF: 1111.277633386795,
        UAH: 100,
        USD: 3.6031303457658166,
      },
      note:
        '\u0414\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0430 \u0445\u043e\u0434\u043e\u0432\u043e\u0439',
      executedAt: moment('2021-03-19T13:54:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Vehicle maintenance', 'Vehicle'],
        id: 115,
        name: 'Vehicle maintenance',
        icon: 'mdi mdi-car-cog',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4560,
      account: {
        id: 4,
        name: 'Cash (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '179,110,105',
        type: ACCOUNT_TYPE_BASIC,
      },
      amount: 205.0,
      values: {
        EUR: 6.191205070047294,
        HUF: 2278.11914844293,
        UAH: 205,
        USD: 7.386417208819924,
      },
      executedAt: moment('2021-03-19T11:11:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Unknown'],
        id: 17,
        name: 'Unknown',
        icon: 'ion-ios-help-circle',
        color: 'rgba(86, 2, 30, 0.6)',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4544,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 1250.45,
      values: {
        EUR: 37.76484087727141,
        HUF: 13895.97116668518,
        UAH: 1250.45,
        USD: 45.05534340862865,
      },
      note:
        '\u041c\u043e\u043b\u043e\u0447\u043a\u0430, \u0445\u043b\u0435\u0431 \u044f\u0439\u0446\u0430, \u043c\u0430\u0441\u043b\u043e, \u043c\u044f\u0441\u043e...',
      executedAt: moment('2021-03-18T22:50:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Groceries', 'Food & Drinks'],
        id: 66,
        name: 'Groceries',
        icon: 'mdi mdi-cart-variant',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4546,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 21.8,
      values: {
        EUR: 0.6583818074489318,
        HUF: 242.25852407832136,
        UAH: 21.8,
        USD: 0.7854824153769481,
      },
      note: '\u0424\u043e\u0440\u043d\u0435\u0442\u0442\u0438',
      executedAt: moment('2021-03-18T15:50:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Pastry', 'Food & Drinks'],
        id: 88,
        name: 'Pastry',
        icon: 'mdi mdi-baguette',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4547,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 27.5,
      values: {
        EUR: 0.8305275093965883,
        HUF: 305.6013491813687,
        UAH: 27.5,
        USD: 0.9908608450855996,
      },
      note: '\u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u043a',
      executedAt: moment('2021-03-18T13:42:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Goodies', 'Food & Drinks'],
        id: 67,
        name: 'Goodies',
        icon: 'mdi mdi-cookie',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4548,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 61.0,
      values: {
        EUR: 1.8422610208433412,
        HUF: 677.879356365945,
        UAH: 61,
        USD: 2.1979095109171483,
      },
      note:
        '\u041e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0434\u0435\u043a\u043e\u0434\u0435\u0440\u0430 5.1',
      executedAt: moment('2021-03-18T13:34:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Delivery Costs', 'Shopping'],
        id: 129,
        name: 'Delivery Costs',
        icon: 'mdi mdi-truck-delivery',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4557,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 88.0,
      values: {
        EUR: 2.6576880300690826,
        HUF: 977.9243173803798,
        UAH: 88,
        USD: 3.170754704273919,
      },
      note:
        '\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0430\u0432\u0442\u043e\u0448\u0442\u0443\u0447\u0435\u043a \u0438 \u0434\u0435\u043a\u043e\u0434\u0435\u0440\u0430',
      executedAt: moment('2021-03-17T15:01:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Delivery Costs', 'Shopping'],
        id: 129,
        name: 'Delivery Costs',
        icon: 'mdi mdi-truck-delivery',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4549,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 27.5,
      values: {
        EUR: 0.8305275093965883,
        HUF: 305.6013491813687,
        UAH: 27.5,
        USD: 0.9908608450855996,
      },
      note: '\u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u043a',
      executedAt: moment('2021-03-17T14:51:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Goodies', 'Food & Drinks'],
        id: 67,
        name: 'Goodies',
        icon: 'mdi mdi-cookie',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4550,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 70.0,
      values: {
        EUR: 2.1140700239185883,
        HUF: 777.8943433707566,
        UAH: 70,
        USD: 2.5221912420360715,
      },
      executedAt: moment('2021-03-17T14:35:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Coffee', 'Bar, cafe', 'Food & Drinks'],
        id: 13,
        name: 'Coffee',
        icon: 'ion-ios-cafe',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4551,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 99.0,
      values: {
        EUR: 2.989899033827718,
        HUF: 1100.1648570529271,
        UAH: 99,
        USD: 3.5670990423081586,
      },
      note: '\u041a\u0430\u0431\u0435\u043b\u044f \u0442\u044e\u043b\u044c\u043f\u0430\u043d\u044b',
      executedAt: moment('2021-03-17T14:21:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Electronics', 'Shopping'],
        id: 120,
        name: 'Electronics',
        icon: 'ion-ios-power',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
    {
      id: 4556,
      account: {
        id: 10,
        name: 'Mono (\u20b4)',
        currency: {
          symbol: '\u20b4',
        },
        color: '7,244,223',
        type: ACCOUNT_TYPE_BANK_CARD,
      },
      amount: 27.5,
      values: {
        EUR: 0.8305275093965883,
        HUF: 305.6013491813687,
        UAH: 27.5,
        USD: 0.9908608450855996,
      },
      note: '\u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u043a',
      executedAt: moment('2021-03-17T13:49:00+02:00', MOMENT_DATETIME_FORMAT),
      category: {
        fullPath: ['Goodies', 'Food & Drinks'],
        id: 67,
        name: 'Goodies',
        icon: 'mdi mdi-cookie',
        tags: [],
      },
      compensations: [],
      type: 'expense',
    },
  ],
  totalValue: -1236.48,
  count: 127,
};

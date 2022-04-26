import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import sumBy from 'lodash/sumBy';
import TreeModel from 'tree-model';

import { EXPENSE_TYPE } from 'src/constants/transactions';
import {
  MOMENT_DATE_FORMAT,
  DATERANGE_PICKER_RANGES,
  MOMENT_VIEW_DATE_FORMAT,
  MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
} from 'src/constants/datetime';
import { notify } from 'src/store/actions/global';

export const isExpense = ({ type }) => type === EXPENSE_TYPE;
export const isDev = () => process.env.NODE_ENV === 'development';

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

export const textColor = (p, isInverted = false) => ({
  'text-success': !isInverted ? p < 100 : p >= 100,
  'text-danger': !isInverted ? p >= 100 : p < 100,
});

export const arrowIcon = (p, isInverted = false) => ({
  'ion-ios-arrow-round-down': !isInverted ? p < 100 : p > 100,
  'ion-ios-arrow-round-up': !isInverted ? p > 100 : p < 100,
});

export const expenseRatioColor = (percentage) => {
  let color = '';

  if (percentage !== 0 && percentage < 90) {
    color = 'success';
  } else if (percentage === 0 || (percentage >= 90 && percentage < 110)) {
    color = 'white';
  } else if (percentage >= 110 && percentage <= 165) {
    color = 'warning';
  } else if (percentage > 165) {
    color = 'danger';
  }

  return color;
};

export const expenseIconColorFromPercentage = (percentage) => {
  let color = '';

  if (percentage >= 0 && percentage <= 40) {
    color = 'white';
  } else if (percentage > 40 && percentage <= 75) {
    color = 'info';
  } else if (percentage > 75 && percentage <= 85) {
    color = 'warning';
  } else if (percentage > 85) {
    color = 'danger';
  }

  return color;
};

export const revenueExpenseRatioColor = (percentage) => {
  let color = '';

  if (percentage >= 0 && percentage <= 20) {
    color = 'primary';
  } else if (percentage > 20 && percentage <= 35) {
    color = 'success';
  } else if (percentage > 35 && percentage <= 50) {
    color = 'warning';
  } else if (percentage > 50) {
    color = 'danger';
  }

  return color;
};

export const isActionLoading = (action) => typeof action !== 'undefined' && action !== false;
export const isActionResolved = (action) => action === false;

export const isToday = (date) => moment().isSame(date, 'date');
export const isYesterday = (date) => moment().subtract(1, 'day').isSame(date, 'date');
export const isMoreThanWeekAgo = (date) => moment().diff(date, 'days') > 7;
export const isMoreThanHourAgo = (date) => moment().diff(date, 'hours') > 1;
export const isCurrentYear = (date) => moment().year() === moment(date).year();

export const amountInPercentage = (total, amount, fractionDigits = 2) => total > 0 ? Number(((100 * amount) / total).toFixed(fractionDigits)) : false;

export const isMobile = () => {
  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      )
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|interval|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4),
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
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

export const generateCategoriesStatisticsTree = (current, previous) => {
  const tree = new TreeModel({
    modelComparatorFn: (a, b) => b.total - a.total,
  });
  const treeData = tree.parse({
    name: 'All categories',
    total: sumBy(current, 'total'),
    children: current,
  });

  treeData.walk((node) => {
    const {
      model: { name, icon, value },
    } = node;
    if (value) {
      const newNode = tree.parse({
        icon,
        name,
        total: value,
      });
      node.addChild(newNode);
    }
  });

  if (previous) {
    const previousTreeData = tree.parse({
      name: 'All categories',
      total: sumBy(previous, 'total'),
      children: previous,
    });

    previousTreeData.walk((node) => {
      const {
        model: { name, icon, value },
      } = node;
      if (value) {
        const newNode = tree.parse({
          icon,
          name,
          total: value,
        });
        node.addChild(newNode);
      }
    });

    treeData.all().forEach((node) => {
      const sameNodeInPreviousTree = previousTreeData.first(
        (n) => n.model.name === node.model.name && n.getPath().length === node.getPath().length,
      );
      if (sameNodeInPreviousTree) {
        // eslint-disable-next-line no-param-reassign
        node.model.previous = sameNodeInPreviousTree.model.total;
      }
    });
  }

  return treeData;
};

export const confirmAccountArchivation = (account) => Swal.fire({
  title: `Archive ${account.name}`,
  text: 'All the transactions remain. NOTHING is DELETED! Account can be restored later.',
  showCancelButton: true,
  confirmButtonText: 'Archive',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-simple btn-warning',
  cancelButtonClass: 'btn btn-simple btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const confirmAccountRestoration = (account) => Swal.fire({
  title: `Restore ${account.name}`,
  text: 'Is this account in use again?',
  showCancelButton: true,
  confirmButtonText: 'Restore',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const confirmAccountNameChange = (account, newName) => Swal.fire({
  title: `Change ${account.name} to ${newName}?`,
  showCancelButton: true,
  confirmButtonText: 'Change',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-warning',
  cancelButtonClass: 'btn btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const ratio = (p) => (p < 100 ? 100 - p : p - 100);

export const generatePreviousPeriod = (from, to) => {
  const isCurrentMonth = from === moment().startOf('month').format(MOMENT_DATE_FORMAT)
    && to === moment().endOf('month').format(MOMENT_DATE_FORMAT);

  return {
    from: isCurrentMonth
      ? from.clone().subtract(1, 'months')
      : from.clone().subtract(to.diff(from, 'days') + 1, 'days'),
    to: isCurrentMonth
      ? from.clone().subtract(1, 'days')
      : from.clone().subtract(1, 'days'),
  };
};

export const copyToClipboard = (str) => {
  // Create new element
  const el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
  notify('success', 'Copied to clipboard');
};

export const rangeToString = (from, to, range = DATERANGE_PICKER_RANGES) => {
  let result = `${from.format(
    from.year() === moment().year() ? MOMENT_VIEW_DATE_FORMAT : MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
  )} - ${to.format(to.year() === moment().year() ? MOMENT_VIEW_DATE_FORMAT : MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`;
  Object.keys(range).forEach((rangeName) => {
    if (range[rangeName][0].isSame(from, 'day') && range[rangeName][1].isSame(to, 'day')) {
      result = rangeName;
    }
  });

  return result;
};

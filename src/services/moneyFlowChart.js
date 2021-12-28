import sum from 'lodash/sum';
import moment from 'moment-timezone';

import { MOMENT_DEFAULT_DATE_FORMAT, MOMENT_VIEW_DATE_FORMAT } from 'src/constants/datetime';
import { COLORS } from 'src/constants/charts';
import { convertDateLabelsToHumanReadableByInterval, generateGradient, generateRGBA } from 'src/services/chart';
import { amountInPercentage, randomFloat } from 'src/services/common';

export const getChartConfig = (interval, data, baseCurrencySymbol) => {
  const xAxisGridLineColor = generateXAxisGridLineColor(interval, Object.keys(data.expenses));
  let xAxisGridLineZeroColor = 'transparent';

  if (interval === 'day' && [6, 7, 0].indexOf(moment(Object.keys(data.expenses)[0]).isoWeekday())) {
    xAxisGridLineZeroColor = generateRGBA(COLORS.warning, 0.2);
  }

  const title = (tooltipItem) => generateTitle(tooltipItem, interval, Object.keys(data.expenses));

  const label = (tooltipItem, d) => {
    const currentDataset = d.datasets[tooltipItem.datasetIndex].data;
    const currentValue = parseFloat(currentDataset[tooltipItem.index].toFixed(2));
    let percentage = 0;
    let total = 0;
    let text = '';

    /* eslint-disable default-case, no-case-declarations */
    switch (tooltipItem.datasetIndex) {
      case 0: // Incomes
        total = sum(currentDataset);
        percentage = amountInPercentage(total, currentValue, 0);
        text = `${baseCurrencySymbol} ${currentValue.toLocaleString()} ${
          percentage && `(${percentage}% of total revenue)`
        }`;
        break;
      case 1: // Expenses
        total = Math.abs(sum(currentDataset));
        const absoluteValue = Math.abs(currentValue);
        const totalRevenue = sum(Object.values(data.revenue));
        const revenueRatio = amountInPercentage(totalRevenue, absoluteValue, 0);
        percentage = amountInPercentage(total, absoluteValue, 0);
        text = `${baseCurrencySymbol} ${absoluteValue.toLocaleString()} ${
          percentage && `(${percentage}% of total expense ${revenueRatio && ` |  ${revenueRatio}% of total revenue`})`
        }`;
        break;
      case 2: // Earnings
        const currentRevenue = d.datasets[0].data[tooltipItem.index];
        const currentExpense = d.datasets[1].data[tooltipItem.index];
        percentage = amountInPercentage(currentRevenue, Math.abs(currentExpense), 0);
        text = `${baseCurrencySymbol} ${currentValue.toLocaleString()} (${
          percentage ? `${percentage}% of revenue was spent` : 'No revenue'
        })`;
        break;
    }

    return text;
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
      align: window.isMobile ? 'start' : 'center',
      labels: {
        boxWidth: 20,
      },
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'x',
      intersect: 0,
      position: 'nearest',
      callbacks: {
        title,
        label,
      },
    },
    elements: {
      line: {
        fill: false,
      },
    },
    scales: {
      yAxes: [
        {
          id: 'y1',
          type: 'linear',
          display: true,
          position: 'left',
          gridLines: {
            drawBorder: false,
            color: 'transparent',
            zeroLineColor: 'transparent',
          },
          ticks: {
            display: false,
            padding: 0,
            fontColor: 'rgba(154,154,154,1)',
            maxTicksLimit: 4,
            callback: (val) => `${baseCurrencySymbol} ${val}`,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            drawBorder: false,
            lineWidth: 0,
            color: xAxisGridLineColor,
            zeroLineColor: xAxisGridLineZeroColor,
            zeroLineWidth: 0,
          },
          ticks: {
            display: true,
            padding: 0,
            fontColor: '#9a9a9a',
          },
        },
      ],
    },
  };
};

export const getChartData = (interval, data) => (canvas) => {
  const revenue = Object.values(data.revenue);
  const expenses = Object.values(data.expenses).map((val) => 0 - val);
  const earnings = Object.values(data.earnings);
  const earningsColor = sum(earnings) > 0 ? '100,248,144' : '248,64,56';

  const revenueGradient = generateGradient(canvas, COLORS.success);
  const expenseGradient = generateGradient(canvas, COLORS.danger);
  const earningsGradient = generateGradient(canvas, earningsColor);

  const labels = convertDateLabelsToHumanReadableByInterval(Object.keys(data.expenses), interval);

  const datasets = [
    {
      type: 'bar',
      label: 'Revenue',
      fill: false,
      backgroundColor: revenueGradient,
      borderColor: generateRGBA(COLORS.success),
      borderWidth: 2,
      pointRadius: 0,
      data: revenue,
      hidden: false,
      stack: 'stack1',
      yAxisID: 'y1',
    },
    {
      type: 'bar',
      label: 'Expenses',
      fill: false,
      backgroundColor: expenseGradient,
      borderColor: generateRGBA(COLORS.danger),
      borderWidth: 2,
      pointRadius: 0,
      data: expenses,
      hidden: false,
      stack: 'stack1',
      yAxisID: 'y1',
    },
    {
      type: 'line',
      label: 'Earnings',
      fill: false,
      backgroundColor: earningsGradient,
      borderColor: generateRGBA(earningsColor, 0.3),
      borderWidth: 1,
      pointRadius: 0,
      data: earnings,
      hidden: true,
      yAxisID: 'y1',
    },
  ];

  return {
    labels,
    datasets,
  };
};

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

const generateXAxisGridLineColor = (interval, dates) => {
  let xAxisGridLineColor = 'transparent';
  switch (interval) {
    case 'day':
      xAxisGridLineColor = dates.map((date) => {
        const momentDate = moment(date, MOMENT_DEFAULT_DATE_FORMAT);

        if ([6, 7, 1].includes(momentDate.isoWeekday())) {
          return generateRGBA(COLORS.danger, 0.2);
        }

        if (momentDate.isSame(moment(), 'day')) {
          return generateRGBA(COLORS.warning, 0.7);
        }

        return 'transparent';
      });
      break;
    case 'week':
      xAxisGridLineColor = dates.map((date) =>
        moment(date, MOMENT_DEFAULT_DATE_FORMAT).isoWeek() === moment().isoWeek()
          ? generateRGBA(COLORS.warning, 0.7)
          : 'transparent',
      );
      break;
    case 'month':
      xAxisGridLineColor = dates.map((date) =>
        moment(date, MOMENT_DEFAULT_DATE_FORMAT).month() === moment().month()
          ? generateRGBA(COLORS.warning, 0.7)
          : 'transparent',
      );
      break;
  }

  return xAxisGridLineColor;
};

const generateTitle = (tooltipItem, interval, dates) => {
  let title = '';
  let date;

  /* eslint-disable default-case, no-case-declarations */
  switch (interval) {
    case 'day':
      title = moment(dates[tooltipItem[0].index]).format('ddd MMM, Do YYYY');
      break;
    case 'week':
      date = moment(dates[tooltipItem[0].index]);
      const start = date.startOf('isoWeek').format(MOMENT_VIEW_DATE_FORMAT);
      const end = date.endOf('isoWeek').format(MOMENT_VIEW_DATE_FORMAT);
      title = `${date.isoWeek()}: ${start} - ${end}`;
      break;
    case 'month':
      date = moment(dates[tooltipItem[0].index]);
      title = date.format(date.year() === moment().year() ? 'MMMM' : 'MMMM YY');
      break;
  }

  return title;
};

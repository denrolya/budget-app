import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Radar } from 'react-chartjs-2';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { amountInPercentage } from 'src/services/common';

const ExpenseCategoriesRadarChart = ({
  data, selectedCategory, height, currentMonthRevenue, onClick,
}) => {
  const { symbol } = useBaseCurrency();
  const chartData = () => ({
    labels: data.map(({ name }) => (name === selectedCategory ? 'General' : name)),
    datasets: [
      {
        label: 'Selected period',
        fill: true,
        backgroundColor: 'rgba(253,115,99,0.7)',
        borderColor: 'rgba(253,115,99,1)',
        borderWidth: 1,
        borderDash: [],
        borderDashOffset: 0,
        pointHitRadius: 20,
        pointBackgroundColor: 'rgba(253,115,99,1)',
        pointHoverBackgroundColor: 'rgba(253,115,99,1)',
        pointBorderColor: 'rgba(253,115,99,1)',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointRadius: 2,
        data: data.map(({ amount }) => amount),
      },
      {
        label: 'Average',
        fill: true,
        backgroundColor: 'rgba(34,94,194,0.3)',
        borderColor: 'rgba(34,94,194,0.4)',
        borderWidth: 1,
        borderDash: [],
        borderDashOffset: 0,
        pointHitRadius: 20,
        pointBackgroundColor: 'rgba(34,94,194,0.4)',
        pointHoverBackgroundColor: 'rgba(34,94,194,0.4)',
        pointBorderColor: 'rgba(34,94,194,0.4)',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 5,
        pointRadius: 3,
        pointStyle: 'circle',
        data: data.map(({ average }) => average),
      },
    ],
  });

  const label = (tooltipItem) => {
    const total = sumBy(data, 'amount');
    const currentValue = data[tooltipItem.index];
    const ratio = amountInPercentage(total, currentValue.amount, 1);
    const incomeRatio = amountInPercentage(currentMonthRevenue, currentValue.amount, 1);
    return tooltipItem.datasetIndex === 0
      ? `Selected Period: ${symbol} ${currentValue.amount} (${ratio}%${incomeRatio ? ` | ${incomeRatio}%` : ''})`
      : `Average: ${symbol} ${currentValue.average.toFixed(1)}`;
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: true,
      position: window.isMobile ? 'top' : 'right',
    },
    ticks: {
      min: 0,
      max: 100000,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'point',
      intersect: true,
      position: 'nearest',
      callbacks: {
        label,
        title: (tooltipItem, data) => data.labels[tooltipItem[0].index],
      },
    },
  };

  const onCategorySelect = (elem) => {
    if (!elem[0]) {
      return;
    }

    const categoryName = elem[0]._scale.pointLabels[elem[0]._index];

    onClick(categoryName === 'General' ? selectedCategory : categoryName);
  };

  return <Radar data={chartData} options={options} onElementsClick={onCategorySelect} />;
};

ExpenseCategoriesRadarChart.defaultProps = {
  height: 200,
};

ExpenseCategoriesRadarChart.propTypes = {
  currentMonthRevenue: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
    }),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  height: PropTypes.number,
  selectedCategory: PropTypes.string,
};

export default memo(
  ExpenseCategoriesRadarChart,
  (prevProps, nextProps) => isEqual(prevProps.data, nextProps.data) && isEqual(prevProps.currentMonthRevenue, nextProps.currentMonthRevenue),
);

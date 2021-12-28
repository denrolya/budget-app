import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { amountInPercentage } from 'src/services/common';
import { COLORS } from 'src/constants/charts';
import { generateRGBA } from 'src/services/chart';

const ExpenseCategoriesPieChart = ({ data, selectedCategory, height, onClick }) => {
  const { symbol } = useBaseCurrency();
  const selectedSubtree = data.first(({ model: { name } }) => name === selectedCategory);

  const chartData = () => {
    const backgroundColors = {
      current: [],
      previous: [],
    };
    const hoverBackgroundColors = {
      current: [],
      previous: [],
    };
    const borderColors = {
      current: [],
      previous: [],
    };
    const hoverBorderColors = {
      current: [],
      previous: [],
    };
    const chartData = {
      current: [],
      previous: [],
    };
    const labels = [];

    const pushColors = (color) => {
      backgroundColors.current.push(generateRGBA(COLORS[color], 0.05));
      hoverBackgroundColors.current.push(generateRGBA(COLORS[color], 0.25));
      borderColors.current.push(generateRGBA(COLORS[color], 0.85));
      hoverBorderColors.current.push(generateRGBA(COLORS[color]));

      backgroundColors.previous.push(generateRGBA(COLORS[color], 0.05));
      hoverBackgroundColors.previous.push(generateRGBA(COLORS[color], 0.25));
      borderColors.previous.push(generateRGBA(COLORS[color], 0.4));
      hoverBorderColors.previous.push(generateRGBA(COLORS[color]));
    };

    selectedSubtree.children
      .map((node) => node.model)
      .map(({ name, total, previous }) => {
        chartData.current.push(total);
        chartData.previous.push(previous);
        labels.push(name === selectedCategory ? 'Uncategorized' : name);

        const amountToPreviousPeriodRatio = amountInPercentage(previous, total, 0);

        let color = 'success';

        if (amountToPreviousPeriodRatio != 0 && amountToPreviousPeriodRatio < 90) {
          color = 'success';
        } else if (
          amountToPreviousPeriodRatio == 0 ||
          (amountToPreviousPeriodRatio >= 90 && amountToPreviousPeriodRatio < 110)
        ) {
          color = 'default';
        } else if (amountToPreviousPeriodRatio >= 110 && amountToPreviousPeriodRatio <= 165) {
          color = 'warning';
        } else if (amountToPreviousPeriodRatio > 165) {
          color = 'danger';
        }

        pushColors(color);
      });

    return {
      labels,
      datasets: ['current', 'previous'].map((e) => ({
        fill: true,
        backgroundColor: backgroundColors[e],
        borderColor: borderColors[e],
        hoverBorderColor: hoverBorderColors[e],
        borderWidth: 2,
        data: chartData[e],
      })),
    };
  };

  const label = (tooltipItem) => {
    const currentValue = selectedSubtree.children[tooltipItem.index].model;
    const ratio = amountInPercentage(data.model.total, currentValue.total, 0);
    const revenueRatio = 0; // TODO: Ratio to revenue for selected period;
    return [
      `Selected Period: ${symbol} ${parseFloat(
        currentValue.total.toFixed(),
      ).toLocaleString()} (${ratio}% of total expense for selected period${
        revenueRatio ? ` | ${revenueRatio}% of selected period's revenue` : ''
      })`,
      `Previous Period: ${symbol} ${parseFloat(currentValue.previous.toFixed()).toLocaleString()}`,
    ];
  };

  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 40,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
          minBarLength: 10,
          maxBarThickness: 8,
          gridLines: {
            drawBorder: false,
            color: 'transparent',
            zeroLineColor: 'transparent',
          },
          ticks: {
            backgroundColor: 'transparent',
            padding: 0,
            fontColor: '#9a9a9a',
            maxTicksLimit: 3,
            callback: (val) => `${symbol} ${val}`,
          },
        },
      ],
    },
    borderWidth: 18,
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

  /* eslint-disable no-underscore-dangle */
  return (
    <Doughnut
      data={chartData}
      options={options}
      height={window.isMobile ? height : null}
      datasetKeyProvider={() => Math.random()}
      onElementsClick={(elem) => elem[0] && elem[0]._model.label !== 'Uncategorized' && onClick(elem[0]._model.label)}
    />
  );
};

ExpenseCategoriesPieChart.defaultProps = {
  height: 300,
};

ExpenseCategoriesPieChart.propTypes = {
  data: PropTypes.object.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  height: PropTypes.number,
};

export default memo(
  ExpenseCategoriesPieChart,
  (prevProps, nextProps) =>
    isEqual(prevProps.selectedCategory, nextProps.selectedCategory) && isEqual(prevProps.data, nextProps.data),
);

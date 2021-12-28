import isEqual from 'lodash/isEqual';
import React, { memo, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';

import { DEFAULT_TOOLTIP } from 'src/constants/charts';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { amountInPercentage } from 'src/services/common';

const AccountDistributionCard = ({ isLoading, height, model, onUpdate }) => {
  const data = useMemo(() => sortBy(model.data, 'value').reverse(), [model.data]);

  const total = useMemo(() => sumBy(data, 'value'), [model.data]);

  const chart = {
    data: {
      labels: data.map(({ account: { name } }) => name),
      datasets: [
        {
          data: data.map(({ value }) => value.toFixed()),
          label: 'Data',
          fill: true,
          backgroundColor: data.map(({ account: { color } }) => `${color}33`),
          borderColor: data.map(({ account: { color } }) => color),
        },
      ],
    },
    options: {
      tooltips: {
        ...DEFAULT_TOOLTIP,
        mode: 'point',
        callbacks: {
          title: ([item]) => data[item.index].account.name,
          label: ({ index }) => `${data[index].account.symbol} ${data[index].amount.toLocaleString()}`,
          footer: ([item]) => `${amountInPercentage(total, data[item.index].value, 0)}% from total`,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 20,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
    },
  };

  return (
    <TimeperiodStatisticsCard
      className="card-chart card--hover-expand"
      title="Account distribution"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <div className="chart-area" style={{ height }}>
        <Pie data={chart.data} options={chart.options} />
      </div>
    </TimeperiodStatisticsCard>
  );
};

AccountDistributionCard.defaultProps = {
  isLoading: false,
  height: 300,
};

AccountDistributionCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  height: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default memo(
  AccountDistributionCard,
  (prevProps, nextProps) =>
    isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);

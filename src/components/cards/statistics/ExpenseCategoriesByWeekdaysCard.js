import moment from 'moment-timezone/index';
import color from 'randomcolor';
import React, { memo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import maxBy from 'lodash/maxBy';
import times from 'lodash/times';
import { Button } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';

import { COLORS, DEFAULT_TOOLTIP } from 'src/constants/charts';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { generateRGBA } from 'src/services/chart';
import { amountInPercentage } from 'src/services/common';

/** TODO: Put euro signs in ticks */
const CategoryExpensesByWeekdaysCard = ({ isLoading, model, onUpdate }) => {
  const { symbol } = useBaseCurrency();
  const [isFilteredDataSelected, setIsFilteredDataSelected] = useState(false);
  const { data } = model;
  const filteredData = cloneDeep(data);

  const categories = Object.keys(data);
  const labels = [];

  times(7, (i) => {
    labels.push(
      moment()
        .isoWeekday(i + 1)
        .format('dddd'),
    );
    const dataByDay = categories.map((category) => ({
      name: category,
      value: filteredData[category].data[i],
    }));

    const { name } = maxBy(dataByDay, 'value');

    categories.forEach((category) => {
      if (category !== name) {
        filteredData[category].data[i] = 0;
      }
    });
  });

  const weeksInYear = moment().startOf('year').weeksInYear();
  const chart = {
    data: {
      labels,
      datasets: categories.map((category) => ({
        label: category,
        fill: false,
        backgroundColor: color({
          luminosity: 'bright',
          seed: category,
        }),
        hoverBackgroundColor: color({
          luminosity: 'bright',
          seed: category,
        }),
        borderColor: color({
          luminosity: 'bright',
          seed: category,
        }),
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: isFilteredDataSelected
          ? filteredData[category].data.map((val) => (val / weeksInYear).toFixed(1))
          : data[category].data.map((val) => (val / weeksInYear).toFixed(1)),
      })),
    },
    options: {
      tooltips: {
        ...DEFAULT_TOOLTIP,
        mode: 'x',
        callbacks: {
          title: ([item], { labels }) => labels[item.index],
          label: ({ index, datasetIndex }, { datasets }) => `${categories[datasetIndex]}: ${symbol} ${datasets[datasetIndex].data[index]}`,
          footer: ([item], { datasets }) => {
            const total = sumBy(datasets, (el) => parseFloat(el.data[item.index]));

            return `${amountInPercentage(total, datasets[item.datasetIndex].data[item.index], 0)}% from total`;
          },
        },
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              drawBorder: false,
              color: generateRGBA(COLORS.primary, 0.1),
              zeroLineColor: 'transparent',
            },
            ticks: {
              maxTicksLimit: 4,
              padding: 20,
              fontColor: '#9e9e9e',
              callback: (value) => `${symbol} ${value}`,
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
            gridLines: {
              drawBorder: false,
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              display: false,
              padding: 20,
              fontColor: '#9e9e9e',
            },
          },
        ],
      },
    },
  };

  return (
    <TimeperiodStatisticsCard
      className="card-chart card--hover-expand"
      title="Days in week expenses"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <div className="chart-area">
        <Bar height={350} data={chart.data} options={chart.options} />
      </div>

      <Button
        block
        color="danger"
        size="sm"
        className="btn-simple"
        active={isFilteredDataSelected}
        onClick={() => setIsFilteredDataSelected(!isFilteredDataSelected)}
      >
        Show only top categories
      </Button>
    </TimeperiodStatisticsCard>
  );
};

CategoryExpensesByWeekdaysCard.defaultProps = {
  isLoading: false,
};

CategoryExpensesByWeekdaysCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(CategoryExpensesByWeekdaysCard);

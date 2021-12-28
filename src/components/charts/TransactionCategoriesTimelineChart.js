import PropTypes from 'prop-types';
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { randomInt } from 'src/services/common';
import { convertDateLabelsToHumanReadableByInterval } from 'src/services/chart';

const TransactionCategoriesTimelineChart = ({ data, interval, line }) => {
  const { symbol } = useBaseCurrency();
  const generateChartData = () => {
    const categories = Object.keys(data);
    const labels = convertDateLabelsToHumanReadableByInterval(Object.keys(data[categories[0]]), interval);

    const datasets = categories.map((categoryName) => {
      const color = `rgba(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)},1)`;
      return {
        lineTension: 0.2,
        label: categoryName,
        fill: false,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 7,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data[categoryName].map(({ value }) => value),
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: false,
      position: 'nearest',
      callbacks: {
        title: ([item], { datasets }) => datasets[item.datasetIndex].label,
        label: ({ value }) => `${symbol} ${parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
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
          type: 'linear',
          display: true,
          position: 'left',
          barPercentage: 0.6,
          gridLines: {
            drawBorder: false,
            color: 'transparent',
            zeroLineColor: 'transparent',
            zeroLineWidth: 0,
          },
          ticks: {
            padding: 5,
            fontColor: 'rgba(154,154,154,1)',
            maxTicksLimit: 4,
            callback: (val) => `${symbol} ${val}`,
          },
        },
      ],
      xAxes: [
        {
          stacked: false,
          categoryPercentage: 0.9,
          barPercentage: 1,
          gridLines: {
            drawBorder: false,
            color: 'rgba(37,82,72,0.1)',
            zeroLineColor: 'rgba(37,82,72,0.1)',
            zeroLineWidth: 1,
          },
          ticks: {
            display: true,
            padding: 10,
            fontColor: 'rgba(154,154,154,1)',
          },
        },
      ],
    },
  };

  return (
    <div className="chart-area-container">
      <div className="chart-area" style={{ height: 250 }}>
        {line && <Line data={generateChartData} options={chartConfig} width={800} />}
        {!line && <Bar data={generateChartData} options={chartConfig} width={800} />}
      </div>
    </div>
  );
};

TransactionCategoriesTimelineChart.defaultProps = {
  interval: 'month',
  line: true,
};

TransactionCategoriesTimelineChart.propTypes = {
  data: PropTypes.object.isRequired,
  line: PropTypes.bool,
  interval: PropTypes.string,
};

export default TransactionCategoriesTimelineChart;

import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment-timezone';
import { CardBody, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';

import { MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import LoadingCard from 'src/components/cards/LoadingCard';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

export const RevenueByMonthsCard = ({ revenue, isLoading }) => {
  const { symbol } = useBaseCurrency();
  const orderedData = {
    dates: Object.keys(revenue)
      .map((date) => moment(date, MOMENT_DEFAULT_DATE_FORMAT))
      .sort((a, b) => (a.isAfter(b) ? 1 : -1)),
    values: [],
  };

  orderedData.dates.forEach((d) => {
    orderedData.values.push(revenue[d.format(MOMENT_DEFAULT_DATE_FORMAT)]);
  });

  const chartConfig = {
    data: (canvas) => {
      const ctx = canvas.getContext('2d');

      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(255,255,255,0.4)');
      gradientStroke.addColorStop(0.4, 'transparent');
      gradientStroke.addColorStop(0, 'transparent');

      return {
        labels: orderedData.dates.map((d) => d.format('MMM')),
        datasets: [
          {
            label: 'Revenue',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: 'white',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0,
            pointBackgroundColor: 'white',
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: 'white',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: orderedData.values,
          },
        ],
      };
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
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
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            display: true,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'rgba(255,255,255,0.6)',
              zeroLineWidth: 2,
            },
            ticks: {
              padding: 5,
              maxTicksLimit: 3,
              fontColor: '#9e9e9e',
              callback: (val) => `${symbol} ${val}`,
            },
          },
        ],
        xAxes: [
          {
            display: true,
            barPercentage: 0.6,
            gridLines: {
              drawBorder: false,
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              padding: 0,
              fontColor: '#9e9e9e',
            },
          },
        ],
      },
    },
  };

  return (
    <LoadingCard isLoading={isLoading} className="card-chart card-chart-170">
      <CardHeader>
        <h5 className="card-category">Revenue</h5>
      </CardHeader>
      <CardBody>
        <div className="chart-area-container">
          <div className="chart-area" style={{ height: 100 }}>
            <Line data={chartConfig.data} options={chartConfig.options} />
          </div>
        </div>
      </CardBody>
    </LoadingCard>
  );
};

RevenueByMonthsCard.propTypes = {
  revenue: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default RevenueByMonthsCard;

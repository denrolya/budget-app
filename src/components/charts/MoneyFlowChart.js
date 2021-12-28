import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import PropTypes from 'prop-types';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { getChartConfig, getChartData } from 'src/services/moneyFlowChart';
import { moneyFlowDataType } from 'src/types/moneyFlow';

const MoneyFlowChart = ({ data, onClick, interval }) => {
  const { symbol } = useBaseCurrency();

  const chartConfig = getChartConfig(interval, data, symbol);
  const chartData = getChartData(interval, data);

  return (
    <div className="chart-area-container">
      <div className="chart-area">
        <Bar
          redraw
          data={chartData}
          options={chartConfig}
          width={800}
          getElementAtEvent={(elem) => !window.isMobile && elem[0] && onClick(elem[0]._index)}
        />
      </div>
    </div>
  );
};

MoneyFlowChart.propTypes = {
  data: moneyFlowDataType.isRequired,
  interval: PropTypes.oneOf(['day', 'week', 'month']).isRequired,
  onClick: PropTypes.func,
};

export default MoneyFlowChart;

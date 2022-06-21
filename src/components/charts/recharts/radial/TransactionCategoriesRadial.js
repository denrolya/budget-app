import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  PolarAngleAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';

const TransactionCategoriesRadial = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setShowLegend(true);
    }
  }, []);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  const legendFormatter = (value, entry) => (
    <>
      <i aria-hidden className={entry.payload.icon} />
      {'  '}
      {entry.payload.name}
      {': '}
      <MoneyValue bold maximumFractionDigits={0} amount={entry.payload.total} />
    </>
  );

  const tooltipFormatter = ({ active, payload }) => (active && payload && payload.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1" style={{ color: payload[0].payload.fill }}>
        <i aria-hidden className={payload[0].payload.icon} />
        {' '}
        {payload[0].payload.name}
        {': '}
        <MoneyValue bold amount={payload[0].payload.total} maximumFractionDigits={0} />
      </h4>
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart
        cx={showLegend ? '75%' : '50%'}
        cy="50%"
        innerRadius="15%"
        outerRadius="100%"
        barSize={20}
        data={chartData}
        startAngle={0}
        endAngle={300}
      >
        <defs>
          <filter id="shadow" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
            <feOffset in="blur" dx="0" dy="15" result="offsetBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.5" result="offsetColor" />
            <feComposite
              in="offsetColor"
              in2="offsetBlur"
              operator="in"
              result="offsetBlur"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          clockWise
          dataKey="percentage"
          filter="url(#shadow)"
          background={{ fill: '#ffffff11' }}
          angleAxisId={0}
          minAngle={15}
          label={false}
        />
        <Tooltip content={tooltipFormatter} />
        {showLegend && (
          <Legend
            iconSize={0}
            align="left"
            layout="vertical"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{
              lineHeight: '24px',
            }}
            formatter={legendFormatter}
          />
        )}
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesRadial.defaultProps = {
  data: [],
};

TransactionCategoriesRadial.propTypes = {
  data: PropTypes.array,
};

export default TransactionCategoriesRadial;

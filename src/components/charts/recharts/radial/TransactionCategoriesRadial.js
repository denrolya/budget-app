import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, PolarAngleAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <h4 className="mb-1">{payload[0].payload.name}</h4>
      <p className={cn('mb-0')}>
        <MoneyValue bold amount={payload[0].payload.total} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

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
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            iconSize={10}
            align="left"
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              lineHeight: '24px',
            }}
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

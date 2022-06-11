import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import sortBy from 'lodash/sortBy';

import { RAINBOW_COLORS } from 'src/constants/color';
import MoneyValue from 'src/components/MoneyValue';

/* eslint-disable react/prop-types */
const Cell = ({
  root, depth, x, y, width, height, index, colors, name,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        fill: colors[root.root],
        stroke: '#ffffff',
        strokeWidth: 2 / (depth + 1e-10),
        strokeOpacity: 1 / (depth + 1e-10),
      }}
    />

    {depth === 1 ? (
      <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
        {name}
      </text>
    ) : null}

    {depth === 1 ? (
      <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
        {index + 1}
      </text>
    ) : null}
  </g>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <h4 className="mb-1">
        <i aria-hidden className={payload[0].payload.icon} />
        {' '}
        {payload[0].payload.name}
      </h4>
      <p className={cn('mb-0')}>
        <MoneyValue bold amount={payload[0].payload.value} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

CustomTooltip.defaultProps = {
  active: false,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array.isRequired,
};

const TestTreeMap = ({ data }) => {
  const [colors, setColors] = useState();

  useEffect(() => {
    const temp = sortBy(data, 'total').reverse();
    setColors(Object.fromEntries(temp.map(({ root }, key) => [root, RAINBOW_COLORS[key]])));
  }, [data]);

  if (!colors) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap dataKey="total" ratio={4 / 3} data={data} content={<Cell colors={colors} />}>
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TestTreeMap;

import React, { useState } from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';

const COINS = [
  {
    symbol: 'ADA', amount: 300, color: '#0033ad', inUSD: 1.48,
  },
  {
    symbol: 'SQL', amount: 5, color: '#00ffbd', inUSD: 37.6,
  },
  {
    symbol: 'BTC', amount: 0.005, color: '#F7937A', inUSD: 3767,
  },
];

const TestPieChart = () => {
  const [active, setActive] = useState();
  const width = 400;
  const half = width / 2;

  return (
    <svg width={width} height={width}>
      <Group top={half} left={half}>
        <Pie
          data={COINS}
          pieValue={({ amount, inUSD }) => amount * inUSD}
          outerRadius={half}
          innerRadius={({ data }) => {
            const size = active?.symbol === data.symbol ? 12 : 8;
            return half - size;
          }}
          padAngle={0.01}
        >
          {(pie) => pie.arcs.map((arc) => (
            <g key={arc.data.symbol} onMouseEnter={() => setActive(arc.data)} onMouseLeave={() => setActive()}>
              <path d={pie.path(arc)} fill={arc.data.color}></path>
            </g>
          ))}
        </Pie>

        <Text textAnchor="middle" fill="#fff" fontSize="40" dy={-20}>
          $
          {Math.ceil(COINS.reduce((acc, { amount, inUSD }) => acc + amount * inUSD, 0))}
        </Text>

        <Text textAnchor="middle" fill="#aaa" fontSize="20" dy={20}>
          {COINS.length}
          {' '}
          Assets
        </Text>
      </Group>
    </svg>
  );
};

export default TestPieChart;

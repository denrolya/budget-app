import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts';

import MoneyValue from 'src/components/MoneyValue';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <h5 className="mb-1">{payload[0].payload.name}</h5>
      <p className={cn('mb-0')}>
        <MoneyValue bold amount={payload[0].payload.total} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

const TransactionCategoriesRadial = ({ account, data, legend }) => {
  const [chartData, setChartData] = useState([]);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

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
      <RadialBarChart cx="50%" cy="50%" innerRadius="15%" outerRadius="100%" barSize={20} data={chartData}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          clockWise
          background={{ fill: '#ffffff11' }}
          angleAxisId={0}
          minAngle={15}
          label={false}
          dataKey="percentage"
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

export default TransactionCategoriesRadial;

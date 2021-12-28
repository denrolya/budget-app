import React from 'react';

import IncomeExpenseChart from 'src/components/charts/recharts/IncomeExpense';
import TestPieChart from 'src/components/charts/visx/TestPieChart';
import MoneyFlowChart from 'src/components/charts/recharts/MoneyFlowByInterval';

const TestPage = () => (
  <>
    <IncomeExpenseChart />

    <TestPieChart />

    <MoneyFlowChart interval="month" />
  </>
);

export default TestPage;

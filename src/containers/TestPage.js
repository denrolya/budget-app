import React from 'react';
import { Helmet } from 'react-helmet';

import IncomeExpenseChart from 'src/components/charts/recharts/IncomeExpense';
import TestPieChart from 'src/components/charts/visx/TestPieChart';
import MoneyFlowChart from 'src/components/charts/recharts/MoneyFlowByInterval';

const TestPage = () => (
  <>
    <Helmet>
      <title>
        Test Page | Budget
      </title>
    </Helmet>

    <IncomeExpenseChart />

    <TestPieChart />

    <MoneyFlowChart interval="month" />
  </>
);

export default TestPage;

import React from 'react';
import { Helmet } from 'react-helmet';

import IncomeExpenseChart from 'src/components/charts/recharts/bar/IncomeExpense';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';

const TestPage = () => (
  <>
    <Helmet>
      <title>
        Test Page | Budget
      </title>
    </Helmet>

    <IncomeExpenseChart />

    <MoneyFlowChart interval="month" />
  </>
);

export default TestPage;

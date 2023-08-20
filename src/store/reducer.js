import { combineReducers } from 'redux';
import { resettableReducer } from 'reduxsauce';
import { createRouterReducer } from '@lagunovsky/redux-react-router';

import history from 'src/utils/history';
import { RESET_ACTION } from 'src/store/actions/global';
import accountReducer from 'src/store/reducers/account';
import authReducer from 'src/store/reducers/auth';
import categoryReducer from 'src/store/reducers/category';
import debtReducer from 'src/store/reducers/debt';
import transactionReducer from 'src/store/reducers/transaction';
import transferReducer from 'src/store/reducers/transfer';
import reportReducer from 'src/store/reducers/report';
import uiReducer from 'src/store/reducers/ui';
import exchangeRatesReducer from 'src/store/reducers/exchangeRates';

const resettable = resettableReducer(RESET_ACTION);

export default combineReducers({
  router: createRouterReducer(history),
  auth: authReducer,
  exchangeRates: resettable(exchangeRatesReducer),
  account: resettable(accountReducer),
  category: resettable(categoryReducer),
  debt: resettable(debtReducer),
  ui: resettable(uiReducer),
  transaction: resettable(transactionReducer),
  transfer: resettable(transferReducer),
  report: resettable(reportReducer),
});

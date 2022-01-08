import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { createRouterMiddleware } from '@lagunovsky/redux-react-router';

import history from 'src/services/history';
import reducer from 'src/store/reducer';

const routerMiddleware = createRouterMiddleware(history);
const middlewares = [thunkMiddleware, routerMiddleware];
const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

export default createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

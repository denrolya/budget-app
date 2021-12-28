import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import reducer from 'src/store/reducer';

const middlewares = [thunkMiddleware];
const composeEnhancers = composeWithDevTools({
  trace:      true,
  traceLimit: 25,
});

export default createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));

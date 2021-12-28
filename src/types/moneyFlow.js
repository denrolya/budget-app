import { object, oneOf, oneOfType, shape, string } from 'prop-types';

export const moneyFlowDataType = shape({
  expenses: object,
  revenue: object,
  earnings: object,
  average: object,
});

const moneyFlowType = shape({
  data: moneyFlowDataType.isRequired,
  from: oneOfType([object, string]).isRequired,
  to: oneOfType([object, string]).isRequired,
  interval: oneOf(['day', 'week', 'month']).isRequired,
});

export default moneyFlowType;

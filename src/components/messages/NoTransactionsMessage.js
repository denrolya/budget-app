import React from 'react';

import CenteredMessage from 'src/components/messages/CenteredMessage';

const NoTransactionsMessage = () => (
  <CenteredMessage title="No transactions found!" message="Register some, or select another filter parameters." />
);

export default NoTransactionsMessage;

import { createContext, useContext } from 'react';
import { ACCOUNT_TYPE_CASH } from 'src/constants/account';
import BaseCurrencyContext from 'src/contexts/BaseCurrency';

const AccountsContext = createContext([]);

export const useAccounts = () => useContext(AccountsContext);
export const useDefaultCashAccount = () => {
  const { code } = useContext(BaseCurrencyContext);
  useContext(AccountsContext).find(({ currency, type }) => type === ACCOUNT_TYPE_CASH && currency === code);
};
export const useActiveAccounts = () => useContext(AccountsContext).filter(({ archivedAt }) => !archivedAt);
export const useArchivedAccounts = () => useContext(AccountsContext).filter(({ archivedAt }) => !!archivedAt);

export default AccountsContext;

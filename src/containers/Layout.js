import cn from 'classnames';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import { connect } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import AccountForm from 'src/components/forms/AccountForm';
import DebtForm from 'src/components/forms/DebtForm';
import ModalForm from 'src/components/forms/ModalForm';
import TransferForm from 'src/components/forms/TransferForm';
import Header from 'src/components/layout/Header';
import Sidebar from 'src/components/layout/Sidebar';
import { ROUTE_DASHBOARD, ROUTE_DEBTS, ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { useTransactionForm } from 'src/contexts/TransactionFormProvider';
import { isActionLoading, copyToClipboard } from 'src/services/common';
import { getBrandText } from 'src/services/routing';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { logoutUser } from 'src/store/actions/auth';
import { updateDashboard } from 'src/store/actions/dashboard';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import { fetchList as fetchCategories } from 'src/store/actions/category';
import { registerTransaction } from 'src/store/actions/transaction';
import { switchBaseCurrency } from 'src/store/actions/user';
import {
  closeSidebar,
  openSidebar,
  toggleAccountModal,
  toggleDarkMode,
  toggleDebtModal,
  toggleHeader,
  toggleSidebar,
  toggleDraftExpenseModal,
  toggleTransferModal,
} from 'src/store/actions/ui';
import { fetch as fetchExchangeRates } from 'src/store/actions/exchangeRates';
import DraftCashExpenseForm from 'src/containers/DraftCashExpenseForm';

const Layout = ({
  colorScheme,
  accounts,
  totalDebt,
  logoutUser,
  toggleDarkMode,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleHeader,
  toggleDraftExpenseModal,
  toggleTransferModal,
  toggleDebtModal,
  toggleAccountModal,
  switchBaseCurrency,
  isDarkModeOn,
  isHeaderOpened,
  isSidebarOpened,
  isTransferModalOpened,
  isDebtModalOpened,
  isAccountModalOpened,
  isTransferRequestInProgress,
  isAssetsLoading,
  updateDashboard,
  registerTransaction,
  fetchAccounts,
  fetchCategories,
  fetchDebts,
  fetchExchangeRates,
}) => {
  const [isVitalDataLoaded, setIsVitalDataLoaded] = useState(false);
  const toggleTransactionForm = useTransactionForm();
  const toggleNewTransaction = () => toggleTransactionForm({
    onSubmit: ({ type, ...values }) => registerTransaction(type, values),
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const swipeHandlers = useSwipeable({
    onSwipedRight: ({ initial }) => initial[0] < 20 && !isSidebarOpened && openSidebar(),
    onSwipedLeft: () => isSidebarOpened && closeSidebar(),
    delta: 40,
    preventDefaultTouchmoveEvent: false,
  });

  const fetchData = async () => {
    await fetchAccounts();
    await fetchDebts();
    await fetchExchangeRates();
    await fetchCategories();
    setIsVitalDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyTokenToClipboard = () => copyToClipboard(localStorage.getItem('token'));

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <>
      <Hotkeys keyName="shift+t" onKeyUp={toggleNewTransaction} />
      <Hotkeys keyName="shift+e" onKeyUp={toggleDraftExpenseModal} />
      <Hotkeys keyName="shift+r" onKeyUp={toggleTransferModal} />
      <Hotkeys keyName="shift+d" onKeyUp={toggleDebtModal} />
      <Hotkeys keyName="shift+a" onKeyUp={toggleAccountModal} />
      <Hotkeys keyName="t" onKeyUp={() => navigate(ROUTE_TRANSACTIONS)} />
      <Hotkeys keyName="h" onKeyUp={() => navigate(ROUTE_DASHBOARD)} />
      <Hotkeys keyName="d" onKeyUp={() => navigate(ROUTE_DEBTS)} />

      <div
        {...swipeHandlers}
        data-color={colorScheme}
        className={cn('wrapper', {
          'nav-open': isSidebarOpened,
          'white-content': !isDarkModeOn,
        })}
      >
        <Sidebar
          accounts={accounts}
          totalDebt={totalDebt}
          isLoading={isAssetsLoading}
          onCurrencySwitch={switchBaseCurrency}
          updateDashboard={updateDashboard}
        />

        <div
          className="main-panel"
          role="main"
          data-color={colorScheme}
          onClick={() => isSidebarOpened && toggleSidebar()}
        >
          <Header
            onCurrencySwitch={switchBaseCurrency}
            onTokenCopyClick={copyTokenToClipboard}
            brandText={getBrandText(pathname)}
            logoutUser={logoutUser}
            updateDashboard={updateDashboard}
            toggle={toggleHeader}
            toggleDarkMode={toggleDarkMode}
            toggleTransactionModal={toggleNewTransaction}
            isOpened={isHeaderOpened}
            toggleSidebar={toggleSidebar}
            isSidebarOpened={isSidebarOpened}
          />
          <div className="content">
            {isVitalDataLoaded && (
              <Outlet />
            ) }
          </div>
        </div>
      </div>

      <DraftCashExpenseForm />

      <ModalForm title="Add Transfer" isOpen={isTransferModalOpened} toggleModal={toggleTransferModal}>
        <TransferForm isLoading={isTransferRequestInProgress} toggleModal={toggleTransferModal} />
      </ModalForm>

      <DebtForm title="New Debt" isOpen={isDebtModalOpened} toggleModal={toggleDebtModal} />

      <ModalForm title="Add Account" isOpen={isAccountModalOpened} toggleModal={toggleAccountModal}>
        <AccountForm toggleModal={toggleAccountModal} />
      </ModalForm>

      <button
        type="button"
        className="fixed-plugin"
        onClick={window.isMobile ? toggleDraftExpenseModal : toggleNewTransaction}
      >
        <i aria-hidden className="fa fa-plus fa-2x" />
      </button>
    </>
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

Layout.defaultProps = {
  accounts: [],
  colorScheme: 'gray',
  totalDebt: 0,
};

Layout.propTypes = {
  closeSidebar: PropTypes.func.isRequired,
  fetchAccounts: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchDebts: PropTypes.func.isRequired,
  fetchExchangeRates: PropTypes.func.isRequired,
  isAccountModalOpened: PropTypes.bool.isRequired,
  isAssetsLoading: PropTypes.bool.isRequired,
  isDarkModeOn: PropTypes.bool.isRequired,
  isDebtModalOpened: PropTypes.bool.isRequired,
  isHeaderOpened: PropTypes.bool.isRequired,
  isSidebarOpened: PropTypes.bool.isRequired,
  isTransferModalOpened: PropTypes.bool.isRequired,
  isTransferRequestInProgress: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
  openSidebar: PropTypes.func.isRequired,
  registerTransaction: PropTypes.func.isRequired,
  switchBaseCurrency: PropTypes.func.isRequired,
  toggleAccountModal: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  toggleDebtModal: PropTypes.func.isRequired,
  toggleHeader: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleDraftExpenseModal: PropTypes.func.isRequired,
  toggleTransferModal: PropTypes.func.isRequired,
  updateDashboard: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  colorScheme: PropTypes.oneOf(['blue', 'gray', 'indigo', 'lightblue', 'primary', 'green']),
  totalDebt: PropTypes.number,
};

const mapStateToProps = ({
  ui, account, auth: { user }, debt,
}) => ({
  isDarkModeOn: ui.isDarkModeOn,
  isSidebarOpened: ui.isSidebarOpened,
  isHeaderOpened: ui.isHeaderOpened,
  isTransferModalOpened: ui.isTransferModalOpened,
  isDebtModalOpened: ui.isDebtModalOpened,
  isAccountModalOpened: ui.isAccountModalOpened,
  isTransferRequestInProgress: isActionLoading(ui.TRANSFER_REGISTER),
  accounts: account.filter(({ archivedAt }) => !archivedAt),
  totalDebt: sumBy(debt.filter(({ closedAt }) => !closedAt), ({ convertedValues }) => convertedValues[user.baseCurrency]),
  isAssetsLoading: isActionLoading(ui.ACCOUNT_FETCH_LIST) || isActionLoading(ui.DEBT_FETCH_LIST),
});

export default connect(mapStateToProps, {
  toggleDarkMode,
  toggleHeader,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleDraftExpenseModal,
  toggleTransferModal,
  toggleDebtModal,
  toggleAccountModal,
  logoutUser,
  updateDashboard,
  registerTransaction,
  switchBaseCurrency,
  fetchAccounts,
  fetchCategories,
  fetchDebts,
  fetchExchangeRates,
})(Layout);

import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Hotkeys from 'react-hot-keys';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import AccountForm from 'src/components/forms/AccountForm';
import DebtForm from 'src/components/forms/DebtForm';
import ModalForm from 'src/components/forms/ModalForm';
import TransactionModalForm from 'src/components/forms/TransactionModalForm';
import TransferForm from 'src/components/forms/TransferForm';
import Header from 'src/components/layout/Header';
import Sidebar from 'src/components/layout/Sidebar';
import { ROUTE_DASHBOARD, ROUTE_DEBTS, ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { isActionLoading, copyToClipboard } from 'src/services/common';
import { getBrandText } from 'src/services/routing';
import { formatTransactionToFormType } from 'src/services/transaction';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { logoutUser } from 'src/store/actions/auth';
import { updateDashboard } from 'src/store/actions/dashboard';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import { registerTransaction } from 'src/store/actions/transaction';
import { notify } from 'src/store/actions/global';
import { switchBaseCurrency } from 'src/store/actions/user';
import {
  closeSidebar,
  openSidebar,
  toggleAccountModal,
  toggleDarkMode,
  toggleDebtModal,
  toggleHeader,
  toggleSidebar,
  toggleTransactionModal,
  toggleDraftExpenseModal,
  toggleTransferModal,
} from 'src/store/actions/ui';
import { fetch as fetchExchangeRates } from 'src/store/actions/exchangeRates';
import DraftCashExpenseForm from 'src/components/forms/DraftCashExpenseForm';

const Layout = ({
  colorScheme,
  accounts,
  debts,
  logoutUser,
  toggleDarkMode,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleHeader,
  toggleTransactionModal,
  toggleDraftExpenseModal,
  toggleTransferModal,
  toggleDebtModal,
  toggleAccountModal,
  registerTransaction,
  switchBaseCurrency,
  isDarkModeOn,
  isHeaderOpened,
  isSidebarOpened,
  isTransactionModalOpened,
  isDraftExpenseModalOpened,
  isTransferModalOpened,
  isDebtModalOpened,
  isAccountModalOpened,
  isTransactionRequestInProgress,
  isTransferRequestInProgress,
  isAssetsLoading,
  updateDashboard,
  fetchAccounts,
  fetchDebts,
  fetchExchangeRates,
  children,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const swipeHandlers = useSwipeable({
    onSwipedRight: ({ initial }) => initial[0] < 20 && !isSidebarOpened && openSidebar(),
    onSwipedLeft: () => isSidebarOpened && closeSidebar(),
    delta: 40,
    preventDefaultTouchmoveEvent: false,
  });

  const handleTransactionSubmission = (transaction) =>
    registerTransaction(transaction.type, formatTransactionToFormType(transaction));

  useEffect(() => {
    fetchAccounts();
    fetchDebts();
    fetchExchangeRates();
  }, []);

  const copyTokenToClipboard = () => {
    copyToClipboard(localStorage.getItem('token'));

    notify('info', 'Copied to clipboard');
  };

  return (
    <>
      <Hotkeys keyName="shift+t" onKeyUp={toggleTransactionModal} />
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
          debts={debts}
          loading={isAssetsLoading}
          onCurrencySwitch={switchBaseCurrency}
          updateDashboard={updateDashboard}
        />

        <div className="main-panel" data-color={colorScheme} onClick={() => isSidebarOpened && toggleSidebar()}>
          <Header
            onCurrencySwitch={switchBaseCurrency}
            onTokenCopyClick={copyTokenToClipboard}
            brandText={getBrandText(pathname)}
            logoutUser={logoutUser}
            updateDashboard={updateDashboard}
            toggle={toggleHeader}
            toggleDarkMode={toggleDarkMode}
            toggleTransactionModal={toggleTransactionModal}
            isOpened={isHeaderOpened}
            toggleSidebar={toggleSidebar}
            isSidebarOpened={isSidebarOpened}
          />
          <div className="content pb-0">{children}</div>
        </div>
      </div>

      <DraftCashExpenseForm
        isOpen={isDraftExpenseModalOpened}
        isLoading={isTransactionRequestInProgress}
        toggleModal={toggleDraftExpenseModal}
        onSubmit={handleTransactionSubmission}
      />

      <TransactionModalForm
        isOpen={isTransactionModalOpened}
        isLoading={isTransactionRequestInProgress}
        toggleTransactionModal={toggleTransactionModal}
        onSubmit={handleTransactionSubmission}
      />

      <ModalForm title="Add Transfer" isOpen={isTransferModalOpened} toggleModal={toggleTransferModal}>
        <TransferForm isLoading={isTransferRequestInProgress} toggleModal={toggleTransferModal} />
      </ModalForm>

      <ModalForm title="Add Debt" isOpen={isDebtModalOpened} toggleModal={toggleDebtModal}>
        <DebtForm toggleModal={toggleDebtModal} />
      </ModalForm>

      <ModalForm title="Add Account" isOpen={isAccountModalOpened} toggleModal={toggleAccountModal}>
        <AccountForm toggleModal={toggleAccountModal} />
      </ModalForm>

      <div className="fixed-plugin">
        <div className="dropdown show-dropdown">
          <div onClick={window.isMobile ? toggleDraftExpenseModal : toggleTransactionModal}>
            <i aria-hidden className="fa fa-plus fa-2x" />
          </div>
        </div>
      </div>
    </>
  );
};

Layout.defaultProps = {
  accounts: [],
  debts: [],
};

Layout.propTypes = {
  closeSidebar: PropTypes.func.isRequired,
  colorScheme: PropTypes.string.isRequired,
  fetchAccounts: PropTypes.func.isRequired,
  fetchDebts: PropTypes.func.isRequired,
  fetchExchangeRates: PropTypes.func.isRequired,
  isAccountModalOpened: PropTypes.bool.isRequired,
  isAssetsLoading: PropTypes.bool.isRequired,
  isDarkModeOn: PropTypes.bool.isRequired,
  isDebtModalOpened: PropTypes.bool.isRequired,
  isHeaderOpened: PropTypes.bool.isRequired,
  isSidebarOpened: PropTypes.bool.isRequired,
  isTransactionModalOpened: PropTypes.bool.isRequired,
  isDraftExpenseModalOpened: PropTypes.bool.isRequired,
  isTransactionRequestInProgress: PropTypes.bool.isRequired,
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
  toggleTransactionModal: PropTypes.func.isRequired,
  toggleDraftExpenseModal: PropTypes.func.isRequired,
  toggleTransferModal: PropTypes.func.isRequired,
  updateDashboard: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  debts: PropTypes.array,
};

const mapStateToProps = ({ ui, account, debt }) => ({
  isDarkModeOn: ui.isDarkModeOn,
  colorScheme: ui.colorScheme,
  isSidebarOpened: ui.isSidebarOpened,
  isHeaderOpened: ui.isHeaderOpened,
  isDraftExpenseModalOpened: ui.isDraftExpenseModalOpened,
  isTransactionModalOpened: ui.isTransactionModalOpened,
  isTransferModalOpened: ui.isTransferModalOpened,
  isDebtModalOpened: ui.isDebtModalOpened,
  isAccountModalOpened: ui.isAccountModalOpened,
  isTransactionRequestInProgress: isActionLoading(ui.TRANSACTION_REGISTER),
  isTransferRequestInProgress: isActionLoading(ui.TRANSFER_REGISTER),
  accounts: account.filter(({ archivedAt }) => !archivedAt),
  debts: debt.debts,
  isAssetsLoading: isActionLoading(ui.ACCOUNT_FETCH_LIST) || isActionLoading(ui.DEBT_FETCH_LIST),
});

export default connect(mapStateToProps, {
  toggleDarkMode,
  toggleHeader,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  toggleTransactionModal,
  toggleDraftExpenseModal,
  toggleTransferModal,
  toggleDebtModal,
  toggleAccountModal,
  logoutUser,
  updateDashboard,
  registerTransaction,
  switchBaseCurrency,
  fetchAccounts,
  fetchDebts,
  fetchExchangeRates,
})(Layout);

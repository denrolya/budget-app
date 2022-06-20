import cn from 'classnames';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import React from 'react';
import Hotkeys from 'react-hot-keys';
import { connect } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import AccountForm from 'src/components/forms/AccountForm';
import DebtForm from 'src/components/forms/DebtForm';
import ModalForm from 'src/components/forms/ModalForm';
import TransferForm from 'src/components/forms/TransferForm';
import Header from 'src/components/layout/Header';
import Sidebar from 'src/components/layout/Sidebar';
import { ROUTE_DASHBOARD, ROUTE_DEBTS, ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { useTransactionForm } from 'src/contexts/TransactionFormProvider';
import { isActionLoading, copyTokenToClipboard } from 'src/utils/common';
import { logoutUser } from 'src/store/actions/auth';
import { updateDashboard } from 'src/store/actions/dashboard';
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
import DraftCashExpenseForm from 'src/containers/DraftCashExpenseForm';

const Layout = ({
  colorScheme,
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
}) => {
  const toggleTransactionForm = useTransactionForm();
  const toggleNewTransaction = () => toggleTransactionForm({
    onSubmit: ({ type, ...values }) => registerTransaction(type, values),
  });
  const navigate = useNavigate();
  const swipeHandlers = useSwipeable({
    onSwipedRight: ({ initial }) => initial[0] < 20 && !isSidebarOpened && openSidebar(),
    onSwipedLeft: () => isSidebarOpened && closeSidebar(),
    delta: 40,
    preventDefaultTouchmoveEvent: false,
  });

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
            <Outlet />
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
  colorScheme: 'gray',
  totalDebt: 0,
};

Layout.propTypes = {
  closeSidebar: PropTypes.func.isRequired,
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
  colorScheme: PropTypes.oneOf(['blue', 'gray', 'indigo', 'lightblue', 'primary', 'green']),
  totalDebt: PropTypes.number,
};

const mapStateToProps = ({
  ui, auth: { user }, debt,
}) => ({
  isDarkModeOn: ui.isDarkModeOn,
  isSidebarOpened: ui.isSidebarOpened,
  isHeaderOpened: ui.isHeaderOpened,
  isTransferModalOpened: ui.isTransferModalOpened,
  isDebtModalOpened: ui.isDebtModalOpened,
  isAccountModalOpened: ui.isAccountModalOpened,
  isTransferRequestInProgress: isActionLoading(ui.TRANSFER_REGISTER),
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
})(Layout);

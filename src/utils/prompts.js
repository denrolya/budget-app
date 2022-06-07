import Swal from 'sweetalert2';

import { CURRENCIES } from 'src/constants/currency';

const BUTTON_INFO = 'btn btn-simple btn-info';
const BUTTON_SUCCESS = 'btn btn-simple btn-success';
const BUTTON_WARNING = 'btn btn-simple btn-warning';
const BUTTON_DANGER = 'btn btn-simple btn-danger';

const DEFAULT_PROPS = {
  showCancelButton: true,
  reverseButtons: true,
  buttonsStyling: false,
  cancelButtonText: 'Cancel',
};

export const switchCurrencyPrompt = (oldCurrencyCode, newCurrency) => Swal.fire({
  ...DEFAULT_PROPS,
  title: `Switch to ${newCurrency.code} (${newCurrency.symbol})`,
  text: 'You are switching base currency. Almost no changes in DB.',
  confirmButtonText: `Switch to ${newCurrency.code}`,
  cancelButtonText: `Keep ${oldCurrencyCode}`,
  confirmButtonClass: BUTTON_WARNING,
  cancelButtonClass: BUTTON_SUCCESS,

});

export const accountArchivationPrompt = (account) => Swal.fire({
  ...DEFAULT_PROPS,
  title: `Archive ${account.name}`,
  text: 'All the transactions remain. NOTHING is DELETED! Account can be restored later.',
  confirmButtonText: 'Archive',
  confirmButtonClass: BUTTON_WARNING,
  cancelButtonClass: BUTTON_INFO,
});

export const accountRestorationPrompt = (account) => Swal.fire({
  ...DEFAULT_PROPS,
  title: `Restore ${account.name}`,
  text: 'Is this account in use again?',
  confirmButtonText: 'Restore',
  confirmButtonClass: BUTTON_SUCCESS,
  cancelButtonClass: BUTTON_INFO,
});

export const accountNameChangePrompt = (account, newName) => Swal.fire({
  ...DEFAULT_PROPS,
  title: `Change ${account.name} to ${newName}?`,
  confirmButtonText: 'Change',
  confirmButtonClass: BUTTON_WARNING,
  cancelButtonClass: BUTTON_INFO,
});

export const transactionCancellationPrompt = ({ account, amount, type }) => Swal.fire({
  ...DEFAULT_PROPS,
  title: 'Cancel Transaction',
  text: `Are you sure you want to delete this ${type}?(${CURRENCIES[account.currency].symbol} ${amount})`,
  confirmButtonText: 'Yes, cancel this transaction',
  cancelButtonText: 'No, keep it',
  confirmButtonClass: BUTTON_DANGER,
  cancelButtonClass: BUTTON_SUCCESS,
});

export const transactionDeletionPrompt = ({ account, amount, type }) => Swal.fire({
  ...DEFAULT_PROPS,
  title: 'Irrevocably DELETE',
  text: `Are you sure you want to delete this ${type} FOREVER?(${CURRENCIES[account.currency].symbol} ${amount})`,
  confirmButtonText: 'DELETE',
  cancelButtonText: 'OMG, no',
  confirmButtonClass: BUTTON_DANGER,
  cancelButtonClass: BUTTON_SUCCESS,
});

export const categoryRemovalPrompt = ({ name }) => Swal.fire({
  ...DEFAULT_PROPS,
  title: 'Remove category',
  text: `Are you sure you want to completely remove category '${name}'? This involves transaction deletion, for all users!!!`,
  confirmButtonText: 'Yes, remove category & transactions!',
  confirmButtonClass: BUTTON_DANGER,
  cancelButtonClass: BUTTON_SUCCESS,
});

export const closeDebtPrompt = (debtor, currency, balance) => Swal.fire({
  ...DEFAULT_PROPS,
  title: 'Close this debt',
  text: `Are you sure you want to close ${debtor}'s debt?(${currency.symbol} ${balance})`,
  confirmButtonText: 'Yes, close this debt!',
  cancelButtonText: 'No, keep it',
  confirmButtonClass: BUTTON_DANGER,
  cancelButtonClass: BUTTON_SUCCESS,
});

export const transferDeletionPrompt = ({ id }) => Swal.fire({
  ...DEFAULT_PROPS,
  title: 'Delete transfer',
  text: `Are you sure you want to delete transfer #${id}?`,
  confirmButtonText: 'Delete',
  confirmButtonClass: BUTTON_DANGER,
  cancelButtonClass: BUTTON_SUCCESS,
});

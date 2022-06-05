import { CURRENCIES } from 'src/constants/currency';
import Swal from 'sweetalert2';

export const switchCurrencyPrompt = (oldCurrencyCode, newCurrency) => Swal.fire({
  icon: 'question',
  title: `Switch to ${newCurrency.code} (${newCurrency.symbol})`,
  text: 'You are switching base currency. Almost no changes in DB.',
  showCancelButton: true,
  confirmButtonText: `Switch to ${newCurrency.code}`,
  cancelButtonText: `Keep ${oldCurrencyCode}`,
  confirmButtonClass: 'btn btn-warning',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: true,
  buttonsStyling: false,
});

export const accountArchivationPrompt = (account) => Swal.fire({
  title: `Archive ${account.name}`,
  text: 'All the transactions remain. NOTHING is DELETED! Account can be restored later.',
  showCancelButton: true,
  confirmButtonText: 'Archive',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-simple btn-warning',
  cancelButtonClass: 'btn btn-simple btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const accountRestorationPrompt = (account) => Swal.fire({
  title: `Restore ${account.name}`,
  text: 'Is this account in use again?',
  showCancelButton: true,
  confirmButtonText: 'Restore',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const accountNameChangePrompt = (account, newName) => Swal.fire({
  title: `Change ${account.name} to ${newName}?`,
  showCancelButton: true,
  confirmButtonText: 'Change',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-warning',
  cancelButtonClass: 'btn btn-info',
  reverseButtons: true,
  buttonsStyling: false,
});

export const transactionCancellationPrompt = ({ account, amount, type }) => Swal.fire({
  title: 'Cancel Transaction',
  text: `Are you sure you want to delete this ${type}?(${CURRENCIES[account.currency].symbol} ${amount})`,
  showCancelButton: true,
  confirmButtonText: 'Yes, cancel this transaction',
  cancelButtonText: 'No, keep it',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: true,
  buttonsStyling: false,
});

export const transactionDeletionPrompt = ({ account, amount, type }) => Swal.fire({
  title: 'Irrevocably DELETE',
  text: `Are you sure you want to delete this ${type} FOREVER?(${CURRENCIES[account.currency].symbol} ${amount})`,
  showCancelButton: true,
  confirmButtonText: 'DELETE',
  cancelButtonText: 'OMG, no',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: true,
  buttonsStyling: false,
});

export const categoryRemovalPrompt = ({ name }) => Swal.fire({
  title: 'Remove category',
  text: `Are you sure you want to completely remove category '${name}'? This involves transaction deletion, for all users!!!`,
  showCancelButton: true,
  confirmButtonText: 'Yes, remove category & transactions!',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: true,
  buttonsStyling: false,
});

export const closeDebtPrompt = (debtor, currency, balance) => Swal.fire({
  title: 'Close this debt',
  text: `Are you sure you want to close ${debtor}'s debt?(${currency.symbol} ${balance})`,
  showCancelButton: true,
  confirmButtonText: 'Yes, close this debt!',
  cancelButtonText: 'No, keep it',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: false,
  buttonsStyling: false,
});

export const transferDeletionPrompt = ({ id }) => Swal.fire({
  title: 'Delete transfer',
  text: `Are you sure you want to delete transfer #${id}?`,
  showCancelButton: true,
  confirmButtonText: 'Delete',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: true,
  buttonsStyling: false,
});

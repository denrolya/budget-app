import toastr from 'toastr';

toastr.options = {
  toastClass: 'alert',
  iconClasses: {
    error: 'alert-danger',
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
  },
  positionClass: 'toast-bottom-right',
  closeButton: false,
  preventDuplicates: true,
  preventOpenDuplicates: true,
  timeOut: 3000,
  escapeHtml: false,
};

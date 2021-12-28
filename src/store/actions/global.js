import toastr from 'toastr';

export const RESET_ACTION = 'RESET';

export const notify = (type, message, title = null) => toastr[type](message, title);

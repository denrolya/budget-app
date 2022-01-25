import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    toggleDarkMode: null,
    toggleSidebar: ['isOpen'],
    toggleHeader: null,
    toggleDraftExpenseModal: null,
    toggleTransferModal: null,
    toggleDebtModal: null,
    toggleAccountModal: null,
  },
  { prefix: 'UI_' },
);

export const toggleDarkMode = () => (dispatch) => dispatch(Creators.toggleDarkMode());

export const openSidebar = () => (dispatch) => dispatch(Creators.toggleSidebar(true));

export const closeSidebar = () => (dispatch) => dispatch(Creators.toggleSidebar(false));

export const toggleSidebar = () => (dispatch) => dispatch(Creators.toggleSidebar(null));

export const toggleHeader = () => (dispatch) => dispatch(Creators.toggleHeader());

export const toggleDraftExpenseModal = () => (dispatch) => dispatch(Creators.toggleDraftExpenseModal());

export const toggleTransferModal = () => (dispatch) => dispatch(Creators.toggleTransferModal());

export const toggleDebtModal = () => (dispatch) => dispatch(Creators.toggleDebtModal());

export const toggleAccountModal = () => (dispatch) => dispatch(Creators.toggleAccountModal());

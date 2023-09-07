import { Types } from 'src/store/actions/ui';
import { randomString } from 'src/utils/randomData';

export const INITIAL_STATE = {
  isDarkModeOn: true,
  error: null,
  isSidebarOpened: false,
  isHeaderOpened: false,
  isDraftExpenseModalOpened: false,
  isTransferModalOpened: false,
  isDebtModalOpened: false,
  isAccountModalOpened: false,
  updateStatisticsTrigger: false,
};

// eslint-disable-next-line default-param-last
export default (state = INITIAL_STATE, action) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
  if (!matches) {
    switch (action.type) {
      case Types.TOGGLE_DARK_MODE:
        return {
          ...state,
          isDarkModeOn: !state.isDarkModeOn,
        };
      case Types.TOGGLE_SIDEBAR:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isSidebarOpened: action.isOpen === null ? !state.isSidebarOpened : action.isOpen,
        };
      case Types.TOGGLE_HEADER:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isHeaderOpened: !state.isHeaderOpened,
        };
      case Types.TOGGLE_DRAFT_EXPENSE_MODAL:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isDraftExpenseModalOpened: !state.isDraftExpenseModalOpened,
        };
      case Types.TOGGLE_TRANSFER_MODAL:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isTransferModalOpened: !state.isTransferModalOpened,
        };
      case Types.TOGGLE_DEBT_MODAL:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isDebtModalOpened: !state.isDebtModalOpened,
        };
      case Types.TOGGLE_ACCOUNT_MODAL:
        return {
          ...state,
          ...INITIAL_STATE,
          isDarkModeOn: state.isDarkModeOn,
          isAccountModalOpened: !state.isAccountModalOpened,
        };
      case Types.UPDATE_STATISTICS:
        return {
          ...state,
          updateStatisticsTrigger: randomString(10),
        };
      default:
        return state;
    }
  }

  const [, requestName, requestState] = matches;

  return {
    ...state,
    [requestName]: requestState === 'REQUEST',
    error: action.error,
  };
};

import { createContext, useContext } from 'react';
import {
  COMPENSATION_TRANSACTION_CATEGORY_NAME,
  DEBT_TRANSACTION_CATEGORY_NAME,
  EXPENSE_TYPE,
} from 'src/constants/transactions';

/**
 * TODO: should contain loading status inside context that should be used in the layout
 */
const CategoriesContext = createContext({
  categories: [],
  expense: [],
  income: [],
});

export const useCategories = () => useContext(CategoriesContext).categories;
export const useExpenseCategories = () => useContext(CategoriesContext).expense;
export const useIncomeCategories = () => useContext(CategoriesContext).income;
export const useUnknownExpenseCategory = () => useContext(CategoriesContext).expense.find(({ name, type }) => type === EXPENSE_TYPE && name === 'Unknown')?.id;
export const useDebtIncomeCategory = () => useContext(CategoriesContext).income.find(({ name }) => name === DEBT_TRANSACTION_CATEGORY_NAME);
export const useCompensationIncomeCategory = () => useContext(CategoriesContext).income.find(({ name }) => name === COMPENSATION_TRANSACTION_CATEGORY_NAME);

export default CategoriesContext;

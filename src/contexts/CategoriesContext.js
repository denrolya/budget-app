import { createContext, useContext } from 'react';
import {
  COMPENSATION_TRANSACTION_CATEGORY_NAME,
  DEBT_TRANSACTION_CATEGORY_NAME,
  EXPENSE_TYPE, INCOME_TYPE,
} from 'src/constants/transactions';
import { listToTree } from 'src/utils/category';

const CategoriesContext = createContext([]);

export const useCategories = () => useContext(CategoriesContext);
export const useCategoriesTree = () => listToTree(useContext(CategoriesContext));
export const useExpenseCategories = () => useContext(CategoriesContext).filter(({ type }) => type === EXPENSE_TYPE);
export const useIncomeCategories = () => useContext(CategoriesContext).filter(({ type }) => type === INCOME_TYPE);
export const useUnknownExpenseCategory = () => useContext(CategoriesContext).find(({ name, type }) => type === EXPENSE_TYPE && name === 'Unknown');
export const useDebtIncomeCategory = () => useContext(CategoriesContext).find(({ name, type }) => type === INCOME_TYPE && name === DEBT_TRANSACTION_CATEGORY_NAME);
export const useCompensationIncomeCategory = () => useContext(CategoriesContext).find(({ name, type }) => type === INCOME_TYPE && name === COMPENSATION_TRANSACTION_CATEGORY_NAME);

export default CategoriesContext;

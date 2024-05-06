import PropTypes from 'prop-types';
import React from 'react';
import {
  Button, Form, FormGroup, Label, Input,
} from 'reactstrap';

import CategoryTypeahead from 'src/components/CategoryTypeahead';
import { TRANSACTION_TYPES } from 'src/constants/transactions';
import { useAccountsWithDefaultOrder } from 'src/contexts/AccountsContext';
import { useCategories } from 'src/contexts/CategoriesContext';
import TransactionFiltersModel, { DEFAULT_VALUES } from 'src/models/TransactionFilters';
import DateRange from 'src/components/forms/fields/DateRange';
import AccountName from 'src/components/AccountName';

const TransactionFilters = ({ onModelChange, model }) => {
  const accounts = useAccountsWithDefaultOrder();
  const categories = useCategories();

  const { from, to } = model;

  const onDateRangeFilterChange = (event, { startDate, endDate }) => onModelChange(model.setFromTo(startDate, endDate));
  const onDateRangeFilterReset = () => onModelChange(model.setFromTo(DEFAULT_VALUES.from, DEFAULT_VALUES.to));

  return (
    <Form className="form transaction-filters">
      {model.hasChanged() && (
        <Button
          block
          size="sm"
          color="warning"
          className="mb-3"
          onClick={() => onModelChange(model.merge(DEFAULT_VALUES))}
        >
          Reset
        </Button>
      )}
      <FormGroup className="mb-4">
        <div className="ml-3" />
        <div className="ml-3">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={model.onlyDrafts}
                onChange={() => onModelChange(model.set('onlyDrafts', !model.onlyDrafts))}
              />
              <span className="form-check-sign" />
              {' '}
              Drafts
            </Label>
          </FormGroup>
        </div>
      </FormGroup>

      <FormGroup className="mb-4">
        <h5>Date Range:</h5>
        <div className="ml-3">
          <DateRange
            showReset={!model.isDefault('from') || !model.isDefault('to')}
            from={from}
            to={to}
            onApply={onDateRangeFilterChange}
            onReset={onDateRangeFilterReset}
          />
        </div>
      </FormGroup>

      <FormGroup className="mb-4">
        <h5>Types:</h5>
        <ul className="list-unstyled">
          {TRANSACTION_TYPES.map((type) => (
            <li className="ml-3" key={type}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={model.hasType(type)}
                    onChange={() => onModelChange(model.toggleType(type))}
                  />
                  <span className="form-check-sign" />
                  {' '}
                  <span className="text-capitalize">{type}</span>
                </Label>
              </FormGroup>
            </li>
          ))}
        </ul>
      </FormGroup>

      <FormGroup className="mb-4">
        <h5>Categories:</h5>
        <FormGroup>
          <CategoryTypeahead
            onChange={(selected) => onModelChange(model.setCategories(selected))}
            selected={model.categories.map((id) => categories.find((c) => c.id === id))}
          />
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={model.withNestedCategories}
                onChange={() => onModelChange(model.set('withNestedCategories', !model.withNestedCategories))}
              />
              <span className="form-check-sign" />
              {' '}
              <span className="text-capitalize">Nested</span>
            </Label>
          </FormGroup>
        </FormGroup>
      </FormGroup>

      <FormGroup>
        {accounts.length > 0 && (
          <>
            <h5>Accounts:</h5>
            <ul className="list-unstyled">
              {accounts.map((account) => (
                <li className="ml-3" key={account.id}>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={model.hasAccount(account)}
                        onChange={() => onModelChange(model.toggleAccount(account))}
                      />
                      <span className="form-check-sign" />
                      {' '}
                      <AccountName account={account} />
                    </Label>
                  </FormGroup>
                </li>
              ))}
            </ul>
          </>
        )}
      </FormGroup>
    </Form>
  );
};

TransactionFilters.defaultProps = {};

TransactionFilters.propTypes = {
  model: PropTypes.instanceOf(TransactionFiltersModel).isRequired,
  onModelChange: PropTypes.func.isRequired,
};

export default TransactionFilters;

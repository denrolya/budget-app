import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Form, FormGroup, Label, Input,
} from 'reactstrap';

import { TRANSACTION_TYPES } from 'src/constants/transactions';
import { fetchCategories } from 'src/store/actions/category';
import TransactionFiltersModel from 'src/models/TransactionFilters';
import DateRange from 'src/components/forms/fields/DateRange';
import AccountName from 'src/components/AccountName';

const TransactionFilters = ({ accounts, onModelChange, model }) => {
  const typeaheads = [];
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  const { from, to, categories } = model;

  useEffect(() => {
    fetchCategories().then((res) => setCategoriesOptions(uniqBy(res, 'name')));
  }, []);

  const applyDateRangeFilter = (event, { startDate, endDate }) => onModelChange(model.setFromTo(startDate, endDate));

  return (
    <Form className="form transaction-filters">
      <FormGroup className="mb-4">
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
        <div className="ml-3">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={model.withCanceled}
                onChange={() => onModelChange(model.set('withCanceled', !model.withCanceled))}
              />
              <span className="form-check-sign" />
              {' '}
              With canceled
            </Label>
          </FormGroup>
        </div>
      </FormGroup>

      <FormGroup className="mb-4">
        <h5>Date range:</h5>
        <DateRange from={from} to={to} onApply={applyDateRangeFilter} />
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
        <Typeahead
          id="categories"
          multiple
          ref={(t) => typeaheads.push(t)}
          placeholder="Filter by categories..."
          selected={categories}
          labelKey="name"
          onChange={(selected) => onModelChange(model.setCategories(selected))}
          options={categoriesOptions.filter(
            ({ type, name }) => TRANSACTION_TYPES.includes(type) && !categories.includes(name),
          )}
        />
      </FormGroup>

      <FormGroup>
        {accounts.length > 0 && (
          <>
            <h5>Accounts:</h5>
            <ul className="list-unstyled">
              {accounts
                .sort((a, b) => b.lastTransactionAt - a.lastTransactionAt)
                .map((account) => (
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

TransactionFilters.defaultProps = {
  accounts: [],
};

TransactionFilters.propTypes = {
  model: PropTypes.instanceOf(TransactionFiltersModel).isRequired,
  onModelChange: PropTypes.func.isRequired,
  accounts: PropTypes.array,
};

export default TransactionFilters;

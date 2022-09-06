import { ErrorMessage, Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import cn from 'classnames';
import pick from 'lodash/pick';
import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, ButtonGroup, Col, Form, FormGroup, Input, Label,
} from 'reactstrap';
import * as Yup from 'yup';

import LoadingButton from 'src/components/LoadingButton';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';

const CategoryForm = ({
  isLoading, modelData, handleSubmit, toggleModal,
}) => {
  const [tags] = useState([]);
  const isEditMode = !!modelData;
  const initialData = isEditMode
    ? pick(modelData, ['id', 'type', 'name', 'icon', 'isAffectingProfit', 'isTechnical', 'isFixed', 'tags'])
    : {
      type: EXPENSE_TYPE,
      name: '',
      icon: '',
      isAffectingProfit: true,
      isTechnical: false,
      isFixed: false,
      tags: [],
    };
  const validationSchema = Yup.object({
    type: Yup.string().oneOf([EXPENSE_TYPE, INCOME_TYPE]).required('Required field'),
    name: Yup.string().required('Required field'),
    icon: Yup.string(),
    isAffectingProfit: Yup.bool().required('Required field'),
    isTechnical: Yup.bool().required('Required field'),
    isFixed: Yup.bool().required('Required field'),
    tags: Yup.array(),
  });

  // TODO: Fetch tags

  const onSubmit = async (values, { resetForm }) => {
    await handleSubmit(values);

    resetForm();

    if (toggleModal) {
      toggleModal();
    }
  };

  return (
    <Formik enableReinitialize initialValues={initialData} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({
        values, touched, errors, handleSubmit, setFieldValue, handleBlur,
      }) => {
        const {
          type, name, icon, isAffectingProfit, isTechnical, isFixed,
        } = values;

        return (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <ButtonGroup className="d-flex">
                {TRANSACTION_TYPES.map((t) => (
                  <Button
                    className="btn-simple flex-grow-1"
                    key={t}
                    disabled={isEditMode}
                    onClick={() => setFieldValue('type', t)}
                    active={type === t}
                  >
                    <span className="d-sm-block d-md-block d-lg-block d-xl-block text-capitalize">
                      {t}
                      {' '}
                    </span>
                  </Button>
                ))}
              </ButtonGroup>
            </FormGroup>

            <FormGroup row className="mb-md-0">
              <Col md={6}>
                <FormGroup>
                  <Label for="name">
                    Name*
                    {' '}
                    <i className={icon} aria-hidden />
                  </Label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="New category name"
                    as={Input}
                    invalid={touched.name && !!errors.name}
                    value={name}
                  />
                  <ErrorMessage component="div" name="name" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="icon">Icon*</Label>
                  <Field
                    id="icon"
                    name="icon"
                    type="text"
                    placeholder="Enter the icon"
                    as={Input}
                    invalid={touched.icon && !!errors.icon}
                    value={icon}
                  />
                  <ErrorMessage component="div" name="icon" className="invalid-feedback" />
                </FormGroup>
              </Col>
            </FormGroup>

            <FormGroup>
              <Typeahead
                allowNew
                multiple
                id="tags"
                className="form-control-typeahead"
                name="tags"
                inputProps={{ id: 'tags' }}
                placeholder="Tags"
                isInvalid={touched.tags && !!errors.tags}
                labelKey="name"
                selected={values.tags}
                onBlur={handleBlur}
                onChange={(s) => setFieldValue(
                  'tags',
                  s.map(({ name }) => ({ name })),
                )}
                options={tags}
              />
              <ErrorMessage component="div" name="tags" className="invalid-feedback" />
            </FormGroup>

            <FormGroup
              check
              className={cn({
                'has-danger': !!errors.isAffectingProfit,
              })}
            >
              <Label check>
                <Field
                  type="checkbox"
                  className="form-check-input"
                  name="isAffectingProfit"
                  as={Input}
                  checked={isAffectingProfit}
                  invalid={touched.isAffectingProfit && !!errors.isAffectingProfit}
                />
                <span className="form-check-sign" />
                {' '}
                Is affecting global profit
              </Label>
              <ErrorMessage component="div" name="isAffectingProfit" className="invalid-feedback" />
            </FormGroup>

            {type === EXPENSE_TYPE && (
              <FormGroup
                check
                className={cn({
                  'has-danger': !!errors.isFixed,
                })}
              >
                <Label check>
                  <Field
                    type="checkbox"
                    className="form-check-input"
                    name="isFixed"
                    as={Input}
                    checked={isFixed}
                    invalid={touched.isFixed && !!errors.isFixed}
                  />
                  <span className="form-check-sign" />
                  {' '}
                  Is it a fixed expense category?
                </Label>
                <ErrorMessage component="div" name="isFixed" className="invalid-feedback" />
              </FormGroup>
            )}

            <FormGroup
              check
              className={cn({
                'has-danger': !!errors.isTechnical,
              })}
            >
              <Label check>
                <Field
                  type="checkbox"
                  className="form-check-input"
                  name="isTechnical"
                  as={Input}
                  checked={isTechnical}
                  invalid={touched.isTechnical && !!errors.isTechnical}
                />
                <span className="form-check-sign" />
                {' '}
                Is technical
              </Label>
              <ErrorMessage component="div" name="isTechnical" className="invalid-feedback" />
            </FormGroup>

            <FormGroup check>
              <LoadingButton isLoading={isLoading} className="pull-right" />
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

CategoryForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  modelData: PropTypes.object,
  toggleModal: PropTypes.func,
};

export default CategoryForm;

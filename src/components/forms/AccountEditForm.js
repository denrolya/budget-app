import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Col, Form, FormGroup, Input, Label, Row,
} from 'reactstrap';

import { editAccount } from 'src/store/actions/account';
import accountType from 'src/types/account';

class AccountEditForm extends Component {
  handleFieldChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState((prevState) => ({
      model: {
        ...prevState.model,
        [name]: value,
      },
    }));
  };

  submitForm = (event) => {
    event.preventDefault();
    const { toggleModal, editAccount } = this.props;
    const { model } = this.state;

    editAccount(model.id, model).then(toggleModal);
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.account,
    };
  }

  render() {
    const {
      model: { name, balance },
    } = this.state;

    return (
      <Form className="form" onSubmit={this.submitForm}>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input autoFocus type="text" onChange={this.handleFieldChange} value={name} name="name" id="name" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="balance">Balance</Label>
              <Input
                type="number"
                step="any"
                onChange={this.handleFieldChange}
                value={balance}
                name="balance"
                id="balance"
              />
            </FormGroup>
          </Col>
        </Row>

        <FormGroup check row>
          <Col sm={12}>
            <Button className="pull-right" color="primary" type="submit">
              Edit
            </Button>
            <div className="clearfix" />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

AccountEditForm.propTypes = {
  account: accountType.isRequired,
  editAccount: PropTypes.func.isRequired,
  toggleModal: PropTypes.func,
};

export default connect(null, { editAccount })(AccountEditForm);

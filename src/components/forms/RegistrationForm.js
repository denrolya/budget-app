import React, { Component } from 'react';
import { Col } from 'reactstrap';

class RegistrationForm extends Component {
  render() {
    return (
      <Col
        md={{
          size: 7,
          offset: 5,
        }}
      >
        <div className="card-register card-white card">
          <div className="card-header">
            <img alt="..." src={require('../../img/login-card.png')} className="card-img" />
            <h4 className="card-title">Register</h4>
          </div>
          <div className="card-body">
            <form className="form">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-user-o" />
                  </span>
                </div>
                <input placeholder="Full Name" type="text" className="form-control" />
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-envelope-o" />
                  </span>
                </div>
                <input placeholder="Email" type="text" className="form-control" />
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-lock" />
                  </span>
                </div>
                <input placeholder="Password" type="text" className="form-control" />
              </div>
              <div className="text-left form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" />
                  <span className="form-check-sign" />I agree to the <a href="#pablo">terms and conditions</a>.
                </label>
              </div>
            </form>
          </div>
          <div className="card-footer">
            <a href="#pablo" className="btn-round btn btn-primary btn-lg">
              Get Started
            </a>
          </div>
        </div>
      </Col>
    );
  }
}

export default RegistrationForm;

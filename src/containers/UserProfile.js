import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import {
  Button, Card, CardBody, CardFooter, CardHeader, CardText, Col, Row,
} from 'reactstrap';

import { switchBaseCurrency } from 'src/store/actions/user';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';
import avatar from 'src/assets/img/emilyz.jpg';
import { switchCurrencyPrompt } from 'src/services/prompts';

const UserProfile = ({ availableCurrencies, switchBaseCurrency }) => {
  const { symbol, code } = useBaseCurrency();

  const onCurrencyChange = async (currency) => {
    const { isConfirmed } = await switchCurrencyPrompt(code, currency);

    if (!isConfirmed) {
      return;
    }

    switchBaseCurrency(currency);
  };

  return (
    <>
      <Helmet>
        <title>
          Profile | Budget
        </title>
      </Helmet>

      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody />
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit">
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#test">
                    <img alt="..." className="avatar" src={avatar} />
                    <h5 className="title">Mike Andrew</h5>
                  </a>
                  <p className="description">Ceo/Co-Founder</p>
                </div>
                <div className="card-description">
                  Do not be scared of the truth because we need to restart the human foundation in truth And I love you
                  like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
                </div>
              </CardBody>
              <CardFooter>
                <div className="button-container">
                  {availableCurrencies.map((c) => (
                    <Button
                      key={c.symbol}
                      active={c.symbol === symbol}
                      disabled={c.symbol === symbol}
                      onClick={() => onCurrencyChange(c)}
                      color="primary"
                      className="btn-icon btn-simple btn-round mr-2"
                    >
                      <span className="text-white">{c.symbol}</span>
                    </Button>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

UserProfile.defaultProps = {
  availableCurrencies: filter(CURRENCIES, ({ type }) => type === 'fiat'),
};

UserProfile.propTypes = {
  switchBaseCurrency: PropTypes.func.isRequired,
  availableCurrencies: PropTypes.array,
};

export default connect(null, {
  switchBaseCurrency,
})(UserProfile);

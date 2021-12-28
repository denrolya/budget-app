import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

const IntervalSwitch = ({ selected, from, to, onIntervalSwitch }) => (
  <ButtonGroup>
    <Button
      size="sm"
      color="info"
      className="btn-simple"
      onClick={() => selected !== '1 day' && onIntervalSwitch('1 day')}
      active={selected === '1 day'}
    >
      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Daily</span>
      <span className="d-block d-sm-none">D</span>
    </Button>
    <Button
      size="sm"
      color="info"
      className="btn-simple"
      onClick={() => selected !== '1 week' && onIntervalSwitch('1 week')}
      active={selected === '1 week'}
      disabled={to.diff(from, 'weeks', true) <= 1}
    >
      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Weekly</span>
      <span className="d-block d-sm-none">W</span>
    </Button>
    <Button
      size="sm"
      color="info"
      className="btn-simple"
      onClick={() => selected !== '1 month' && onIntervalSwitch('1 month')}
      active={selected === '1 month'}
      disabled={to.diff(from, 'months', true) <= 1}
    >
      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">Monthly</span>
      <span className="d-block d-sm-none">M</span>
    </Button>
  </ButtonGroup>
);

IntervalSwitch.propTypes = {
  selected: PropTypes.string.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  onIntervalSwitch: PropTypes.func.isRequired,
};

export default IntervalSwitch;

import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  CardBody, Col, Row, Table,
} from 'reactstrap';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { revenueExpenseRatioColor } from 'src/services/common';
import PreviousMonthStatisticsCell from 'src/components/tables/PreviousMonthStatisticsCell';
import LoadingCard from 'src/components/cards/LoadingCard';

const MonthExpenseCard = ({ monthExpenseStats, isLoading }) => {
  const { symbol } = useBaseCurrency();
  const [mode, setMode] = useState('actual');
  const selectedStats = monthExpenseStats[mode === 'projected' ? 0 : 'actual'];
  const selectedRatio = monthExpenseStats[
    mode === 'projected' ? 'percentageFromRevenueProjected' : 'percentageFromRevenue'
  ].toFixed();
  const ratioColor = revenueExpenseRatioColor(selectedRatio);

  return (
    <LoadingCard
      isLoading={isLoading}
      className={cn('card-stats', { 'cursor-info': !isLoading })}
      onMouseEnter={() => !isLoading && setMode('projected')}
      onMouseLeave={() => !isLoading && setMode('actual')}
    >
      <CardBody>
        <Row>
          <Col>
            <h5 className="text-muted mb-0 card-category text-capitalized">
              {`${mode} expenses: ${moment().startOf('month').format('MMMM')}`}
              <span className={cn('pull-right', 'd-xs-inline', 'd-sm-none', `text-${ratioColor}`)}>
                {selectedRatio}
                %
              </span>
            </h5>
            <sup className="text-white">
              {symbol}
              {' '}
            </sup>
            <span className="h2 text-white">
              {selectedStats}
              {' '}
            </span>

            <Table borderless size="sm" className="mt-3 mb-0">
              <tbody>
                <tr>
                  <PreviousMonthStatisticsCell
                    previousMonthValue={monthExpenseStats[1]}
                    currentMonthValue={selectedStats}
                    numberOfMonthAgo={1}
                  />
                </tr>
                <tr>
                  <PreviousMonthStatisticsCell
                    previousMonthValue={monthExpenseStats[2]}
                    currentMonthValue={selectedStats}
                    numberOfMonthAgo={2}
                  />
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col className="col-auto d-none d-sm-block">
            <div className={cn('info-icon', 'text-center', `icon-${ratioColor}`)}>
              <div>
                {selectedRatio}
                <sup>%</sup>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </LoadingCard>
  );
};

MonthExpenseCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  monthExpenseStats: PropTypes.shape({
    0: PropTypes.number.isRequired,
    1: PropTypes.number.isRequired,
    2: PropTypes.number.isRequired,
  }).isRequired,
};

export default MonthExpenseCard;

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import CategoriesList from 'src/components/CategoriesList';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';
import TransactionCategories from 'src/components/charts/recharts/pie/TransactionCategories';
import Breadcrumbs from 'src/components/CategoriesBreadcrumbs';
import { rangeToString } from 'src/utils/datetime';

const CategoryTreeCard = ({
  isLoading,
  model,
  onUpdate,
}) => {
  const { from, to, data } = model;
  const [selectedCategory, selectCategory] = useState(data.model.name);

  return (
    <TimeperiodStatisticsCard
      className="card-category-tree"
      isLoading={isLoading}
      header={(
        <>
          <Breadcrumbs
            className="mb-2"
            selectedCategory={selectedCategory}
            selectCategory={selectCategory}
            tree={data}
          />

          <p className="text-right">
            <DateRangePicker
              autoApply
              showCustomRangeLabel
              alwaysShowCalendars={false}
              locale={{ format: MOMENT_DATE_FORMAT }}
              startDate={from}
              endDate={to}
              ranges={DATERANGE_PICKER_RANGES}
              onApply={(_event, { startDate, endDate }) => onUpdate(
                model.merge({
                  from: startDate,
                  to: endDate,
                }),
              )}
            >
              <span className="cursor-pointer text-nowrap">
                <i aria-hidden className="ion-ios-calendar" />
                {'  '}
                {rangeToString(from, to)}
              </span>
            </DateRangePicker>
          </p>
        </>
      )}
    >
      {!data.hasChildren() && (
        <CenteredMessage
          className="mb-4"
          title="No statistics available for selected period."
          message="Try to select another date range in upper right corner of this card."
        />
      )}

      <div className="mb-3">
        <TransactionCategories data={data} selectedCategory={selectedCategory} onClick={selectCategory} />
      </div>

      <CategoriesList
        data={data}
        onCategorySelect={selectCategory}
        selectedCategory={selectedCategory}
        from={from}
        to={to}
      />
    </TimeperiodStatisticsCard>
  );
};

CategoryTreeCard.defaultProps = {
  isLoading: false,
};

CategoryTreeCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CategoryTreeCard;

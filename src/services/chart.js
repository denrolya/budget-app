import moment from 'moment-timezone';

import { COLORS } from 'src/constants/charts';
import { MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';

export const extractRGBfromRGBA = (rgbaString) => {
  const [r, g, b] = rgbaString
    .substring(5, rgbaString.length - 1)
    .replace(/ /g, '')
    .split(',');
  return { r, g, b };
};

export const generateRGBA = (color = 'info', opacity = 1) =>
  `rgba(${COLORS[color] ? COLORS[color] : color}, ${opacity})`;

export const generateGradient = (canvas, color = 'info') => {
  const gradientStroke = canvas.getContext('2d').createLinearGradient(0, 230, 0, 50);

  gradientStroke.addColorStop(1, generateRGBA(color, 0.2));
  gradientStroke.addColorStop(0.4, generateRGBA(color, 0));
  gradientStroke.addColorStop(0, generateRGBA(color, 0));

  return gradientStroke;
};

export const convertDateLabelsToHumanReadableByInterval = (labels, interval) => {
  let newLabels = [];
  switch (interval) {
    case 'day':
      newLabels = labels.map((el) =>
        moment(el, MOMENT_DEFAULT_DATE_FORMAT).isSame(moment(), 'day') ? 'Today' : moment(el).format('ddd'),
      );
      break;
    case 'week':
      newLabels = labels.map((el) => (moment(el).isSame(moment(), 'isoWeek') ? 'Current' : moment(el).isoWeek()));
      break;
    case 'month':
      newLabels = labels.map((el) => moment(el).format('MMM'));
      break;
    // no default
  }

  return newLabels;
};

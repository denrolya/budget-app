import React from 'react';
import { render } from '@testing-library/react';
import AddNewButton from './AddNewButton';

test('renders correctly', () => {
  const { asFragment } = render(<AddNewButton />);
  expect(asFragment()).toMatchSnapshot();
});

import { describe, it, expect } from 'vitest';
import { render, screen } from './utils';
import { ReactElement } from 'react';
import '@testing-library/jest-dom';

describe('Example Test', () => {
  it('renders without crashing', () => {
    const TestComponent = (): ReactElement => <div>Test</div>;
    render(<TestComponent />);
    const element = screen.getByText('Test');
    expect(element).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const TestComponent = (): ReactElement => <div>Test Snapshot</div>;
    const { container } = render(<TestComponent />);
    expect(container).toMatchSnapshot();
  });
});

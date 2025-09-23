import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '.';

describe('Header component', () => {
  it('renders the dashboard heading', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { name: /dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the bell icon', () => {
    const { container } = render(<Header />);

    const bellIcon = container.querySelector('svg.lucide-bell');
    expect(bellIcon).toBeInTheDocument();

   
    const notificationDot = container.querySelector('div.bg-yellow-500.rounded-full');
    expect(notificationDot).toBeInTheDocument();
  });

  it('renders the user icon container with svg', () => {
    const { container } = render(<Header />);
    const userContainer = container.querySelector('div.bg-green-800.rounded-full.flex');
    expect(userContainer).toBeInTheDocument();

    const userIcon = container.querySelector('svg.lucide-user');
    expect(userIcon).toBeInTheDocument();
  });
});

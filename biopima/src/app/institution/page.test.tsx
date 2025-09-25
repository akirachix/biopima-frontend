import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './page';
import useFetchMcu from '../hooks/useFetchMcu';
import useFetchUsers from '../hooks/useFetchUsers';
import useFetchSensorReadings from '../hooks/useFetchSensorReadings';
import type { ReactNode } from 'react';

jest.mock('../hooks/useFetchMcu');
const mockUseFetchMcu = useFetchMcu as jest.Mock;

jest.mock('../hooks/useFetchUsers');
const mockUseFetchUsers = useFetchUsers as jest.Mock;

jest.mock('../hooks/useFetchSensorReadings');
const mockUseFetchSensorReadings = useFetchSensorReadings as jest.Mock;


jest.mock('../shared-components/Sidebar/ConsultantLayout', () => {
  return function MockConsultantLayout({ children }: { children: ReactNode }) {
    return <div data-testid="consultant-layout">{children}</div>;
  };
});

jest.mock('../components/Pagination', () => {
  return function MockPagination({ totalPages, currentPage, onPageChange }: { totalPages: number, currentPage: number, onPageChange: (page: number) => void }) {
    return (
      <div data-testid="mock-pagination">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span data-testid="current-page-info">{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    );
  };
});


const mockMcu = [
  { id: 1, user: 1, status: 'active' },
  { id: 2, user: 2, status: 'inactive' },
  { id: 3, user: 3, status: 'active' },
  { id: 6, user: 6, status: 'inactive' },
  { id: 7, user: 7, status: 'active' },
  { id: 8, user: 8, status: 'inactive' },
];

const mockUsers = [
  { id: 1, name: 'Client A', user_type: 'Institutional operator' },
  { id: 2, name: 'Client B', user_type: 'Institutional operator' },
  { id: 3, name: 'Client C', user_type: 'Institutional operator' },
  { id: 4, name: 'Client D', user_type: 'Institutional operator' }, 
  { id: 5, name: 'Client E', user_type: 'Consultant' },
  { id: 6, name: 'Client F', user_type: 'Institutional operator' },
  { id: 7, name: 'Client G', user_type: 'Institutional operator' },
  { id: 8, name: 'Client H', user_type: 'Institutional operator' },
  { id: 9, name: 'Client I', user_type: 'Institutional operator' }, 
  { id: 10, name: 'Client J', user_type: 'Institutional operator' }, 
];

const mockSensorReadings = [
  { id: 1, methane_level: '1.5', temperature_level: '36.0', pressure_level: '10.0' }, 
  { id: 2, methane_level: '3.0', temperature_level: '34.0', pressure_level: '12.0' }, 
  { id: 3, methane_level: '0.8', temperature_level: '38.0', pressure_level: '7.0' },  
  { id: 4, methane_level: '2.5', temperature_level: '37.0', pressure_level: '15.5' }, 
];

describe('Dashboard', () => {
  beforeEach(() => {
    mockUseFetchMcu.mockReturnValue({ mcu: mockMcu });
    mockUseFetchUsers.mockReturnValue({ user: mockUsers });
    mockUseFetchSensorReadings.mockReturnValue({ sensorReadings: mockSensorReadings });
  });

  test('renders the main dashboard layout and summary cards correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Client Portfolio Overview')).toBeInTheDocument();
    });

    const totalClientsCard = screen.getByText('Total Clients').parentElement;
    if (totalClientsCard) {
      expect(within(totalClientsCard).getByText('9')).toBeInTheDocument();
    }

    const criticalAlertsCard = screen.getByText('Critical Alerts').parentElement;
    if (criticalAlertsCard) {
      expect(within(criticalAlertsCard).getByText('2')).toBeInTheDocument();
    }

    const tempWarningsCard = screen.getByText('Temp Warnings').parentElement;
    if (tempWarningsCard) {
      expect(within(tempWarningsCard).getByText('2')).toBeInTheDocument();
    }

    const pressureWarningsCard = screen.getByText('Pressure Warnings').parentElement;
    if (pressureWarningsCard) {
      expect(within(pressureWarningsCard).getByText('2')).toBeInTheDocument();
    }
  });

  test('displays first page of institutional clients on initial load', async () => {
    render(<Dashboard />);

    await waitFor(() => expect(screen.getByText('Client A')).toBeInTheDocument());

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');

    expect(within(table).getByText('Client A')).toBeInTheDocument();
    expect(within(table).getByText('Client I')).toBeInTheDocument();

    expect(within(table).queryByText('Client J')).not.toBeInTheDocument();
  });

  test('pagination navigates to the next page correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Client A')).toBeInTheDocument();
      expect(screen.queryByText('Client J')).not.toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

   
    await waitFor(() => {
      
      expect(screen.queryByText('Client A')).not.toBeInTheDocument();
     
      expect(screen.getByText('Client J')).toBeInTheDocument();
    });
  });
  
  test('filters clients by search input', async () => {
    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText('Search client...');
    fireEvent.change(searchInput, { target: { value: 'Client A' } });

    await waitFor(() => {
      const table = screen.getByRole('table');
      const tableRows = within(table).getAllByRole('row');
      expect(tableRows).toHaveLength(2); 
      expect(within(table).getByText('Client A')).toBeInTheDocument();
      expect(within(table).queryByText('Client B')).not.toBeInTheDocument();
    });
  });

  test('filters clients by status', async () => {
    render(<Dashboard />);
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'inactive' } });

    await waitFor(() => {
      const table = screen.getByRole('table');
      const tableRows = within(table).getAllByRole('row');
     
      expect(tableRows).toHaveLength(4);
      expect(within(table).getByText('Client B')).toBeInTheDocument();
      expect(within(table).getByText('Client F')).toBeInTheDocument();
      expect(within(table).getByText('Client H')).toBeInTheDocument();
      expect(within(table).queryByText('Client A')).not.toBeInTheDocument();
    });
  });

  test('filters clients by Null status', async () => {
    render(<Dashboard />);
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'Null' } });

    await waitFor(() => {
      const table = screen.getByRole('table');
      const tableRows = within(table).getAllByRole('row');
      
      expect(tableRows).toHaveLength(4);
      expect(within(table).getByText('Client D')).toBeInTheDocument();
      expect(within(table).getByText('Client I')).toBeInTheDocument();
      expect(within(table).getByText('Client J')).toBeInTheDocument();
      expect(within(table).queryByText('Client A')).not.toBeInTheDocument();
    });
  });

  test('filters clients by both search and status', async () => {
    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText('Search client...');
    const statusSelect = screen.getByRole('combobox');

    fireEvent.change(statusSelect, { target: { value: 'active' } });
    fireEvent.change(searchInput, { target: { value: 'Client A' } });

    await waitFor(() => {
      const table = screen.getByRole('table');
      const tableRows = within(table).getAllByRole('row');
      
      expect(tableRows).toHaveLength(2);
      expect(within(table).getByText('Client A')).toBeInTheDocument();
      expect(within(table).queryByText('Client C')).not.toBeInTheDocument();
    });
  });
});
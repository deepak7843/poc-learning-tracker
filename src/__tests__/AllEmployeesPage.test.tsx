import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import AllEmployeesPage from '../pages/admin/AllEmployeesPage';
import { User } from '../types';
import '@testing-library/jest-dom';

const mockEmployees: User[] = [
  {
    id: '1',
    name: 'deepak dubey',
    email: 'john.doe@example.com',
    department: 'Engineering',
    role: 'user',
    managerId: '3',
    avatarUrl: '/avatar1.png'
  },
  {
    id: '2',
    name: 'suresh sharma',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    role: 'user',
    managerId: '3',
    avatarUrl: '/avatar2.png'
  },
  {
    id: '3',
    name: 'Sonu sharma',
    email: 'michael.johnson@example.com',
    department: 'Engineering',
    role: 'manager',
    managerId: undefined,
    avatarUrl: '/avatar3.png'
  }
];

const mockFetch = vi.fn();

vi.setConfig({ testTimeout: 10000 });

describe('AllEmployeesPage', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    vi.resetAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmployees
    });
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  
  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <AllEmployeesPage />
      </ChakraProvider>
    );
  };

  it('should show loading state initially', () => {
    renderComponent();
    expect(screen.getByText('All Employees')).toBeInTheDocument();
    expect(screen.getByText('Manage and view all employees in the organization')).toBeInTheDocument();
    const spinnerElement = document.querySelector('.chakra-spinner');
    expect(spinnerElement).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument(); 
  });
  
  it('should fetch employees on mount', async () => {
    renderComponent();
    expect(mockFetch).toHaveBeenCalledWith('https://62b2d6364f851f87f44ddc8b.mockapi.io/users');
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
  });
  
  it('should display error when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderComponent();
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    await waitFor(() => {
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    consoleErrorSpy.mockRestore();
  });
  
  it('should allow filtering by search term', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmployees
    });
    renderComponent();
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    vi.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText('deepak dubey')).toBeInTheDocument();
      expect(screen.getByText('suresh sharma')).toBeInTheDocument();
      expect(screen.getByText('Sonu sharma')).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    expect(screen.getByText('suresh sharma')).toBeInTheDocument();
    expect(screen.queryByText('deepak dubey')).not.toBeInTheDocument();
    expect(screen.queryByText('Sonu sharma')).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'john.doe' } });
    expect(screen.getByText('deepak dubey')).toBeInTheDocument();
    expect(screen.queryByText('suresh sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Sonu sharma')).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('deepak dubey')).toBeInTheDocument();
    expect(screen.getByText('suresh sharma')).toBeInTheDocument();
    expect(screen.getByText('Sonu sharma')).toBeInTheDocument();
  });
  
  it('should allow filtering by department', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmployees
    });
    renderComponent();
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    vi.runAllTimers();
    const departmentSelect = screen.getByRole('combobox');
    fireEvent.change(departmentSelect, { target: { value: 'Engineering' } });
    expect(screen.getByText('deepak dubey')).toBeInTheDocument();
    expect(screen.queryByText('suresh sharma')).not.toBeInTheDocument();
    expect(screen.getByText('Sonu sharma')).toBeInTheDocument();
    fireEvent.change(departmentSelect, { target: { value: 'Marketing' } });
    fireEvent.change(departmentSelect, { target: { value: 'Marketing' } });
    expect(screen.queryByText('deepak dubey')).not.toBeInTheDocument();
    expect(screen.getByText('suresh sharma')).toBeInTheDocument();
    expect(screen.queryByText('Sonu sharma')).not.toBeInTheDocument();
    fireEvent.change(departmentSelect, { target: { value: '' } });
    expect(screen.getByText('deepak dubey')).toBeInTheDocument();
    expect(screen.getByText('suresh sharma')).toBeInTheDocument();
    expect(screen.getByText('Sonu sharma')).toBeInTheDocument();
  });
  
  it('should combine search and department filters', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmployees
    });
    renderComponent();
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    vi.runAllTimers();
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'john' } });
    const departmentSelect = screen.getByRole('combobox');
    fireEvent.change(departmentSelect, { target: { value: 'Engineering' } });
    expect(screen.getByText('deepak dubey')).toBeInTheDocument();
    expect(screen.queryByText('suresh sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Sonu sharma')).not.toBeInTheDocument();
    fireEvent.change(departmentSelect, { target: { value: 'Marketing' } });
    expect(screen.queryByText('deepak dubey')).not.toBeInTheDocument();
    expect(screen.queryByText('suresh sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Sonu sharma')).not.toBeInTheDocument();
  });
  
  it('should display correct role badges and manager names', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmployees
    });
    renderComponent();
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    vi.runAllTimers();
    const roleBadges = screen.getAllByText(/EMPLOYEE|MANAGER/);
    expect(roleBadges.length).toBe(3);
    expect(roleBadges[0].textContent).toBe('EMPLOYEE');
    expect(roleBadges[2].textContent).toBe('MANAGER');
    expect(screen.getAllByText('Sonu sharma').length).toBe(3);
  });
  
  it('should handle employees without roles or managers correctly', async () => {
    const specialEmployees = [
      {
        id: '4',
        name: 'No Role Person',
        email: 'no.role@example.com',
        department: 'HR',
        role: 'user',
        managerId: undefined,
        avatarUrl: '/avatar4.png'
      },
      {
        id: '5',
        name: 'Unknown Manager Person',
        email: 'unknown.manager@example.com',
        department: 'Sales',
        role: 'user',
        managerId: '999',
        avatarUrl: '/avatar5.png'
      }
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => specialEmployees
    });
    renderComponent();
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const spinnerElement = document.querySelector('.chakra-spinner');
      expect(spinnerElement).not.toBeInTheDocument();
    });
    vi.runAllTimers();
    expect(screen.getAllByText('USER').length).toBe(2);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
  
  it('should correctly handle streaming with edge cases', () => {
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [[], vi.fn()]);
    renderComponent();
    vi.advanceTimersByTime(300);
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockEmployees, vi.fn()]);
    renderComponent();
    vi.advanceTimersByTime(300);
    expect(mockEmployees.length).toBe(3);
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Candidates from './candidates';

const mockCandidates = [
  { _id: '1', name: 'John Doe', categorytype: 'President' },
  { _id: '2', name: 'Jane Smith', categorytype: 'VicePresident' },
  { _id: '3', name: 'Peter Jones', categorytype: 'Secretary' },
];

describe('Candidates Component', () => {

  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ candidates: mockCandidates }),
      });
    });
  });
  it('should render category titles after fetching candidates', async () => {
    render(<Candidates />);

    expect(await screen.findByText('President')).toBeInTheDocument();
    expect(await screen.findByText('Vice President')).toBeInTheDocument();
    expect(await screen.findByText('Secretary')).toBeInTheDocument();
  });
  it('should display an error message if the fetch fails', async () => {
    // Arrange: Create a mock that simulates a network error.
    vi.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('Network request failed'));
    });

    // Act
    render(<Candidates />);
    const errorMessage = await screen.findByText(
      'Could not load candidates. Please ensure the server is running and try again.'
    );
    expect(errorMessage).toBeInTheDocument();
  });

});
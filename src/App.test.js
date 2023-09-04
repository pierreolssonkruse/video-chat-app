import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  const navigateMock = jest.fn();
  return {
    ...originalModule,
    useNavigate: () => navigateMock,
    _navigateMock: navigateMock
  };
});

const { _navigateMock: navigateMock } = require('react-router-dom');

describe('App Tests', () => {

  beforeEach(() => {
    navigateMock.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('clicking "Start Video Chat" with no Room ID shows an alert', async () => {
    const alertMock = jest.fn();
    global.alert = alertMock;
    render(<App />);

    fireEvent.click(screen.getByText('Start Video Chat'));

    expect(alertMock).toHaveBeenCalledWith('Please enter a Room ID');
  });

  test('entering room ID and clicking Start Video Chat navigates to meeting room', async () => {
    render(<App />);
    console.log(navigateMock.mock.calls);

    fireEvent.change(screen.getByPlaceholderText(/Enter Room ID/i), { target: { value: '12345' } });
    await waitFor(() => expect(screen.getByPlaceholderText(/Enter Room ID/i).value).toBe('12345'));
    fireEvent.click(screen.getByText(/Start Video Chat/i));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/meeting/12345'));
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import './setupTests';

test('clicking "Start Video Chat" changes the state', async () => {
  //const component = render(<App />);
  render(<App />);

  global.navigator.mediaDevices = {
    getUserMedia: jest.fn(() => Promise.resolve({}))
  };

  fireEvent.click(screen.getByText('Start Video Chat'));

  await waitFor(() => expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalled());

  // eslint-disable-next-line testing-library/no-node-access
  //const videos = screen.container.querySelectorAll('video');
  //const videos = container.querySelectorAll('video');
  const videos = screen.getAllByRole('presentation');
  expect(videos.length).toBe(2);
});

import '@testing-library/jest-dom';

global.setImmediate = global.setImmediate || function(callback) {
  global.setTimeout(callback, 0);
};

global.navigator.mediaDevices = {
    getUserMedia: jest.fn(() => Promise.resolve({})),
  };
  
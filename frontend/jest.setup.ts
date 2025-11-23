import "@testing-library/jest-dom";

// mock BroadcastChannel globally for tests
class MockBroadcastChannel {
  constructor() {}
  postMessage() {}
  close() {}
}

(global as any).BroadcastChannel = MockBroadcastChannel;

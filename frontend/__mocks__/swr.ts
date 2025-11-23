const swr = () => ({
  data: [{ id: 1, name: "Test Event", date: "2024-12-12", registration_count: 5 }],
  mutate: jest.fn(),
  isLoading: false,
  error: null,
});

export default swr;

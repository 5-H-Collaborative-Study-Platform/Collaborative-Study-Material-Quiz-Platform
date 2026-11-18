import { render, screen, waitFor } from "@testing-library/react";
import RatingWidget from "./RatingWidget.jsx";

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ count: 2, average: 4.5, feedback: [] }),
    }),
  );
});

afterEach(() => vi.restoreAllMocks());

test("shows the average rating from the API", async () => {
  render(<RatingWidget targetId="1" />);
  await waitFor(() =>
    expect(screen.getByText(/Average rating: 4\.5/)).toBeInTheDocument(),
  );
});
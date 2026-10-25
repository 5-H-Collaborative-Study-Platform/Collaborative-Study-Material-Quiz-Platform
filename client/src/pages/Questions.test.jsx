
import { render, screen, waitFor } from "@testing-library/react";
import Questions from "./Questions.jsx";

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: "1", text: "2+2?", topic: "Addition", difficulty: "easy" },
        ]),
    }),
  );
});

afterEach(() => vi.restoreAllMocks());

test("renders questions from the API", async () => {
  render(<Questions />);
  await waitFor(() => {
    expect(screen.getByText(/2\+2\?/)).toBeInTheDocument();
  });
});

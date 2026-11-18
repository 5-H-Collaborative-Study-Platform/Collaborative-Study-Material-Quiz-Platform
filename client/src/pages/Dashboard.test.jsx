import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, afterEach, test, expect } from "vitest";
import Dashboard from "./Dashboard.jsx";

beforeEach(() => {
  globalThis.fetch = vi.fn((url) => {
    if (url.includes("over-time")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ score: 50 }, { score: 80 }]),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ attempts: 2, averageScore: 65 }),
    });
  });
});

afterEach(() => vi.restoreAllMocks());

test("shows the performance summary", async () => {
  render(<Dashboard />);
  await waitFor(() =>
    expect(screen.getByText(/Attempts: 2/)).toBeInTheDocument(),
  );
});
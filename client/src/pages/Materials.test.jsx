import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, test, expect, vi } from "vitest";
import Materials from "./Materials.jsx";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("renders materials from the API with a download link", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve([
        { _id: "1", title: "Algebra Notes", subject: "Math", topic: "Algebra" },
      ]),
  });

  render(<Materials />);

  expect(await screen.findByText(/Algebra Notes/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /download/i })).toHaveAttribute(
    "href",
    "/api/materials/1/download",
  );
});

test("searching re-fetches with the query", async () => {
  fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

  render(<Materials />);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  fireEvent.change(screen.getByPlaceholderText("Search materials"), {
    target: { value: "algebra" },
  });
  fireEvent.click(screen.getByText("Search"));

  await waitFor(() =>
    expect(fetch).toHaveBeenLastCalledWith("/api/materials?q=algebra"),
  );
});

test("shows an empty state when there are no materials", async () => {
  fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
  render(<Materials />);
  expect(await screen.findByText(/No materials found/)).toBeInTheDocument();
});

import { render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, afterEach, test, expect } from "vitest";
import AttemptQuiz from "./AttemptQuiz.jsx";

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "1",
          title: "Quiz 1",
          questions: [],
        }),
    })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("shows the quiz title and a countdown timer", async () => {
  render(<AttemptQuiz quizId="1" />);

  await waitFor(() => {
    expect(screen.getByText("Quiz 1")).toBeInTheDocument();
  });

  expect(screen.getByRole("timer")).toBeInTheDocument();
});
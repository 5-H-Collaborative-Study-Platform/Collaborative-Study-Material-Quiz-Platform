import { render, screen } from "@testing-library/react";
import QuizResult from "./QuizResult";

test("shows the score and a pass message", () => {
  render(<QuizResult score={80} />);
  expect(screen.getByText(/You scored 80%/)).toBeInTheDocument();
  expect(screen.getByText(/Passed/)).toBeInTheDocument();
});
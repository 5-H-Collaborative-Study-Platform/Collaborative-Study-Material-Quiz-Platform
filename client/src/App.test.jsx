import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

// Smoke test for the client test harness: proves Vitest + jsdom + React
// Testing Library + jest-dom matchers are all wired correctly.
describe("App", () => {
  test("renders the platform heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /study & quiz platform/i }),
    ).toBeInTheDocument();
  });
});

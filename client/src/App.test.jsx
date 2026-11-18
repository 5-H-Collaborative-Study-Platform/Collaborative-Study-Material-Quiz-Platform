import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  test("renders the platform heading", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /study & quiz platform/i }),
    ).toBeInTheDocument();
  });
});

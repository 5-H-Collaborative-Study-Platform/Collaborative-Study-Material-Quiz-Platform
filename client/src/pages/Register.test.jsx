import { render, screen } from "@testing-library/react";
import Register from "./Register.jsx";

test("register form shows all fields", () => {
  render(<Register />);
  expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByText("Create account")).toBeInTheDocument();
});
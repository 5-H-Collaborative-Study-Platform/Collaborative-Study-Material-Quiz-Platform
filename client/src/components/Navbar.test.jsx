import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

test("renders navigation links", () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Register")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
});
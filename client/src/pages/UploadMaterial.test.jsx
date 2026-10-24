import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, afterEach, test, expect } from "vitest";
import UploadMaterial from "./UploadMaterial.jsx";

afterEach(() => {
  vi.restoreAllMocks();
});

test("upload form shows all fields", () => {
  render(<UploadMaterial />);
  expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Topic")).toBeInTheDocument();
  expect(screen.getByLabelText("file")).toBeInTheDocument();
  expect(screen.getByText("Upload material")).toBeInTheDocument();
});

test("shows an error when no file is chosen", () => {
  render(<UploadMaterial />);
  fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Notes" } });
  fireEvent.change(screen.getByPlaceholderText("Subject"), { target: { value: "Math" } });
  fireEvent.change(screen.getByPlaceholderText("Topic"), { target: { value: "Algebra" } });
  fireEvent.click(screen.getByText("Upload material"));
  expect(screen.getByRole("alert")).toHaveTextContent(/file/i);
});

test("uploads successfully and shows a success message", async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );

  render(<UploadMaterial />);
  fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Notes" } });
  fireEvent.change(screen.getByPlaceholderText("Subject"), { target: { value: "Math" } });
  fireEvent.change(screen.getByPlaceholderText("Topic"), { target: { value: "Algebra" } });

  const file = new File(["%PDF-1.4"], "n.pdf", { type: "application/pdf" });
  fireEvent.change(screen.getByLabelText("file"), { target: { files: [file] } });

  fireEvent.click(screen.getByText("Upload material"));

  await waitFor(() => {
    expect(screen.getByRole("status")).toHaveTextContent(/uploaded/i);
  });
  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/materials",
    expect.objectContaining({ method: "POST" })
  );
});

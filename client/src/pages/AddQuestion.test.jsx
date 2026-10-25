import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import AddQuestion from "./AddQuestion.jsx";

const mockStorage = {
  token: null,
  getItem(key) {
    return key === "token" ? this.token : null;
  },
  setItem(key, value) {
    if (key === "token") this.token = String(value);
  },
  removeItem(key) {
    if (key === "token") this.token = null;
  },
  clear() {
    this.token = null;
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
  mockStorage.clear();
  vi.stubGlobal("localStorage", mockStorage);
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AddQuestion", () => {
  it("renders the add-question form", () => {
    render(<AddQuestion />);

    expect(
      screen.getByRole("heading", { name: /add a question/i }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Question")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option A")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option B")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correct answer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Topic")).toBeInTheDocument();
  });

  it("shows an error when required fields are missing", () => {
    render(<AddQuestion />);

    fireEvent.click(
      screen.getByRole("button", { name: /add question/i }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits a valid question with the bearer token", async () => {
    mockStorage.setItem("token", "test-token");

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Question added" }),
    });

    render(<AddQuestion />);

    fireEvent.change(screen.getByPlaceholderText("Question"), {
      target: { value: "What is 2 + 2?", name: "text" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option A"), {
      target: { value: "4", name: "optionA" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option B"), {
      target: { value: "5", name: "optionB" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correct answer"), {
      target: { value: "4", name: "correctAnswer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Maths", name: "subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Topic"), {
      target: { value: "Arithmetic", name: "topic" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /add question/i }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledOnce();
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/questions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      }),
    );

    const request = JSON.parse(fetch.mock.calls[0][1].body);

    expect(request).toMatchObject({
      text: "What is 2 + 2?",
      options: ["4", "5"],
      correctAnswer: "4",
      subject: "Maths",
      topic: "Arithmetic",
      difficulty: "medium",
    });

    expect(await screen.findByRole("status")).toHaveTextContent(
      /question added/i,
    );
  });

  it("shows the server error when submission fails", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Unauthorized" }),
    });

    render(<AddQuestion />);

    fireEvent.change(screen.getByPlaceholderText("Question"), {
      target: { value: "Question?", name: "text" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option A"), {
      target: { value: "A", name: "optionA" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option B"), {
      target: { value: "B", name: "optionB" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correct answer"), {
      target: { value: "A", name: "correctAnswer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Maths", name: "subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Topic"), {
      target: { value: "Algebra", name: "topic" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /add question/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /unauthorized/i,
    );
  });
});

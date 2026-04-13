import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";

let isAuthMock;
let loginMock;
let navigateMock;
let locationState;

// 🔹 Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({ state: locationState }),
  Navigate: ({ to }) => <div>Redirected to {to}</div>,
}));

// 🔹 Mock auth
vi.mock("../auth/auth", () => ({
  isAuthenticated: () => isAuthMock,
  login: (...args) => loginMock(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();

  isAuthMock = false;
  loginMock = vi.fn();
  navigateMock = vi.fn();
  locationState = {};
});

describe("LoginPage", () => {
  it("redirects if already authenticated", () => {
    isAuthMock = true;

    render(<LoginPage />);

    expect(screen.getByText(/redirected to/i)).toBeInTheDocument();
  });

  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("logs in successfully and navigates", async () => {
    loginMock.mockResolvedValue({});

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/username/i), "test@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "123456");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(loginMock).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "123456",
    });

    expect(navigateMock).toHaveBeenCalled();
  });

  it("shows invalid login error", async () => {
    loginMock.mockRejectedValue({ status: 401 });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/username/i), "wrong@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid login/i)).toBeInTheDocument();
  });

  it("shows generic error message", async () => {
    loginMock.mockRejectedValue({ message: "Server down" });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/username/i), "test@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "123456");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/server down/i)).toBeInTheDocument();
  });

  it("navigates to 'from' path after login", async () => {
    locationState = { from: "/dashboard" };
    loginMock.mockResolvedValue({});

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/username/i), "test@test.com");
    await userEvent.type(screen.getByLabelText(/password/i), "123456");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
  });
});
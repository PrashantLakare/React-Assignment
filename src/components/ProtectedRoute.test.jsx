import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

// 🔹 Mocks
let isAuthMock;
let locationMock;

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useLocation: () => locationMock,
  Navigate: ({ to, state }) => (
    <div>
      Redirected to {to} with state {JSON.stringify(state)}
    </div>
  ),
}));

// Mock auth
vi.mock("../auth/auth", () => ({
  isAuthenticated: () => isAuthMock,
}));

beforeEach(() => {
  vi.clearAllMocks();

  isAuthMock = false;

  locationMock = {
    pathname: "/dashboard",
    search: "?page=1",
    hash: "#section",
  };
});

describe("ProtectedRoute", () => {
  it("redirects to login if not authenticated", () => {
    isAuthMock = false;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/redirected to \/login/i)).toBeInTheDocument();

    // Check state includes full path
    expect(screen.getByText(/dashboard\?page=1#section/i)).toBeInTheDocument();
  });

  it("renders children if authenticated", () => {
    isAuthMock = true;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("passes correct 'from' path in state", () => {
    isAuthMock = false;

    locationMock = {
      pathname: "/profile",
      search: "?tab=info",
      hash: "#top",
    };

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(
      screen.getByText(/profile\?tab=info#top/i)
    ).toBeInTheDocument();
  });
});
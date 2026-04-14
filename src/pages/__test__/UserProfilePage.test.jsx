import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfilePage from "../UserProfilePage.jsx";

// 🔹 Mocks
let selectorState;
let paramsMock;
let authFetchMock;

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => paramsMock,
  Link: ({ children }) => <a>{children}</a>,
}));

// Mock redux
vi.mock("react-redux", () => ({
  useSelector: (selector) => selector(selectorState),
}));

// Mock API
vi.mock("../../auth/api", () => ({
  authFetch: (...args) => authFetchMock(...args),
}));

// Mock Loader
vi.mock("../../components/Loader", () => ({
  default: () => <div>LOADER</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();

  paramsMock = { id: "1" };

  selectorState = {
    users: {
      items: [],
    },
  };

  authFetchMock = vi.fn();
});

describe("UserProfilePage", () => {
  // ✅ 1. Show loader initially (no redux user + API pending)
  it("shows loader while fetching user", () => {
    authFetchMock.mockReturnValue(new Promise(() => {})); // pending

    render(<UserProfilePage />);

    expect(screen.getByText("LOADER")).toBeInTheDocument();
  });

  // ✅ 2. Render user from Redux (no API call)
  it("renders user from redux if available", () => {
    selectorState.users.items = [
      {
        id: 1,
        name: "John Doe",
        username: "john",
        email: "john@test.com",
        phone: "123",
        website: "john.com",
        address: {
          street: "Street",
          suite: "Apt 1",
          city: "City",
          zipcode: "12345",
        },
        company: {
          name: "Company",
          catchPhrase: "We build things",
        },
      },
    ];

    render(<UserProfilePage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@john")).toBeInTheDocument();
  });

  // ✅ 3. Fetch and render user from API
  it("fetches and renders user when not in redux", async () => {
    authFetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Remote User",
        username: "remote",
        email: "remote@test.com",
        phone: "999",
        website: "remote.com",
        address: {
          street: "Street",
          suite: "Suite",
          city: "City",
          zipcode: "00000",
        },
        company: {
          name: "Remote Co",
          catchPhrase: "Remote phrase",
        },
      }),
    });

    render(<UserProfilePage />);

    expect(await screen.findByText("Remote User")).toBeInTheDocument();
    expect(screen.getByText("@remote")).toBeInTheDocument();
  });

  // ✅ 4. Show error when API fails
  it("shows error when fetch fails", async () => {
    authFetchMock.mockRejectedValue(new Error("Failed"));

    render(<UserProfilePage />);

    expect(
      await screen.findByText(/could not load this profile/i)
    ).toBeInTheDocument();
  });

  // ✅ 5. Show error when response not ok
  it("shows error when response is not ok", async () => {
    authFetchMock.mockResolvedValue({
      ok: false,
    });

    render(<UserProfilePage />);

    expect(
      await screen.findByText(/could not load this profile/i)
    ).toBeInTheDocument();
  });

  // ✅ 6. Back link exists
  it("shows back link", async () => {
    selectorState.users.items = [
      {
        id: 1,
        name: "John Doe",
        username: "john",
        email: "john@test.com",
        phone: "123",
        website: "john.com",
        address: {
          street: "Street",
          suite: "Apt 1",
          city: "City",
          zipcode: "12345",
        },
        company: {
          name: "Company",
          catchPhrase: "We build things",
        },
      },
    ];

    render(<UserProfilePage />);

    expect(screen.getByText(/back to list/i)).toBeInTheDocument();
  });
});
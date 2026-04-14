import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../HomePage.jsx";

let selectorState;
const dispatchMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
  useSelector: (selector) => selector(selectorState),
}));

const fetchUsersAction = { type: "users/fetchAll" };
vi.mock("../../store/usersSlice", () => ({
  fetchUsers: () => fetchUsersAction,
}));

vi.mock("../../components/Loader", () => ({
  default: () => <div>LOADER</div>,
}));

vi.mock("../../components/UserCard", () => ({
  default: ({ user }) => <div>{user.name}</div>,
}));

beforeEach(() => {
  dispatchMock.mockClear();
  selectorState = {
    users: {
      items: [],
      loading: false,
      error: null,
    },
  };
});

describe("HomePage", () => {
  it("dispatches fetchUsers on mount", () => {
    render(<HomePage />);
    expect(dispatchMock).toHaveBeenCalledWith(fetchUsersAction);
  });

  it("shows loader when loading and no items", () => {
    selectorState.users.loading = true;
    selectorState.users.items = [];

    render(<HomePage />);

    expect(screen.getByText("LOADER")).toBeInTheDocument();
  });

  it("shows empty state when not loading, no items, and no error", () => {
    selectorState.users.loading = false;
    selectorState.users.items = [];
    selectorState.users.error = null;

    render(<HomePage />);

    expect(screen.getByText("All users")).toBeInTheDocument();
    expect(screen.getByText("No users to display")).toBeInTheDocument();
  });

  it("renders users list", () => {
    selectorState.users.items = [
      { id: 1, name: "Leanne Graham" },
      { id: 2, name: "Ervin Howell" },
    ];

    render(<HomePage />);

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  });

  it("shows retry button on error and dispatches fetchUsers on click", async () => {
    selectorState.users.error = "Failed to load users";

    render(<HomePage />);

    const retry = screen.getByRole("button", { name: /retry/i });
    await userEvent.click(retry);

    expect(dispatchMock).toHaveBeenCalledWith(fetchUsersAction);
    expect(dispatchMock.mock.calls.filter((c) => c[0] === fetchUsersAction)).toHaveLength(2);
  });
});


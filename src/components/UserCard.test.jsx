import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserCard from "./UserCard";

// 🔹 Mocks
let dispatchMock;
let navigateMock;
let confirmMock;
let deleteUserMock;
let toggleFavoriteMock;

// Mock redux
vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

// Mock router
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

// Mock actions
vi.mock("../store/usersSlice", () => ({
  deleteUser: (id) => deleteUserMock(id),
  toggleFavorite: (id) => toggleFavoriteMock(id),
}));

// Mock Edit modal
vi.mock("./EditUserModal", () => ({
  default: ({ open }) => (open ? <div>Edit Modal</div> : null),
}));

// Mock antd Modal.confirm
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    Modal: {
      ...actual.Modal,
      confirm: (...args) => confirmMock(...args),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();

  dispatchMock = vi.fn();
  navigateMock = vi.fn();
  confirmMock = vi.fn();

  deleteUserMock = vi.fn((id) => ({ type: "delete", payload: id }));
  toggleFavoriteMock = vi.fn((id) => ({ type: "fav", payload: id }));
});

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@test.com",
  phone: "123456",
  website: "john.com",
  favorite: false,
};

describe("UserCard", () => {
  it("renders user details", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("john.com")).toBeInTheDocument();
  });

  it("navigates to profile on card click", async () => {
    render(<UserCard user={mockUser} />);

    await userEvent.click(screen.getByText("John Doe"));

    expect(navigateMock).toHaveBeenCalledWith("/user/1");
  });

  it("toggles favorite on click", async () => {
    render(<UserCard user={mockUser} />);

    const favBtn = screen.getByLabelText(/add to favourites/i);

    await userEvent.click(favBtn);

    expect(toggleFavoriteMock).toHaveBeenCalledWith(1);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("opens edit modal on edit click", async () => {
    render(<UserCard user={mockUser} />);

    const editBtn = screen.getByLabelText(/edit profile/i);

    await userEvent.click(editBtn);

    expect(screen.getByText("Edit Modal")).toBeInTheDocument();
  });

  it("shows confirm modal on delete click", async () => {
    render(<UserCard user={mockUser} />);

    const deleteBtn = screen.getByLabelText(/delete user/i);

    await userEvent.click(deleteBtn);

    expect(confirmMock).toHaveBeenCalled();
  });

  it("dispatches deleteUser on confirm ok", async () => {
    confirmMock.mockImplementation(({ onOk }) => onOk());

    render(<UserCard user={mockUser} />);

    const deleteBtn = screen.getByLabelText(/delete user/i);

    await userEvent.click(deleteBtn);

    expect(deleteUserMock).toHaveBeenCalledWith(1);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("does not trigger navigation when clicking action buttons", async () => {
    render(<UserCard user={mockUser} />);

    const favBtn = screen.getByLabelText(/add to favourites/i);

    await userEvent.click(favBtn);

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
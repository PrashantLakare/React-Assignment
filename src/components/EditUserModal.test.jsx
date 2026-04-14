import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditUserModal from "./EditUserModal";

// 🔹 Mocks
let dispatchMock;
let updateUserMock;
let messageSuccessMock;

// Mock redux
vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

// Mock action
vi.mock("../store/usersSlice", () => ({
  updateUser: (payload) => updateUserMock(payload),
}));

// Mock antd message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: (...args) => messageSuccessMock(...args),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();

  dispatchMock = vi.fn();
  updateUserMock = vi.fn((payload) => payload);
  messageSuccessMock = vi.fn();
});

const mockUser = {
  id: 1,
  name: "John Doe",
  username: "john",
  email: "john@test.com",
  phone: "123",
  website: "john.com",
  address: {
    street: "Street",
    suite: "Suite",
    city: "City",
    zipcode: "12345",
  },
  company: {
    name: "Company",
  },
};

describe("EditUserModal", () => {
  it("renders modal when open", () => {
    render(<EditUserModal open={true} user={mockUser} onClose={vi.fn()} />);

    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
  });

  it("prefills form with user data", () => {
    render(<EditUserModal open={true} user={mockUser} onClose={vi.fn()} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@test.com")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<EditUserModal open={false} user={mockUser} onClose={vi.fn()} />);

    expect(screen.queryByText(/edit profile/i)).not.toBeInTheDocument();
  });

  it("shows validation error when required fields are empty", async () => {
    render(<EditUserModal open={true} user={mockUser} onClose={vi.fn()} />);

    const nameInput = screen.getByDisplayValue("John Doe");
    await userEvent.clear(nameInput);

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

it("dispatches updateUser on valid submit", async () => {
    const onCloseMock = vi.fn();
  
    render(<EditUserModal open={true} user={mockUser} onClose={onCloseMock} />);
  
    const nameInput = screen.getByDisplayValue("John Doe");
  
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Name");
  
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
  
    expect(dispatchMock).toHaveBeenCalled();
  
    expect(updateUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Updated Name",
      })
    );
  
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("does not dispatch if user is missing", async () => {
    render(<EditUserModal open={true} user={null} onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
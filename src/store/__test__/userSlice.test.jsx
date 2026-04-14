import { describe, it, expect, vi, beforeEach } from "vitest";
import reducer, {
  updateUser,
  deleteUser,
  toggleFavorite,
  fetchUsers,
} from "../usersSlice.js";

// 🔹 Mock API
let authFetchMock;

vi.mock("../../auth/api", () => ({
  authFetch: (...args) => authFetchMock(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  authFetchMock = vi.fn();
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const mockUsers = [
  {
    id: 1,
    name: "John",
    address: { city: "City" },
    company: { name: "Company" },
  },
];

describe("usersSlice reducers", () => {
  it("updates user correctly (deep merge)", () => {
    const state = {
      ...initialState,
      items: [
        {
          id: 1,
          name: "John",
          address: { city: "Old" },
          company: { name: "OldCo" },
        },
      ],
    };

    const newState = reducer(
      state,
      updateUser({
        id: 1,
        name: "Updated",
        address: { city: "New" },
      })
    );

    expect(newState.items[0].name).toBe("Updated");
    expect(newState.items[0].address.city).toBe("New");
    expect(newState.items[0].company.name).toBe("OldCo"); // preserved
  });

  it("does nothing if user not found in updateUser", () => {
    const state = { ...initialState, items: [] };

    const newState = reducer(
      state,
      updateUser({ id: 999, name: "Test" })
    );

    expect(newState).toEqual(state);
  });

  it("deletes user correctly", () => {
    const state = {
      ...initialState,
      items: [{ id: 1 }, { id: 2 }],
    };

    const newState = reducer(state, deleteUser(1));

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].id).toBe(2);
  });

  it("toggles favorite", () => {
    const state = {
      ...initialState,
      items: [{ id: 1, favorite: false }],
    };

    const newState = reducer(state, toggleFavorite(1));

    expect(newState.items[0].favorite).toBe(true);
  });
});

describe("fetchUsers thunk", () => {
  it("dispatches fulfilled on success", async () => {
    authFetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });

    const dispatch = vi.fn();
    const result = await fetchUsers()(dispatch, () => ({}), undefined);

    expect(result.type).toBe("users/fetchAll/fulfilled");
    expect(result.payload[0].favorite).toBe(false); // normalized
  });

  it("dispatches rejected on API error", async () => {
    authFetchMock.mockResolvedValue({
      ok: false,
    });

    const dispatch = vi.fn();
    const result = await fetchUsers()(dispatch, () => ({}), undefined);

    expect(result.type).toBe("users/fetchAll/rejected");
    expect(result.payload).toBe("Failed to load users");
  });

  it("handles fetch exception", async () => {
    authFetchMock.mockRejectedValue(new Error("Network error"));

    const dispatch = vi.fn();
    const result = await fetchUsers()(dispatch, () => ({}), undefined);

    expect(result.type).toBe("users/fetchAll/rejected");
    expect(result.payload).toBe("Network error");
  });
});

describe("extraReducers", () => {
  it("sets loading true on pending", () => {
    const action = { type: fetchUsers.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("sets data on fulfilled", () => {
    const action = {
      type: fetchUsers.fulfilled.type,
      payload: [{ id: 1 }],
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual([{ id: 1 }]);
  });

  it("sets error on rejected", () => {
    const action = {
      type: fetchUsers.rejected.type,
      payload: "Error",
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error");
  });
});
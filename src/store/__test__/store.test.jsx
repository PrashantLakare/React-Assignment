import { describe, it, expect } from "vitest";
import { store } from "../store.js";

describe("Redux Store", () => {
  it("should initialize with users slice", () => {
    const state = store.getState();

    expect(state).toHaveProperty("users");
  });

  it("should have initial users state", () => {
    const state = store.getState();

    expect(state.users).toBeDefined();
    expect(state.users).toHaveProperty("items");
    expect(state.users).toHaveProperty("loading");
    expect(state.users).toHaveProperty("error");
  });

  it("should handle dispatching actions", () => {
    // Example: dispatch a dummy action (depends on your reducer)
    store.dispatch({ type: "users/toggleFavorite", payload: 1 });

    const state = store.getState();

    expect(state.users).toBeDefined();
  });
});
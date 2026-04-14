/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  isAuthenticated,
  login,
} from "../auth.js";

// 🔹 Mocks
let fetchMock;

beforeEach(() => {
  vi.clearAllMocks();

  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };

  fetchMock = vi.fn();
  global.fetch = fetchMock;
});

describe("Auth utils", () => {
  it("sets and gets access token", () => {
    setAccessToken("abc123");

    expect(localStorage.setItem).toHaveBeenCalledWith("accessToken", "abc123");
    expect(getAccessToken()).toBe("abc123");
  });

  it("clears access token", () => {
    setAccessToken("abc123");

    clearAccessToken();

    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
  });

  it("returns null if localStorage throws error", () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(getAccessToken()).toBe(null);
  });

  it("isAuthenticated returns true when token exists", () => {
    setAccessToken("token");

    expect(isAuthenticated()).toBe(true);
  });

  it("isAuthenticated returns false when no token", () => {
    expect(isAuthenticated()).toBe(false);
  });
});

describe("login", () => {
  it("logs in successfully and stores token", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "my-token",
      }),
    });

    const token = await login({
      email: "test@test.com",
      password: "123456",
    });

    expect(token).toBe("my-token");
    expect(localStorage.setItem).toHaveBeenCalledWith("accessToken", "my-token");
  });

  it("supports different token keys", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "alt-token",
      }),
    });

    const token = await login({
      email: "test@test.com",
      password: "123456",
    });

    expect(token).toBe("alt-token");
  });

  it("throws error when response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Invalid credentials",
      }),
    });

    await expect(
      login({ email: "wrong", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });

  it("falls back to default error message", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await expect(
      login({ email: "wrong", password: "wrong" })
    ).rejects.toThrow("Invalid Login");
  });

  it("throws error if token is missing in response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(
      login({ email: "test", password: "123" })
    ).rejects.toThrow("Invalid Login");
  });

  it("handles invalid JSON response gracefully", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    await expect(
      login({ email: "test", password: "123" })
    ).rejects.toThrow("Invalid Login");
  });
});
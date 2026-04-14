import { describe, it, expect, vi, beforeEach } from "vitest";
import { authFetch } from "./api";

// 🔹 Mocks
let getAccessTokenMock;
let fetchMock;

// Mock auth
vi.mock("./auth", () => ({
  getAccessToken: () => getAccessTokenMock(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  getAccessTokenMock = vi.fn();
  fetchMock = vi.fn();

  // eslint-disable-next-line no-undef
  global.fetch = fetchMock;
});

describe("authFetch", () => {
  it("adds Authorization header when token exists", async () => {
    getAccessTokenMock.mockReturnValue("my-token");

    fetchMock.mockResolvedValue({ ok: true });

    await authFetch("/test");

    expect(fetchMock).toHaveBeenCalledWith(
      "/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get("Authorization")).toBe("Bearer my-token");
  });

  it("does not add Authorization header when token is missing", async () => {
    getAccessTokenMock.mockReturnValue(null);

    fetchMock.mockResolvedValue({ ok: true });

    await authFetch("/test");

    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get("Authorization")).toBe(null);
  });

  it("merges existing headers correctly", async () => {
    getAccessTokenMock.mockReturnValue("token123");

    fetchMock.mockResolvedValue({ ok: true });

    await authFetch("/test", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const headers = fetchMock.mock.calls[0][1].headers;

    expect(headers.get("Authorization")).toBe("Bearer token123");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("passes other options to fetch", async () => {
    getAccessTokenMock.mockReturnValue("token123");

    fetchMock.mockResolvedValue({ ok: true });

    await authFetch("/test", {
      method: "POST",
      body: JSON.stringify({ name: "John" }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/test",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "John" }),
      })
    );
  });
});
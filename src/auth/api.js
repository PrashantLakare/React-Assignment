import { getAccessToken } from "./auth";

export async function authFetch(url, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}


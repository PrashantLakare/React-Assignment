const TOKEN_KEY = "accessToken";

export function getAccessToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage errors (e.g. blocked in private mode)
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

function extractToken(payload) {
  if (!payload || typeof payload !== "object") return null;
  return payload.access_token ?? payload.accessToken ?? payload.token ?? null;
}

export async function login({ email, password }) {
  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const message =
      (payload && (payload.message || payload.error || payload.detail)) || "Invalid Login";
    throw new Error(message);
  }

  const token = extractToken(payload);
  if (!token) {
    throw new Error("Invalid Login");
  }

  setAccessToken(token);
  return token;
}


import { useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Space, Typography } from "antd";
import { isAuthenticated, login } from "../auth/auth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fromPath = useMemo(() => {
    const state = location.state;
    if (state && typeof state === "object" && state.from && typeof state.from === "string") {
      return state.from;
    }
    return "/";
  }, [location.state]);

  if (isAuthenticated()) {
    return <Navigate to={fromPath} replace />;
  }

  async function onFinish(values) {
    setSubmitting(true);
    setError("");
    try {
      await login({ email: values.email, password: values.password });
      navigate(fromPath, { replace: true });
    } catch (e) {
      const status = e?.status;
      if (status === 401 || status === 403 || e?.message === "Invalid Login") {
        setError("Invalid Login");
      } else {
        setError(e?.message || "Login service unavailable. Please try again.");
        // Helpful detail when the backend/proxy responds with HTML (e.g., 404 Not Found pages)
        // without exposing credentials.
        if (e?.responseText && typeof e.responseText === "string") {
          // only keep a small prefix for display/debug
          const snippet = e.responseText.slice(0, 120).replace(/\s+/g, " ").trim();
          if (snippet) setError((prev) => `${prev} (${snippet})`);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 96px)" }}>
      <Card style={{ width: "min(420px, 100%)" }} styles={{ body: { padding: 24 } }}>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Sign in
            </Typography.Title>
            <Typography.Text type="secondary">
              Use your email and password to continue.
            </Typography.Text>
          </div>

          {error ? <Alert type="error" showIcon title={error} /> : null}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="Username"
              name="email"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input autoComplete="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password autoComplete="current-password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={submitting}>
              Login
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}

export default LoginPage;


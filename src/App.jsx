import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Button, Layout, Space } from "antd";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAccessToken, isAuthenticated } from "./auth/auth";

const { Content } = Layout;

function UserProfileRoute() {
  const { id } = useParams();
  return <UserProfilePage key={id} />;
}

function App() {
  const navigate = useNavigate();

  function onLogout() {
    clearAccessToken();
    navigate("/login", { replace: true });
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px 16px 48px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link to="/" style={{ fontSize: 20, fontWeight: 600, color: "inherit" }}>
              User Profiles
            </Link>

            {isAuthenticated() ? (
              <Space>
                <Button onClick={onLogout}>Logout</Button>
              </Space>
            ) : null}
          </div>
        </header>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserProfileRoute />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;

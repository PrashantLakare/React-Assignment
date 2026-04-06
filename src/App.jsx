import { Link, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "antd";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";

const { Content } = Layout;

function UserProfileRoute() {
  const { id } = useParams();
  return <UserProfilePage key={id} />;
}

function App() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px 16px 48px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: 24 }}>
          <Link to="/" style={{ fontSize: 20, fontWeight: 600, color: "inherit" }}>
            User Profiles
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:id" element={<UserProfileRoute />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;

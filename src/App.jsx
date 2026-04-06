import { Link, Route, Routes, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";

function UserProfileRoute() {
  const { id } = useParams();
  return <UserProfilePage key={id} />;
}

function App() {
  return (
    <div className="container py-4 min-vh-100">
      <header className="mb-4 pb-3 border-bottom">
        <Link to="/" className="h4 mb-0 text-decoration-none text-dark">
          User Profiles
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserProfileRoute />} />
      </Routes>
    </div>
  );
}

export default App;

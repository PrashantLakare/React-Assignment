import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import Loader from "./components/Loader";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // Delay added of 3 seconds to show the loader
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Profiles</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;